using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using Newtonsoft.Json;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly Context _context;
        private readonly RabbitMQService rmq=new();

        public FilesController(Context context)
        {
            _context = context;
        }

        // GET: api/Files
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoApi.Models.File>>> GetFiles()
        {
            return await _context.Files.ToListAsync();
        }

        // GET: api/Files/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoApi.Models.File>> GetTodoItem(long id)
        {
            var todoItem = await _context.Files.FindAsync(id);
            if (todoItem == null)
            {
              return NotFound();
            }
            return todoItem;
        }

        // PUT: api/Files/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, TodoApi.Models.File todoItem)
        {
            if (id != todoItem.Id)
            {
                return BadRequest();
            }

            if (!TodoItemExists(id))
                {
                    return NotFound();
                }

            rmq.SendMessage(ProducerRequest("PUT",JsonConvert.SerializeObject(todoItem)));
            return Ok(JsonConvert.SerializeObject(todoItem));
        }

        // POST: api/Files
        [HttpPost]
        public async Task<ActionResult<TodoApi.Models.File>> PostTodoItem(TodoApi.Models.NewFile file)
        {  
          string csv = file.Data.Trim();
          string[] rows = csv.Split('\n');
          int i = 0;
          string temp = "";
          var newFile = file;
            foreach (var row in rows)
            {
                temp +=  row+ "\n";
                i++;
                if (i % 1000== 0)
                {   
                    newFile = file;
                    newFile.Data = temp.Trim();
                    rmq.SendMessage(ProducerRequest("POST", JsonConvert.SerializeObject(file)));
                    temp = "";
                }
            }
            newFile = file;
            newFile.Data = temp.Trim();
            rmq.SendMessage(ProducerRequest("POST", JsonConvert.SerializeObject(newFile)));
 
            return Created(nameof(file), new { success = true });
        }

        // DELETE: api/Files/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _context.Files.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

          _context.Files.Remove(todoItem);
           await _context.SaveChangesAsync();  
            return NoContent();
        }

        private bool TodoItemExists(long id)
        {
            return _context.Files.Any(e => e.Id == id);
        }

        private string ProducerRequest(string s,string Data){
            var payload=new
            {
                Type=s,
                ObjectType="files",
                Data
            };
            return JsonConvert.SerializeObject(payload);
        }
    }
}
