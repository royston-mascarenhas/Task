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
            
            return Ok(JsonConvert.SerializeObject(todoItem));
        }

        // POST: api/Files
        [HttpPost]
        public ActionResult<TodoApi.Models.File> PostTodoItem(TodoApi.Models.NewFile Datafile)
        {  

          TodoApi.Models.File file=new()
          {
            Name=Datafile.Name,
            Extension=Datafile.Extension,
            Size=Datafile.Size,
            Progress=0,
          };

          _context.Files.Add(file);
          _context.SaveChanges();

          long lastInserted=_context.Files.Max(x=>x.Id);
          Datafile.Id=lastInserted;
          
            string csv = Datafile.Data.Trim();
            int chunkSize = 10000;
            var chunks = csv.Split("\n")
                .Select((item, index) => new { Item = item, Index = index })
                .GroupBy(x => x.Index / chunkSize)
                .Select(g => g.Select(x => x.Item).ToList())
                .ToList();

            foreach (var chunk in chunks)
            {
                Datafile.Data = string.Join("\n", chunk);
                rmq.SendMessage(ProducerRequest("POST", JsonConvert.SerializeObject(Datafile)));
                Datafile.StartRow+=chunk.Count+1;
            }
 
            return Created(nameof(Datafile), new { success = true });
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
