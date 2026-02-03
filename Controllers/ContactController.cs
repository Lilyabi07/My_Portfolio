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

        public ContactController(ApplicationDbContext db, INotificationService notifications)
        {
            _db = db;
            _notifications = notifications;
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
    }
}