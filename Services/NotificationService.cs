using Microsoft.AspNetCore.SignalR;
using MyPortfolio.Hubs;

namespace MyPortfolio.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationsHub> _hub;

        public NotificationService(IHubContext<NotificationsHub> hub)
        {
            _hub = hub;
        }

        public Task SendEntityChangedAsync(string entity, string action, object? payload = null)
        {
            var message = new { entity, action, payload };
            return _hub.Clients.All.SendAsync("EntityChanged", message);
        }
    }
}