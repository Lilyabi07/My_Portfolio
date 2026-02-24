using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyPortfolio.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IRateLimitService _rateLimitService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IConfiguration configuration, IRateLimitService rateLimitService, ILogger<AuthController> logger)
        {
            _configuration = configuration;
            _rateLimitService = rateLimitService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { success = false, message = "Username and password are required" });
            }

            var rateLimitError = await _rateLimitService.ValidateRateLimitAsync(
                HttpContext,
                "auth_login",
                TimeSpan.FromMinutes(15),
                8,
                _logger,
                "Too many login attempts. Please try again in {seconds} seconds.");

            if (rateLimitError != null)
                return rateLimitError;

            // Load credentials from configuration
            var adminUsername = _configuration["Admin:Username"];
            var adminPassword = _configuration["Admin:Password"];

            if (string.IsNullOrWhiteSpace(adminUsername) || string.IsNullOrWhiteSpace(adminPassword))
            {
                _logger.LogError("Admin credentials are not configured. Set Admin:Username and Admin:Password via secure configuration.");
                return StatusCode(500, new { success = false, message = "Server authentication is not configured" });
            }

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
            {
                _logger.LogError("JWT key is missing or too short. Configure Jwt:Key with at least 32 characters.");
                return StatusCode(500, new { success = false, message = "Server token signing is not configured" });
            }

            if (string.Equals(request.Username, adminUsername, StringComparison.Ordinal) &&
                string.Equals(request.Password, adminPassword, StringComparison.Ordinal))
            {
                var token = GenerateJwtToken(request.Username, jwtKey);
                return Ok(new { success = true, token, message = "Login successful" });
            }

            return Unauthorized(new { success = false, message = "Invalid username or password" });
        }

        private string GenerateJwtToken(string username, string jwtKey)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, username),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, "admin")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "MyPortfolio",
                audience: _configuration["Jwt:Audience"] ?? "MyPortfolioUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}
