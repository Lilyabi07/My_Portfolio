using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private const string PlaceholderJwtKey = "CHANGE_TO_SECURE_KEY_MIN_32_CHARS";

        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public HealthController(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;
        }

        [HttpGet("live")]
        [AllowAnonymous]
        public IActionResult Live()
        {
            return Ok(new
            {
                status = "ok",
                service = "myportfolio-api",
                environment = _environment.EnvironmentName,
                utc = DateTime.UtcNow
            });
        }

        [HttpGet("config")]
        [Authorize(Policy = "AdminOnly")]
        public IActionResult Config()
        {
            var defaultConnection = _configuration.GetConnectionString("DefaultConnection");
            var adminUsername = _configuration["Admin:Username"];
            var adminPassword = _configuration["Admin:Password"];
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            var checks = new
            {
                database = IsConfigured(defaultConnection),
                adminUsername = IsConfigured(adminUsername),
                adminPassword = IsConfigured(adminPassword),
                jwtKey = IsStrongJwtKey(jwtKey),
                jwtIssuer = IsConfigured(jwtIssuer),
                jwtAudience = IsConfigured(jwtAudience),
                smtpHost = IsConfigured(_configuration["Email:SmtpHost"]),
                smtpUsername = IsConfigured(_configuration["Email:SmtpUsername"]),
                smtpPassword = IsConfigured(_configuration["Email:SmtpPassword"]),
                turnstileSecret = IsConfigured(_configuration["Turnstile:SecretKey"])
            };

            var requiredReady = checks.database &&
                                checks.adminUsername &&
                                checks.adminPassword &&
                                checks.jwtKey &&
                                checks.jwtIssuer &&
                                checks.jwtAudience;

            var response = new
            {
                status = requiredReady ? "ok" : "degraded",
                environment = _environment.EnvironmentName,
                requiredReady,
                optional = new
                {
                    smtpReady = checks.smtpHost && checks.smtpUsername && checks.smtpPassword,
                    turnstileReady = checks.turnstileSecret
                },
                checks,
                utc = DateTime.UtcNow
            };

            return requiredReady ? Ok(response) : StatusCode(StatusCodes.Status503ServiceUnavailable, response);
        }

        private static bool IsConfigured(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return false;
            }

            return !string.Equals(value.Trim(), PlaceholderJwtKey, StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsStrongJwtKey(string? value)
        {
            if (!IsConfigured(value))
            {
                return false;
            }

            return value!.Length >= 32;
        }
    }
}
