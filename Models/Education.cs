namespace MyPortfolio.Models
{
    public class Education
    {
        public int Id { get; set; }
        public string Institution { get; set; } = string.Empty;
        public string? InstitutionFr { get; set; } // French translation
        public string Degree { get; set; } = string.Empty;
        public string? DegreeFr { get; set; } // French translation
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? DescriptionFr { get; set; } // French translation
        public int DisplayOrder { get; set; }
    }
}