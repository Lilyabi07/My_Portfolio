using Microsoft.EntityFrameworkCore;
using MyPortfolio.Models;

namespace MyPortfolio.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<WorkExperience> WorkExperiences { get; set; } = null!;
        public DbSet<Testimonial> Testimonials { get; set; } = null!;
        public DbSet<Education> Education { get; set; } = null!;
        public DbSet<Hobby> Hobbies { get; set; } = null!;
        public DbSet<Skill> Skills { get; set; } = null!;
        public DbSet<Resume> Resumes { get; set; } = null!;
        public DbSet<ContactInformation> ContactInformation { get; set; } = null!;
        public DbSet<ContactMessage> ContactMessages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map DbSet names to actual table names in the database
            modelBuilder.Entity<Education>().ToTable("Educations");
            modelBuilder.Entity<ContactInformation>().ToTable("ContactInformation");
            modelBuilder.Entity<ContactMessage>().ToTable("ContactMessages");
        }
    }
}