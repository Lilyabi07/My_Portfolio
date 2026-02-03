using Microsoft.AspNetCore.SignalR;

namespace MyPortfolio.Hubs
{
    // Simple hub that broadcasts entity changes so clients can refresh or update UI immediately.
    public class NotificationsHub : Hub
    {
    }
}