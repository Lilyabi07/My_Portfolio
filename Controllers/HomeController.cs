using Microsoft.AspNetCore.Mvc;
using MyPortfolio.Models;

namespace MyPortfolio.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetPortfolioData()
        {
            var data = new
            {
                skills = new[] 
                { 
                    new { name = "C#", proficiency = 90 },
                    new { name = "React", proficiency = 85 },
                    new { name = "ASP.NET MVC", proficiency = 88 }
                },
                projects = new[]
                {
                    new { title = "Portfolio Website", description = "Modern portfolio with ASP.NET and React" }
                }
            };
            return Json(data);
        }
    }
}
