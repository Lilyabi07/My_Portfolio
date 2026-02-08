using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPortfolio.Data;
using MyPortfolio.Models;
using MyPortfolio.Services;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EducationController : CrudControllerBase<Education>
    {
        private readonly ApplicationDbContext _db;

        public EducationController(ApplicationDbContext db, INotificationService notifications)
            : base(notifications)
        {
            _db = db;
        }

        protected override string EntityName => "education";

        protected override async Task<IEnumerable<Education>> GetAllItemsAsync()
        {
            return await _db.Education.OrderBy(e => e.DisplayOrder).ToListAsync();
        }

        protected override async Task<Education?> GetItemByIdAsync(int id)
        {
            return await _db.Education.FindAsync(id);
        }

        protected override async Task<int> AddItemAsync(Education item)
        {
            await _db.Education.AddAsync(item);
            await _db.SaveChangesAsync();
            return item.Id;
        }

        protected override async Task<bool> UpdateItemAsync(int id, Education updated)
        {
            var existing = await _db.Education.FindAsync(id);
            if (existing == null) return false;

            existing.Institution = updated.Institution ?? existing.Institution;
            existing.Degree = updated.Degree ?? existing.Degree;
            existing.StartDate = updated.StartDate;
            existing.EndDate = updated.EndDate;
            existing.IsCurrent = updated.IsCurrent;
            existing.Description = updated.Description ?? existing.Description;
            existing.DisplayOrder = updated.DisplayOrder;

            _db.Education.Update(existing);
            await _db.SaveChangesAsync();
            return true;
        }

        protected override async Task<bool> DeleteItemAsync(int id)
        {
            var existing = await _db.Education.FindAsync(id);
            if (existing == null) return false;

            _db.Education.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}