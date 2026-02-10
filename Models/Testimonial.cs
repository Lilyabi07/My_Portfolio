namespace MyPortfolio.Models
{
    public class Testimonial
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Title { get; set; }
        public string? Company { get; set; }
        public string? Message { get; set; }
        public string? Avatar { get; set; }
        public int? Rating { get; set; }
        public bool IsPublished { get; set; } = false;
        public DateTime SubmittedDate { get; set; } = DateTime.UtcNow;
    }
}
