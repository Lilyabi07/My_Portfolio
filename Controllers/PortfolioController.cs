using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPortfolio.Data;
using MyPortfolio.Models;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public PortfolioController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: /api/portfolio/skills
        [HttpGet("skills")]
        public async Task<IActionResult> GetSkills()
        {
            var skills = await _db.Skills
                .OrderBy(s => s.DisplayOrder)
                .ToListAsync();
            return Ok(skills);
        }

        // GET: /api/portfolio/projects
        [HttpGet("projects")]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _db.Projects
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();
            return Ok(projects);
        }
    }
}
