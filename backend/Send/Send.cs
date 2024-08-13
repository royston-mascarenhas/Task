using MySql.Data.MySqlClient;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

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
        var messageData = DeserializeMessage(message);
        await InsertIntoDatabaseAsync(messageData);
    };
    channel.BasicConsume(queue: "queue", autoAck: true, consumer: consumer);
    Console.WriteLine("Press [enter] to exit.");
    Console.ReadLine();
}
    
  private static DataType DeserializeMessage(string message)
  {
    return JsonSerializer.Deserialize<DataType>(message);
}

  private static async Task InsertIntoDatabaseAsync(DataType messageData)
  {
    var query = "INSERT INTO employee (Id, Name, Email) VALUES (@Id, @Name, @Email)";
    using var connection = new MySqlConnection(_connectionString);
    await connection.OpenAsync();
    using var command = new MySqlCommand(query, connection);
    command.Parameters.AddWithValue("@Id", messageData.Id);
    command.Parameters.AddWithValue("@Name", messageData.Name);
    command.Parameters.AddWithValue("@Email", messageData.Email);
    await command.ExecuteNonQueryAsync();
  }
}

public class DataType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}



