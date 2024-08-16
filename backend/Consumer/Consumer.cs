using MySql.Data.MySqlClient;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

class Program
{
  private static readonly string _connectionString = "Server=localhost;Database=exceldb;User ID=root;Password=root;";
  static async Task Main(string[] args)
  {
    var factory = new ConnectionFactory() { HostName = "localhost" };

    using var connection = factory.CreateConnection();
    using var channel = connection.CreateModel();
    channel.QueueDeclare(queue: "queue", durable: true, exclusive: false, autoDelete: false, arguments: null);
    var consumer = new EventingBasicConsumer(channel);
    consumer.Received += async (model, ea) =>
    {
        var body = ea.Body.ToArray();
        var message = Encoding.UTF8.GetString(body);
        Console.WriteLine($"Message received: {message}");
        Request messageData = JsonConvert.DeserializeObject<Request>(message);
        Console.WriteLine(messageData.Data);

        await InsertIntoDatabaseAsync(JsonConvert.DeserializeObject<File>(messageData.Data));
    };
    channel.BasicConsume(queue: "queue", autoAck: true, consumer: consumer);
    Console.WriteLine("Press [enter] to exit.");
    Console.ReadLine();
}
  
  private static async Task InsertIntoDatabaseAsync(File file)
  {
    var query = "INSERT INTO files (Name,Extension,Size) VALUES (@Name,@Extension,@Size)";
    using var connection = new MySqlConnection(_connectionString);
    await connection.OpenAsync();
    using var command = new MySqlCommand(query, connection);
    command.Parameters.AddWithValue("@Name", file.Name);
    command.Parameters.AddWithValue("@Extension",file.Extension);
    command.Parameters.AddWithValue("@Size", file.Size);
    await command.ExecuteNonQueryAsync();
  }
}




public class Request
{    public string? Type { get; set; }
    
    public string? Data{ get; set; }
}
public class File
{    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Extension{ get; set; }
    public long Size { get; set; }
    public int Progress { get; set; }
}


