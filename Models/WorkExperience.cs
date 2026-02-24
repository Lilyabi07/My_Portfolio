namespace MyPortfolio.Models
{
    public class WorkExperience
    {
        public int Id { get; set; }
        public string Company { get; set; } = string.Empty;
        public string? CompanyFr { get; set; }
        public string Position { get; set; } = string.Empty;
        public string? PositionFr { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? DescriptionFr { get; set; }
        public int DisplayOrder { get; set; }
    }
}
