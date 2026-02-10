using System.Net;
using System.Net.Mail;

namespace MyPortfolio.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendContactEmailAsync(string senderName, string senderEmail, string message)
        {
            try
            {
                var smtpHost = _configuration["Email:SmtpHost"];
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["Email:SmtpUsername"];
                var smtpPassword = _configuration["Email:SmtpPassword"];
                var recipientEmail = _configuration["Email:RecipientEmail"] ?? "Motie.Kleffman@AllWebEmails.com";
                var fromEmail = _configuration["Email:FromEmail"] ?? smtpUsername ?? "noreply@portfolio.com";

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
                {
                    throw new InvalidOperationException("Email configuration is incomplete. Please configure SMTP settings in appsettings.json");
                }

                using var smtpClient = new SmtpClient(smtpHost, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, "Portfolio Contact Form"),
                    Subject = $"New Contact Form Submission from {senderName}",
                    Body = $@"
New message received from portfolio contact form:

Name: {senderName}
Email: {senderEmail}

Message:
{message}

---
This message was sent from the portfolio contact form.
",
                    IsBodyHtml = false
                };

                mailMessage.To.Add(recipientEmail);
                mailMessage.ReplyToList.Add(new MailAddress(senderEmail, senderName));

                await smtpClient.SendMailAsync(mailMessage);
                
                _logger.LogInformation($"Contact email sent successfully to {recipientEmail} from {senderName} ({senderEmail})");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send contact email from {senderName} ({senderEmail})");
                throw;
            }
        }
    }
}
