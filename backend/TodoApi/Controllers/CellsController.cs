using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using Newtonsoft.Json;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CellsController : ControllerBase
    {
        private readonly Context _context;
        private readonly RabbitMQService rmq=new();

        public CellsController(Context context)
        {
            _context = context;
        }

        [HttpGet("file/{id}")]
        public async Task<ActionResult<IEnumerable<TodoApi.Models.Cell>>> GetCells(long id)
        {
            return await _context.Cells.Where(c=>c.File==id).ToListAsync();
        }

        // GET: api/Files/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoApi.Models.Cell>> GetCell(long id)
        {
            var cell= await _context.Cells.FindAsync(id);
            if (cell == null)
            {
              return NotFound();
            }
            return cell;
        }

        // PUT: api/Files/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCell(long id, TodoApi.Models.Cell cell)
        {
            if (id != cell.Id)
            {
                return BadRequest();
            }

            if (!CellExists(id))
                {
                    return NotFound();
                }

            _context.Entry(cell).State=EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(JsonConvert.SerializeObject(cell));
        }

        // POST: api/Files
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        
        public async Task<ActionResult<TodoApi.Models.Cell>> PostCell(TodoApi.Models.Cell cell)
        {
            
            rmq.SendMessage(ProducerRequest("POST",JsonConvert.SerializeObject(cell)));
            return Created(nameof(cell),new {success=true});

            
        }

        // DELETE: api/Files/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCell(long id)
        {
            var todoItem = await _context.Cells.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.Cells.Remove(todoItem);
           await _context.SaveChangesAsync();  

            return NoContent();
        }

        private bool CellExists(long id)
        {
            return _context.Cells.Any(e => e.Id == id);
        }


        private string ProducerRequest(string s,string Data){
            var payload=new
            {
                Type=s,
                ObjectType="cells",
                Data
            };
            return JsonConvert.SerializeObject(payload);
        }
    }
}
