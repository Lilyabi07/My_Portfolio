using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPortfolio.Data;
using MyPortfolio.Models;
using MyPortfolio.Services;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly INotificationService _notifications;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ContactController> _logger;
        private readonly IEmailService _emailService;
        private readonly IProfanityFilterService _profanityFilter;
        private readonly IRateLimitService _rateLimitService;
        private readonly ITurnstileVerificationService _turnstileVerificationService;
        private readonly IWebHostEnvironment _environment;

        public ContactController(ApplicationDbContext db, INotificationService notifications, IConfiguration configuration, ILogger<ContactController> logger, IEmailService emailService, IProfanityFilterService profanityFilter, IRateLimitService rateLimitService, ITurnstileVerificationService turnstileVerificationService, IWebHostEnvironment environment)
        {
            _db = db;
            _notifications = notifications;
            _configuration = configuration;
            _logger = logger;
            _emailService = emailService;
            _profanityFilter = profanityFilter;
            _rateLimitService = rateLimitService;
            _turnstileVerificationService = turnstileVerificationService;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.ContactInformation.OrderByDescending(c => c.UpdatedAt).ToListAsync();
            return Ok(items);
        }

        [HttpGet("messages")]
        [Authorize]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = await _db.ContactMessages.OrderByDescending(m => m.SubmittedAt).ToListAsync();
            return Ok(messages);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.ContactInformation.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPut("messages/{id}/mark-read")]
        [Authorize]
        public async Task<IActionResult> MarkMessageAsRead(int id)
        {
            var message = await _db.ContactMessages.FindAsync(id);
            if (message == null) return NotFound();

            if (!message.IsRead)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow;
                _db.ContactMessages.Update(message);
                await _db.SaveChangesAsync();
            }

            return Ok(message);
        }

        [HttpDelete("messages/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _db.ContactMessages.FindAsync(id);
            if (message == null) return NotFound();

            _db.ContactMessages.Remove(message);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ContactInformation model)
        {
            await _db.ContactInformation.AddAsync(model);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("contact", "create", model);

            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ContactInformation updated)
        {
            var existing = await _db.ContactInformation.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Email = updated.Email ?? existing.Email;
            existing.Phone = updated.Phone ?? existing.Phone;
            existing.Address = updated.Address ?? existing.Address;
            existing.Notes = updated.Notes ?? existing.Notes;
            existing.UpdatedAt = DateTime.UtcNow;

            _db.ContactInformation.Update(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("contact", "update", existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.ContactInformation.FindAsync(id);
            if (existing == null) return NotFound();

            _db.ContactInformation.Remove(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("contact", "delete", new { id });

            return NoContent();
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendContactMessage([FromBody] ContactSubmissionRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Name) || 
                string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            var turnstileResult = await _turnstileVerificationService.VerifyAsync(
                request.TurnstileToken,
                RateLimitService.GetClientIdentifier(HttpContext));

            if (!turnstileResult.IsConfigured)
            {
                if (!_environment.IsDevelopment())
                {
                    _logger.LogWarning("Contact submission blocked because Turnstile is not configured in non-development environment.");
                    return StatusCode(503, new { message = "Contact form protection is not configured. Please try again later." });
                }

                _logger.LogWarning("Turnstile not configured in development environment; continuing without Turnstile verification.");
            }
            else if (!turnstileResult.Success)
            {
                return BadRequest(new { message = "Security verification failed. Please try again." });
            }

            // Rate limit: 5 messages per IP per 1 hour
            var rateLimitError = await _rateLimitService.ValidateRateLimitAsync(
                HttpContext,
                "contact_form",
                TimeSpan.FromHours(1),
                5,
                _logger,
                $"Too many messages. Please try again in {{seconds}} seconds.");

            if (rateLimitError != null)
                return rateLimitError;

            // Check for profanity in message and name
            var combinedText = $"{request.Name} {request.Message}";
            var profanityCheck = _profanityFilter.CheckProfanity(combinedText);

            if (profanityCheck.HasProfanity)
            {
                var flaggedWords = string.Join(", ", profanityCheck.Words);
                _logger.LogWarning($"Contact form submission blocked due to profanity. Words: {flaggedWords}");
                return BadRequest(new { message = $"Please maintain professional language. Avoid using: {flaggedWords}" });
            }

            try
            {
                var message = new ContactMessage
                {
                    Name = request.Name.Trim(),
                    Email = request.Email.Trim(),
                    Message = request.Message.Trim(),
                    SubmittedAt = DateTime.UtcNow
                };

                // Save message to database
                await _db.ContactMessages.AddAsync(message);
                await _db.SaveChangesAsync();

                // Send email notification to admin
                await _emailService.SendContactEmailAsync(message.Name, message.Email, message.Message);
                var clientIp = RateLimitService.GetClientIdentifier(HttpContext);
                _logger.LogInformation($"Contact form submission processed - Name: {message.Name}, Email: {message.Email}, IP: {clientIp}");

                return Ok(new { 
                    success = true, 
                    message = "Message sent successfully!"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing contact form");
                return StatusCode(500, new { message = "Failed to send message. Please try again later." });
            }
        }

        public class ContactSubmissionRequest
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Message { get; set; } = string.Empty;
            public string? TurnstileToken { get; set; }
        }
    }
}