using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MyPortfolio.Services;

namespace MyPortfolio.Controllers
{
    // Derived controller MUST provide the data access methods below and the EntityName.
    [ApiController]
    public abstract class CrudControllerBase<T> : ControllerBase where T : class
    {
        private readonly INotificationService _notifications;

        protected CrudControllerBase(INotificationService notifications)
        {
            _notifications = notifications;
        }

        protected abstract string EntityName { get; }
        protected abstract Task<IEnumerable<T>> GetAllItemsAsync();
        protected abstract Task<T?> GetItemByIdAsync(int id);
        protected abstract Task<int> AddItemAsync(T item); // return created id
        protected abstract Task<bool> UpdateItemAsync(int id, T updated);
        protected abstract Task<bool> DeleteItemAsync(int id);

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await GetAllItemsAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await GetItemByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        [Authorize]
        public virtual async Task<IActionResult> Create([FromBody] T model)
        {
            var id = await AddItemAsync(model);
            await _notifications.SendEntityChangedAsync(EntityName, "create", model);
            return CreatedAtAction(nameof(Get), new { id }, model);
        }

        [HttpPut("{id}")]
        [Authorize]
        public virtual async Task<IActionResult> Update(int id, [FromBody] T updated)
        {
            var ok = await UpdateItemAsync(id, updated);
            if (!ok) return NotFound();
            await _notifications.SendEntityChangedAsync(EntityName, "update", updated);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public virtual async Task<IActionResult> Delete(int id)
        {
            var ok = await DeleteItemAsync(id);
            if (!ok) return NotFound();
            await _notifications.SendEntityChangedAsync(EntityName, "delete", new { id });
            return NoContent();
        }
    }
}