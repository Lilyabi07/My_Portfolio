namespace MyPortfolio.Services
{
    public interface INotificationService
    {
        Task SendEntityChangedAsync(string entity, string action, object? payload = null);
    }
}