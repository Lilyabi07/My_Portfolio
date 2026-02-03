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
        protected abstract IEnumerable<T> GetAllItems();
        protected abstract T? GetItemById(int id);
        protected abstract int AddItem(T item); // return created id
        protected abstract bool UpdateItem(int id, T updated);
        protected abstract bool DeleteItem(int id);

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(GetAllItems());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var item = GetItemById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        [Authorize]
        public virtual async Task<IActionResult> Create([FromBody] T model)
        {
            var id = AddItem(model);
            await _notifications.SendEntityChangedAsync(EntityName, "create", model);
            return CreatedAtAction(nameof(Get), new { id }, model);
        }

        [HttpPut("{id}")]
        [Authorize]
        public virtual async Task<IActionResult> Update(int id, [FromBody] T updated)
        {
            var ok = UpdateItem(id, updated);
            if (!ok) return NotFound();
            await _notifications.SendEntityChangedAsync(EntityName, "update", updated);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public virtual async Task<IActionResult> Delete(int id)
        {
            var ok = DeleteItem(id);
            if (!ok) return NotFound();
            await _notifications.SendEntityChangedAsync(EntityName, "delete", new { id });
            return NoContent();
        }
    }
}