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
    public class EducationController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly INotificationService _notifications;

        public EducationController(ApplicationDbContext db, INotificationService notifications)
        {
            _db = db;
            _notifications = notifications;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.Education.OrderBy(e => e.DisplayOrder).ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.Education.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] Education model)
        {
            await _db.Education.AddAsync(model);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("education", "create", model);

            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] Education updated)
        {
            var existing = await _db.Education.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Institution = updated.Institution ?? existing.Institution;
            existing.Degree = updated.Degree ?? existing.Degree;
            existing.StartDate = updated.StartDate;
            existing.EndDate = updated.EndDate;
            existing.IsCurrent = updated.IsCurrent;
            existing.Description = updated.Description ?? existing.Description;
            existing.DisplayOrder = updated.DisplayOrder;

            _db.Education.Update(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("education", "update", existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Education.FindAsync(id);
            if (existing == null) return NotFound();

            _db.Education.Remove(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("education", "delete", new { id });

            return NoContent();
        }
    }
}