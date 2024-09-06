using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using Newtonsoft.Json;
using MongoDB.Driver;
using MongoDB.Bson;


namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly Context _context;
        private readonly RabbitMQService _rmq = new();
        static string _mongoconnectionstring ="mongodb://127.0.0.1:27017";
        static readonly MongoDBService mongoDBService=new (_mongoconnectionstring);

        readonly IMongoCollection<BsonDocument> collection=mongoDBService.collection;

        // Constructor to initialize the context and RabbitMQ service
        public FilesController(Context context)
        {
            _context = context;
        }

        // GET: api/Files
        /// <summary>
        /// Retrieves all file records from the database.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoApi.Models.File>>> GetFiles()
        {
            return await _context.Files.ToListAsync();
        }

        [HttpGet("{id}/status")]
        public ActionResult<float> FileStatus(long id)
        {
            var filter = Builders<BsonDocument>.Filter.Eq("file", id);
            var result = collection.Find(filter).ToList();
            return result.Count;
        }
        
        // GET: api/Files/5
        /// <summary>
        /// Retrieves a file record by its ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoApi.Models.File>> GetFile(long id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file == null)
            {
                return NotFound();
            }
            return file;
        }

        
        // PUT: api/Files/5
        /// <summary>
        /// Updates an existing file record by its ID.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFile(long id, TodoApi.Models.File file)
        {
            if (id != file.Id)
            {
                return BadRequest();
            }

            if (!FileExists(id))
            {
                return NotFound();
            }

            // Here, you might want to update the record in the database.
            // For now, just returning the serialized file as a placeholder.
            return Ok(JsonConvert.SerializeObject(file));
        }

        
        // POST: api/Files
        /// <summary>
        /// Creates a new file record and processes the associated data.
        /// </summary>
        [HttpPost]
        public ActionResult<TodoApi.Models.File> PostFile(TodoApi.Models.NewFile dataFile)
        {
            string csv = dataFile.Data.Trim();
            int chunkSize = 10000;
            var chunks = csv.Split("\n")
                .Select((item, index) => new { Item = item, Index = index })
                .GroupBy(x => x.Index / chunkSize)
                .Select(g => g.Select(x => x.Item).ToList())
                .ToList();

            var file = new TodoApi.Models.File
            {
                Name = dataFile.Name,
                Extension = dataFile.Extension,
                Size = dataFile.Size,
                ChunkCount = chunks.Count
            };

            _context.Files.Add(file);
            _context.SaveChanges();

          
            long lastInsertedId = _context.Files.Max(x => x.Id);
            dataFile.Id = lastInsertedId;


            foreach (var chunk in chunks)
            {
                dataFile.Data = string.Join("\n", chunk);
                Console.WriteLine("Inserted");
                _rmq.SendMessage(CreateProducerRequest("POST", JsonConvert.SerializeObject(dataFile)));
                dataFile.StartRow += chunk.Count + 1;
            }

            return Created(nameof(file), JsonConvert.SerializeObject(file));
        }

        
        // DELETE: api/Files/5
        /// <summary>
        /// Deletes a file record by its ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(long id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file == null)
            {
                return NotFound();
            }

            _context.Files.Remove(file);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        
        // Checks if a file with the given ID exists in the database
        private bool FileExists(long id)
        {
            return _context.Files.Any(e => e.Id == id);
        }

        
        // Creates a JSON payload for RabbitMQ messages
        private string CreateProducerRequest(string type, string data)
        {
            var payload = new
            {
            Type = type,
            ObjectType = "files",
            Data = data
            };
            return JsonConvert.SerializeObject(payload);
        }
    }
}
