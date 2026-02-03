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
    public class TestimonialsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly INotificationService _notifications;

        public TestimonialsController(ApplicationDbContext db, INotificationService notifications)
        {
            _db = db;
            _notifications = notifications;
        }

        [HttpGet]
        public async Task<IActionResult> GetTestimonials()
        {
            // Only return published testimonials for public view
            var published = await _db.Testimonials
                .Where(t => t.IsPublished)
                .OrderByDescending(t => t.SubmittedDate)
                .ToListAsync();

            return Ok(published);
        }

        [HttpGet("admin/all")]
        [Authorize]
        public async Task<IActionResult> GetAllTestimonials()
        {
            // Return all testimonials (published and pending) for admin view
            var all = await _db.Testimonials
                .OrderByDescending(t => t.SubmittedDate)
                .ToListAsync();

            return Ok(all);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTestimonial(int id)
        {
            var testimonial = await _db.Testimonials
                .Where(t => t.Id == id && t.IsPublished)
                .FirstOrDefaultAsync();

            if (testimonial == null) return NotFound();
            return Ok(testimonial);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTestimonial([FromBody] Testimonial testimonial)
        {
            if (testimonial == null || string.IsNullOrWhiteSpace(testimonial.Name) || string.IsNullOrWhiteSpace(testimonial.Message))
                return BadRequest("Name and Message are required");

            testimonial.IsPublished = false; // New testimonials are pending approval
            testimonial.SubmittedDate = DateTime.UtcNow;

            await _db.Testimonials.AddAsync(testimonial);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("testimonials", "create", testimonial);

            return CreatedAtAction(nameof(GetTestimonial), new { id = testimonial.Id }, testimonial);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateTestimonial(int id, [FromBody] Testimonial updatedTestimonial)
        {
            var testimonial = await _db.Testimonials.FindAsync(id);
            if (testimonial == null) return NotFound();

            testimonial.Name = updatedTestimonial.Name ?? testimonial.Name;
            testimonial.Title = updatedTestimonial.Title ?? testimonial.Title;
            testimonial.Company = updatedTestimonial.Company ?? testimonial.Company;
            testimonial.Message = updatedTestimonial.Message ?? testimonial.Message;
            testimonial.Avatar = updatedTestimonial.Avatar ?? testimonial.Avatar;
            testimonial.Rating = updatedTestimonial.Rating ?? testimonial.Rating;

            _db.Testimonials.Update(testimonial);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("testimonials", "update", testimonial);

            return NoContent();
        }

        [HttpPut("{id}/publish")]
        [Authorize]
        public async Task<IActionResult> PublishTestimonial(int id)
        {
            var testimonial = await _db.Testimonials.FindAsync(id);
            if (testimonial == null) return NotFound();

            testimonial.IsPublished = true;
            _db.Testimonials.Update(testimonial);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("testimonials", "update", testimonial);

            return NoContent();
        }

        [HttpPut("{id}/unpublish")]
        [Authorize]
        public async Task<IActionResult> UnpublishTestimonial(int id)
        {
            var testimonial = await _db.Testimonials.FindAsync(id);
            if (testimonial == null) return NotFound();

            testimonial.IsPublished = false;
            _db.Testimonials.Update(testimonial);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("testimonials", "update", testimonial);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTestimonial(int id)
        {
            var testimonial = await _db.Testimonials.FindAsync(id);
            if (testimonial == null) return NotFound();

            _db.Testimonials.Remove(testimonial);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("testimonials", "delete", new { id });

            return NoContent();
        }
    }
}
