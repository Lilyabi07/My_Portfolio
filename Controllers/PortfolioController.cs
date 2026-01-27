using Microsoft.AspNetCore.Mvc;
using MyPortfolio.Models;
using System.Collections.Generic;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        [HttpGet("skills")]
        public IActionResult GetSkills()
        {
            var skills = new List<Skill>
            {
                new Skill { Id = 1, Name = "C# / .NET", Proficiency = 90, Icon = "fa-code" },
                new Skill { Id = 2, Name = "React", Proficiency = 85, Icon = "fa-react" },
                new Skill { Id = 3, Name = "ASP.NET MVC", Proficiency = 88, Icon = "fa-server" }
            };
            return Ok(skills);
        }

        [HttpGet("projects")]
        public IActionResult GetProjects()
        {
            var projects = new List<Project>
            {
                new Project 
                { 
                    Id = 1, 
                    Title = "Portfolio Website", 
                    Description = "Modern portfolio built with ASP.NET MVC and React",
                    Technologies = "ASP.NET, React, Entity Framework"
                }
            };
            return Ok(projects);
        }
    }
}
