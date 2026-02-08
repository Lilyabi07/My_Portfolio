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

        public ContactController(ApplicationDbContext db, INotificationService notifications, IConfiguration configuration, ILogger<ContactController> logger, IEmailService emailService, IProfanityFilterService profanityFilter)
        {
            _db = db;
            _notifications = notifications;
            _configuration = configuration;
            _logger = logger;
            _emailService = emailService;
            _profanityFilter = profanityFilter;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.ContactInformation.OrderByDescending(c => c.UpdatedAt).ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.ContactInformation.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
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
        public async Task<IActionResult> SendContactMessage([FromBody] ContactMessage message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.Name) || 
                string.IsNullOrWhiteSpace(message.Email) || string.IsNullOrWhiteSpace(message.Message))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            // Check for profanity in message and name
            var combinedText = $"{message.Name} {message.Message}";
            var profanityCheck = _profanityFilter.CheckProfanity(combinedText);

            if (profanityCheck.HasProfanity)
            {
                var flaggedWords = string.Join(", ", profanityCheck.Words);
                _logger.LogWarning($"Contact form submission blocked due to profanity. Words: {flaggedWords}");
                return BadRequest(new { message = $"Please maintain professional language. Avoid using: {flaggedWords}" });
            }

            try
            {
                await _emailService.SendContactEmailAsync(message.Name, message.Email, message.Message);
                _logger.LogInformation($"Contact form submission processed - Name: {message.Name}, Email: {message.Email}");

                return Ok(new { success = true, message = "Message sent successfully!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing contact form");
                return StatusCode(500, new { message = "Failed to send message. Please try again later." });
            }
        }
    }
}