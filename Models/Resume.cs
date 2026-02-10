namespace MyPortfolio.Models
{
    public class Resume
    {
        public int Id { get; set; }
        public string FileUrl { get; set; } = string.Empty; // or link to stored resume
        public string Notes { get; set; } = string.Empty;   // optional text representation
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}