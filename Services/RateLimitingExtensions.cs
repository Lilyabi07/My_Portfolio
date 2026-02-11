using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyPortfolio.Services
{
    /// <summary>
    /// Extension methods for common rate limiting validation patterns
    /// Consolidates repeated logic from Contact and Testimonials controllers
    /// </summary>
    public static class RateLimitingExtensions
    {
        /// <summary>
        /// Validates rate limit and returns IActionResult if limit exceeded
        /// </summary>
        /// <param name="service">Rate limit service</param>
        /// <param name="context">HTTP context for getting client IP</param>
        /// <param name="action">Action identifier for rate limiting</param>
        /// <param name="timeWindow">Time window for the limit</param>
        /// <param name="maxAttempts">Maximum attempts allowed</param>
        /// <param name="logger">Logger for recording violations</param>
        /// <param name="humanReadableMessage">Optional custom error message (for formatting like "X hours Y minutes")</param>
        /// <returns>IActionResult if limit exceeded, null if allowed</returns>
        public static async Task<IActionResult?> ValidateRateLimitAsync(
            this IRateLimitService service,
            HttpContext context,
            string action,
            TimeSpan timeWindow,
            int maxAttempts,
            ILogger logger,
            string? humanReadableMessage = null)
        {
            var clientIp = RateLimitService.GetClientIdentifier(context);
            var rateLimitResult = await service.CheckRateLimitAsync(
                clientIp,
                action,
                timeWindow,
                maxAttempts);

            if (!rateLimitResult.allowed)
            {
                var retrySeconds = (int)rateLimitResult.retryAfter.TotalSeconds;
                logger.LogWarning($"Rate limit exceeded for {action} from IP: {clientIp}. Retry after: {retrySeconds}s");

                var message = humanReadableMessage ?? $"Too many requests. Please try again in {retrySeconds} seconds.";

                return new ObjectResult(new { message, retryAfter = retrySeconds })
                {
                    StatusCode = 429
                };
            }

            return null;
        }
    }
}
