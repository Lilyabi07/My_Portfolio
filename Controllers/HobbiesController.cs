using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyPortfolio.Data;
using MyPortfolio.Models;
using MyPortfolio.Services;

namespace MyPortfolio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HobbiesController : CrudControllerBase<Hobby>
    {
        private readonly ApplicationDbContext _db;

        public HobbiesController(ApplicationDbContext db, INotificationService notifications)
            : base(notifications)
        {
            _db = db;
        }

        protected override string EntityName => "hobbies";

        protected override async Task<IEnumerable<Hobby>> GetAllItemsAsync()
        {
            return await _db.Hobbies.OrderBy(i => i.DisplayOrder).ToListAsync();
        }

        protected override async Task<Hobby?> GetItemByIdAsync(int id)
        {
            return await _db.Hobbies.FindAsync(id);
        }

        protected override async Task<int> AddItemAsync(Hobby item)
        {
            await _db.Hobbies.AddAsync(item);
            await _db.SaveChangesAsync();
            return item.Id;
        }

        protected override async Task<bool> UpdateItemAsync(int id, Hobby updated)
        {
            var existing = await _db.Hobbies.FindAsync(id);
            if (existing == null) return false;

            existing.Name = updated.Name ?? existing.Name;
            existing.NameFr = updated.NameFr ?? existing.NameFr;
            existing.Icon = updated.Icon ?? existing.Icon;
            existing.Description = updated.Description ?? existing.Description;
            existing.DescriptionFr = updated.DescriptionFr ?? existing.DescriptionFr;
            existing.DisplayOrder = updated.DisplayOrder;

            _db.Hobbies.Update(existing);
            await _db.SaveChangesAsync();
            return true;
        }

        protected override async Task<bool> DeleteItemAsync(int id)
        {
            var existing = await _db.Hobbies.FindAsync(id);
            if (existing == null) return false;

            _db.Hobbies.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}