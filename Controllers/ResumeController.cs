using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPortfolio.Data;
using MyPortfolio.Models;
using MyPortfolio.Services;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumeController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly INotificationService _notifications;
        private readonly IWebHostEnvironment _env;
        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        public ResumeController(ApplicationDbContext db, INotificationService notifications, IWebHostEnvironment env)
        {
            _db = db;
            _notifications = notifications;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _db.Resumes.OrderByDescending(r => r.UpdatedAt).ToListAsync();
            return Ok(items);
        }

        [HttpGet("cv-url")]
        public async Task<IActionResult> GetCvUrl()
        {
            try
            {
                // Get the most recent resume with a file URL
                var latestResume = await _db.Resumes
                    .Where(r => !string.IsNullOrEmpty(r.FileUrl))
                    .OrderByDescending(r => r.UpdatedAt)
                    .FirstOrDefaultAsync();

                if (latestResume == null)
                {
                    return Ok(new { cvUrl = (string?)null });
                }

                return Ok(new { cvUrl = latestResume.FileUrl });
            }
            catch (Exception ex)
            {
                return Ok(new { cvUrl = (string?)null });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.Resumes.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // Upload a resume PDF. Returns created Resume record with FileUrl.
        [HttpPost("upload")]
        [Authorize]
        [RequestSizeLimit(MaxFileSize)]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null) return BadRequest("No file provided.");
            if (file.Length == 0) return BadRequest("Empty file.");
            if (file.Length > MaxFileSize) return BadRequest("File too large (max 5 MB).");

            var ext = Path.GetExtension(file.FileName);
            if (!string.Equals(ext, ".pdf", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Only PDF files are allowed.");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", "resumes");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var resume = new Resume
            {
                FileUrl = $"/uploads/resumes/{fileName}",
                Notes = string.Empty,
                UpdatedAt = DateTime.UtcNow
            };

            await _db.Resumes.AddAsync(resume);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("resume", "create", resume);

            return CreatedAtAction(nameof(Get), new { id = resume.Id }, resume);
        }

        // Update metadata only (not file)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] Resume updated)
        {
            var existing = await _db.Resumes.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Notes = updated.Notes ?? existing.Notes;
            existing.UpdatedAt = DateTime.UtcNow;

            _db.Resumes.Update(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("resume", "update", existing);

            return NoContent();
        }

        // Delete a resume record and remove file from disk if present.
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Resumes.FindAsync(id);
            if (existing == null) return NotFound();

            // Remove physical file if present and path is inside uploads/resumes
            if (!string.IsNullOrWhiteSpace(existing.FileUrl))
            {
                var relative = existing.FileUrl.Replace('/', Path.DirectorySeparatorChar).TrimStart(Path.DirectorySeparatorChar);
                var physical = Path.Combine(_env.WebRootPath ?? "wwwroot", relative);
                if (System.IO.File.Exists(physical))
                {
                    try
                    {
                        System.IO.File.Delete(physical);
                    }
                    catch
                    {
                        // Log if needed; do not fail delete because of file deletion failure
                    }
                }
            }

            _db.Resumes.Remove(existing);
            await _db.SaveChangesAsync();

            await _notifications.SendEntityChangedAsync("resume", "delete", new { id });

            return NoContent();
        }
    }
}