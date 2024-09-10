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
            return await _context.Cells.Where(c=>c.File==id).Skip(0).Take(2000).ToListAsync();
        }
        [HttpGet("file/{id}/{page}")]
        public async Task<ActionResult<IEnumerable<TodoApi.Models.Cell>>> GetCells(long id, long page)
        {
            // Validate page parameter
            if (page <= 0)
            {
                return BadRequest("Page number must be greater than zero.");
            }

            // Constants for pagination
            const int pageSize = 100;
            long startRow = (page - 1) * pageSize;
            long endRow = startRow + pageSize;

            // Perform the query with filtering and pagination
            var cells = await _context.Cells
                .AsNoTracking()
                .Where(c => c.File == id && c.Row >= startRow && c.Row < endRow)
                .OrderBy(c => c.Row)
                .Select(c => new { c.Id, c.Row, c.File, c.Col,c.Data }) // Select only required columns
                .ToListAsync();

            return Ok(cells);
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
             if (cell.Id == -1)
            {
                cell.Id = _context.Cells.Max(x => x.Id) + 1;
                _context.Cells.Add(cell);
                _context.SaveChanges();
                return cell;
            }
            _context.Cells.Add(cell);
            _context.SaveChanges();
            return cell;
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

        [HttpPost("UpdateBulk")]
        public async Task<IActionResult> UpdateBulk([FromBody] List<Cell> cells)
        {
            if (cells == null || !cells.Any())
            {
                return BadRequest("No cells to update.");
            }

            try
            {
                var cellIds = cells.Select(c => c.Id).ToList();
                var existingCells = await _context.Cells.Where(c => cellIds.Contains(c.Id)).ToListAsync();

                foreach (var cell in cells)
                {
                    var existingCell = existingCells.FirstOrDefault(c => c.Id == cell.Id);
                    if (existingCell != null)
                    {
                        existingCell.Row = cell.Row;
                        existingCell.File = cell.File;
                        existingCell.Col = cell.Col;
                        existingCell.Data = cell.Data;
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(existingCells);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("DeleteBulk")]
        public async Task<IActionResult> DeleteBulk([FromBody] List<long> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No IDs provided for deletion.");
            }

            try
            {
                var cellsToDelete = await _context.Cells
                    .Where(c => ids.Contains(c.Id))
                    .ToListAsync();

                if (!cellsToDelete.Any())
                {
                    return NotFound("No cells found to delete.");
                }
                _context.Cells.RemoveRange(cellsToDelete);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Checks if a cell with the specified ID exists in the database.
        /// </summary>
        private bool CellExists(long id)
        {
            return _context.Cells.Any(e => e.Id == id);
        }

        /// <summary>
        /// Creates a JSON payload for producing a message.
        /// </summary>
        private string ProducerRequest(string type, string data)
        {
            // Construct an anonymous object with the provided type and data
            var payload = new
            {
                Type = type,
                ObjectType = "cells", // Hardcoded object type indicating the context (e.g., "cells")
                Data = data
            };

            // Serialize the payload object to a JSON string
            return JsonConvert.SerializeObject(payload);
        }
    }
}