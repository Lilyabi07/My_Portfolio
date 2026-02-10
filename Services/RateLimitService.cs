using Microsoft.AspNetCore.Http;
using System.Collections.Concurrent;

namespace MyPortfolio.Services
{
    public interface IRateLimitService
    {
        Task<bool> IsAllowedAsync(string identifier, string action, TimeSpan timeWindow, int maxAttempts);
        Task<(bool allowed, int remaining, TimeSpan retryAfter)> CheckRateLimitAsync(string identifier, string action, TimeSpan timeWindow, int maxAttempts);
    }

    public class RateLimitService : IRateLimitService
    {
        private readonly ConcurrentDictionary<string, List<DateTime>> _requestLog = new();
        private readonly ILogger<RateLimitService> _logger;

        public RateLimitService(ILogger<RateLimitService> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Checks if an action is allowed based on rate limit configuration
        /// </summary>
        public async Task<bool> IsAllowedAsync(string identifier, string action, TimeSpan timeWindow, int maxAttempts)
        {
            var key = $"{action}:{identifier}";
            var now = DateTime.UtcNow;
            var cutoff = now.Subtract(timeWindow);

            var allowed = _requestLog.AddOrUpdate(key, 
                new List<DateTime> { now },
                (k, timestamps) =>
                {
                    // Remove old timestamps outside the time window
                    var recentTimestamps = timestamps.Where(t => t > cutoff).ToList();
                    
                    if (recentTimestamps.Count < maxAttempts)
                    {
                        recentTimestamps.Add(now);
                        return recentTimestamps;
                    }
                    
                    return recentTimestamps;
                });

            return allowed.Count <= maxAttempts;
        }

        /// <summary>
        /// Checks rate limit and returns detailed information about remaining attempts and retry time
        /// </summary>
        public async Task<(bool allowed, int remaining, TimeSpan retryAfter)> CheckRateLimitAsync(string identifier, string action, TimeSpan timeWindow, int maxAttempts)
        {
            var key = $"{action}:{identifier}";
            var now = DateTime.UtcNow;
            var cutoff = now.Subtract(timeWindow);

            var result = _requestLog.AddOrUpdate(key,
                new List<DateTime> { now },
                (k, timestamps) =>
                {
                    var recentTimestamps = timestamps.Where(t => t > cutoff).ToList();
                    
                    if (recentTimestamps.Count < maxAttempts)
                    {
                        recentTimestamps.Add(now);
                    }
                    
                    return recentTimestamps;
                });

            var remaining = Math.Max(0, maxAttempts - result.Count);
            TimeSpan retryAfter = TimeSpan.Zero;

            if (result.Count >= maxAttempts && result.Count > 0)
            {
                var oldestRequest = result.First();
                retryAfter = oldestRequest.Add(timeWindow).Subtract(now);
                if (retryAfter.TotalSeconds < 0) retryAfter = TimeSpan.Zero;
            }

            return (result.Count <= maxAttempts, remaining, retryAfter);
        }

        /// <summary>
        /// Gets the client IP address from the HttpContext
        /// </summary>
        public static string GetClientIdentifier(HttpContext context)
        {
            var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedFor))
            {
                var ips = forwardedFor.Split(",");
                return ips[0].Trim();
            }

            return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        }
    }
}
