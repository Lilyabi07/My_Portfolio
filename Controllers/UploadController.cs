using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly ILogger<UploadController> _logger;
        private readonly string _uploadDir;

        public UploadController(ILogger<UploadController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            var uploadsRoot = Path.Combine(Environment.GetEnvironmentVariable("HOME") ?? env.ContentRootPath, "uploads");
            _uploadDir = Path.Combine(uploadsRoot, "projects");
            
            // Ensure directory exists
            Directory.CreateDirectory(_uploadDir);
        }

        [HttpPost("project-image")]
        [Authorize]
        public async Task<IActionResult> UploadProjectImage([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file provided" });
                }

                // Validate file
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { message = "Invalid file type. Only image files are allowed." });
                }

                // Check file size (max 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File size exceeds 5MB limit" });
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(_uploadDir, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/uploads/projects/{fileName}";
                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading project image");
                return StatusCode(500, new { message = "Error uploading file" });
            }
        }
    }
}
