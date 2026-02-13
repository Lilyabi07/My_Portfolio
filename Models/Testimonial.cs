using System.ComponentModel.DataAnnotations;

namespace MyPortfolio.Models
{
    public class Testimonial
    {
        public int Id { get; set; }

        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters")]
        public string? Name { get; set; }

        [StringLength(100, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 100 characters")]
        public string? Title { get; set; }

        [StringLength(100, MinimumLength = 1, ErrorMessage = "Company must be between 1 and 100 characters")]
        public string? Company { get; set; }

        [StringLength(500, MinimumLength = 1, ErrorMessage = "Message must be between 1 and 500 characters")]
        public string? Message { get; set; }

        public string? Avatar { get; set; }
        public int? Rating { get; set; }
        public bool IsPublished { get; set; } = false;
        public DateTime SubmittedDate { get; set; } = DateTime.UtcNow;
    }
}
