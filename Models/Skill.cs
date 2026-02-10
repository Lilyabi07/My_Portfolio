namespace MyPortfolio.Models
{
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Proficiency { get; set; }
        public string Icon { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }
}
