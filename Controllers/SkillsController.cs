using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPortfolio.Data;
using MyPortfolio.Models;
using MyPortfolio.Services;
using Microsoft.Extensions.Logging;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkillsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly INotificationService _notifications;
        private readonly ILogger<SkillsController> _logger;

        public SkillsController(ApplicationDbContext db, INotificationService notifications, ILogger<SkillsController> logger)
        {
            _db = db;
            _notifications = notifications;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var items = await _db.Skills.OrderBy(s => s.DisplayOrder).ToListAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SkillsController.GetAll");
                if (HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Hosting.IWebHostEnvironment)) is Microsoft.AspNetCore.Hosting.IWebHostEnvironment env
                    && env.IsDevelopment())
                {
                    return Problem(detail: ex.ToString(), title: "Skills fetch failed");
                }
                return StatusCode(500, "An error occurred while fetching skills.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var item = await _db.Skills.FindAsync(id);
                if (item == null) return NotFound();
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SkillsController.Get");
                if (HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Hosting.IWebHostEnvironment)) is Microsoft.AspNetCore.Hosting.IWebHostEnvironment env
                    && env.IsDevelopment())
                {
                    return Problem(detail: ex.ToString(), title: "Skill fetch failed");
                }
                return StatusCode(500, "An error occurred while fetching the skill.");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] Skill model)
        {
            try
            {
                await _db.Skills.AddAsync(model);
                await _db.SaveChangesAsync();

                await _notifications.SendEntityChangedAsync("skills", "create", model);

                return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SkillsController.Create");
                if (HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Hosting.IWebHostEnvironment)) is Microsoft.AspNetCore.Hosting.IWebHostEnvironment env
                    && env.IsDevelopment())
                {
                    return Problem(detail: ex.ToString(), title: "Skill create failed");
                }
                return StatusCode(500, "An error occurred while creating the skill.");
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] Skill updated)
        {
            try
            {
                var existing = await _db.Skills.FindAsync(id);
                if (existing == null) return NotFound();

                existing.Name = updated.Name ?? existing.Name;
                existing.Proficiency = updated.Proficiency;
                existing.Icon = updated.Icon ?? existing.Icon;
                existing.DisplayOrder = updated.DisplayOrder;

                _db.Skills.Update(existing);
                await _db.SaveChangesAsync();

                await _notifications.SendEntityChangedAsync("skills", "update", existing);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SkillsController.Update");
                if (HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Hosting.IWebHostEnvironment)) is Microsoft.AspNetCore.Hosting.IWebHostEnvironment env
                    && env.IsDevelopment())
                {
                    return Problem(detail: ex.ToString(), title: "Skill update failed");
                }
                return StatusCode(500, "An error occurred while updating the skill.");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var existing = await _db.Skills.FindAsync(id);
                if (existing == null) return NotFound();

                _db.Skills.Remove(existing);
                await _db.SaveChangesAsync();

                await _notifications.SendEntityChangedAsync("skills", "delete", new { id });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SkillsController.Delete");
                if (HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Hosting.IWebHostEnvironment)) is Microsoft.AspNetCore.Hosting.IWebHostEnvironment env
                    && env.IsDevelopment())
                {
                    return Problem(detail: ex.ToString(), title: "Skill delete failed");
                }
                return StatusCode(500, "An error occurred while deleting the skill.");
            }
        }
    }
}
