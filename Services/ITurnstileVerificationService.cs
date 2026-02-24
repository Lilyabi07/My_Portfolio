namespace MyPortfolio.Services
{
    public record TurnstileVerificationResult(bool Success, bool IsConfigured, string? ErrorMessage = null);

    public interface ITurnstileVerificationService
    {
        Task<TurnstileVerificationResult> VerifyAsync(string? token, string? remoteIp);
    }
}