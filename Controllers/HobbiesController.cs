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
    public class HobbiesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly INotificationService _notifications;

        public HobbiesController(ApplicationDbContext db, INotificationService notifications)
        {
            _db = db;
            _notifications = notifications;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.Hobbies.OrderBy(i => i.DisplayOrder).ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.Hobbies.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] Hobby model)
        {
            await _db.Hobbies.AddAsync(model);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("hobbies", "create", model);

            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] Hobby updated)
        {
            var existing = await _db.Hobbies.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = updated.Name ?? existing.Name;
            existing.Icon = updated.Icon ?? existing.Icon;
            existing.Description = updated.Description ?? existing.Description;
            existing.DisplayOrder = updated.DisplayOrder;

            _db.Hobbies.Update(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("hobbies", "update", existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Hobbies.FindAsync(id);
            if (existing == null) return NotFound();

            _db.Hobbies.Remove(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("hobbies", "delete", new { id });

            return NoContent();
        }
    }
}