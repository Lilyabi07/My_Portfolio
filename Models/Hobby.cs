namespace MyPortfolio.Models
{
    public class Hobby
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Icon { get; set; } // optionally store an icon class or image URL
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
    }
}