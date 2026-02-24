using System.Text.Json;

namespace MyPortfolio.Services
{
    public class TurnstileVerificationService : ITurnstileVerificationService
    {
        private const string VerifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<TurnstileVerificationService> _logger;

        public TurnstileVerificationService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<TurnstileVerificationService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<TurnstileVerificationResult> VerifyAsync(string? token, string? remoteIp)
        {
            var secretKey = _configuration["Turnstile:SecretKey"];

            if (string.IsNullOrWhiteSpace(secretKey))
            {
                return new TurnstileVerificationResult(Success: false, IsConfigured: false);
            }

            if (string.IsNullOrWhiteSpace(token))
            {
                return new TurnstileVerificationResult(Success: false, IsConfigured: true, ErrorMessage: "Missing turnstile token.");
            }

            try
            {
                var client = _httpClientFactory.CreateClient();
                using var request = new HttpRequestMessage(HttpMethod.Post, VerifyEndpoint)
                {
                    Content = new FormUrlEncodedContent(new Dictionary<string, string>
                    {
                        ["secret"] = secretKey,
                        ["response"] = token,
                        ["remoteip"] = remoteIp ?? string.Empty
                    })
                };

                using var response = await client.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Turnstile verification request failed with status {StatusCode}", response.StatusCode);
                    return new TurnstileVerificationResult(Success: false, IsConfigured: true, ErrorMessage: "Turnstile validation request failed.");
                }

                using var document = JsonDocument.Parse(responseContent);
                var root = document.RootElement;
                var success = root.TryGetProperty("success", out var successElement) && successElement.GetBoolean();

                if (success)
                {
                    return new TurnstileVerificationResult(Success: true, IsConfigured: true);
                }

                string? errorCodes = null;
                if (root.TryGetProperty("error-codes", out var errorsElement) && errorsElement.ValueKind == JsonValueKind.Array)
                {
                    var codes = errorsElement.EnumerateArray()
                        .Where(e => e.ValueKind == JsonValueKind.String)
                        .Select(e => e.GetString())
                        .Where(code => !string.IsNullOrWhiteSpace(code));

                    errorCodes = string.Join(",", codes!);
                }

                _logger.LogWarning("Turnstile verification failed. Error codes: {ErrorCodes}", errorCodes ?? "none");
                return new TurnstileVerificationResult(Success: false, IsConfigured: true, ErrorMessage: "Turnstile validation failed.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Turnstile verification threw an exception.");
                return new TurnstileVerificationResult(Success: false, IsConfigured: true, ErrorMessage: "Turnstile verification error.");
            }
        }
    }
}