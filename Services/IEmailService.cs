namespace MyPortfolio.Services
{
    public interface IEmailService
    {
        Task SendContactEmailAsync(string senderName, string senderEmail, string message);
    }
}
