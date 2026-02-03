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
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly INotificationService _notifications;
        private readonly ILogger<ProjectsController> _logger;

        public ProjectsController(ApplicationDbContext db, INotificationService notifications, ILogger<ProjectsController> logger)
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
                var projects = await _db.Projects
                    .OrderBy(p => p.DisplayOrder)
                    .ToListAsync();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                // Log full exception server-side
                _logger.LogError(ex, "Error in ProjectsController.GetAll");

                // In Development, return exception details for debugging.
                // Do NOT return full exception in production.
                if (HttpContext.RequestServices.GetService(typeof(Microsoft.AspNetCore.Hosting.IWebHostEnvironment)) is Microsoft.AspNetCore.Hosting.IWebHostEnvironment env
                    && env.IsDevelopment())
                {
                    return Problem(detail: ex.ToString(), title: "Projects fetch failed");
                }

                return StatusCode(500, "An error occurred while fetching projects.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _db.Projects.FindAsync(id);
            if (project == null) return NotFound();
            return Ok(project);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateProjectRequest request)
        {
            var project = new Project
            {
                Title = request.Title,
                Description = request.Description,
                Technologies = request.Technologies,
                ProjectUrl = request.ProjectUrl,
                GithubUrl = request.GithubUrl,
                ImageUrl = request.ImageUrl,
                DisplayOrder = request.DisplayOrder
            };

            await _db.Projects.AddAsync(project);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("projects", "create", project);

            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectRequest request)
        {
            var existing = await _db.Projects.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = request.Title ?? existing.Title;
            existing.Description = request.Description ?? existing.Description;
            existing.Technologies = request.Technologies ?? existing.Technologies;
            existing.ProjectUrl = request.ProjectUrl ?? existing.ProjectUrl;
            existing.GithubUrl = request.GithubUrl ?? existing.GithubUrl;
            existing.ImageUrl = request.ImageUrl ?? existing.ImageUrl;
            existing.DisplayOrder = request.DisplayOrder;

            _db.Projects.Update(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("projects", "update", existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Projects.FindAsync(id);
            if (existing == null) return NotFound();

            _db.Projects.Remove(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("projects", "delete", new { id });

            return NoContent();
        }
    }

    public class CreateProjectRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Technologies { get; set; } = string.Empty;
        public string? ProjectUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class UpdateProjectRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Technologies { get; set; }
        public string? ProjectUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; }
    }
}
