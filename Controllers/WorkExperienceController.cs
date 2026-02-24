using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPortfolio.Data;
using MyPortfolio.Models;
using MyPortfolio.Services;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/work-experience")]
    public class WorkExperienceController : CrudControllerBase<WorkExperience>
    {
        private readonly ApplicationDbContext _db;

        public WorkExperienceController(ApplicationDbContext db, INotificationService notifications)
            : base(notifications)
        {
            _db = db;
        }

        protected override string EntityName => "work-experience";

        protected override async Task<IEnumerable<WorkExperience>> GetAllItemsAsync()
        {
            return await _db.WorkExperiences.OrderBy(e => e.DisplayOrder).ToListAsync();
        }

        protected override async Task<WorkExperience?> GetItemByIdAsync(int id)
        {
            return await _db.WorkExperiences.FindAsync(id);
        }

        protected override async Task<int> AddItemAsync(WorkExperience item)
        {
            await _db.WorkExperiences.AddAsync(item);
            await _db.SaveChangesAsync();
            return item.Id;
        }

        protected override async Task<bool> UpdateItemAsync(int id, WorkExperience updated)
        {
            var existing = await _db.WorkExperiences.FindAsync(id);
            if (existing == null) return false;

            existing.Company = updated.Company ?? existing.Company;
            existing.CompanyFr = updated.CompanyFr;
            existing.Position = updated.Position ?? existing.Position;
            existing.PositionFr = updated.PositionFr;
            existing.StartDate = updated.StartDate;
            existing.EndDate = updated.EndDate;
            existing.IsCurrent = updated.IsCurrent;
            existing.Description = updated.Description ?? existing.Description;
            existing.DescriptionFr = updated.DescriptionFr;
            existing.DisplayOrder = updated.DisplayOrder;

            _db.WorkExperiences.Update(existing);
            await _db.SaveChangesAsync();
            return true;
        }

        protected override async Task<bool> DeleteItemAsync(int id)
        {
            var existing = await _db.WorkExperiences.FindAsync(id);
            if (existing == null) return false;

            _db.WorkExperiences.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
