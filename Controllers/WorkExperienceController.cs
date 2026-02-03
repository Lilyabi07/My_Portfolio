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
    public class WorkExperienceController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly INotificationService _notifications;

        public WorkExperienceController(ApplicationDbContext db, INotificationService notifications)
        {
            _db = db;
            _notifications = notifications;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.WorkExperiences.OrderBy(e => e.DisplayOrder).ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.WorkExperiences.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] WorkExperience model)
        {
            await _db.WorkExperiences.AddAsync(model);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("work-experience", "create", model);

            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] WorkExperience updated)
        {
            var existing = await _db.WorkExperiences.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Company = updated.Company ?? existing.Company;
            existing.Position = updated.Position ?? existing.Position;
            existing.StartDate = updated.StartDate;
            existing.EndDate = updated.EndDate;
            existing.IsCurrent = updated.IsCurrent;
            existing.Description = updated.Description ?? existing.Description;
            existing.DisplayOrder = updated.DisplayOrder;

            _db.WorkExperiences.Update(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("work-experience", "update", existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.WorkExperiences.FindAsync(id);
            if (existing == null) return NotFound();

            _db.WorkExperiences.Remove(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("work-experience", "delete", new { id });

            return NoContent();
        }
    }
}
