namespace MyPortfolio.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string TitleEn { get; set; } = string.Empty;
        public string TitleFr { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public string DescriptionFr { get; set; } = string.Empty;
        public string Technologies { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ProjectUrl { get; set; }
        public string? GithubUrl { get; set; }
        public int DisplayOrder { get; set; }
    }
}
