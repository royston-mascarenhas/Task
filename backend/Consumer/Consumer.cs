using MySql.Data.MySqlClient;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using System.Diagnostics;

class Program
{
  private static readonly string _connectionString = "Server=localhost;Database=exceldb;User ID=root;Password=root;";

  private static Stopwatch stopWatch = new Stopwatch();

  static async Task Main(string[] args)
  {
    var factory = new ConnectionFactory() { HostName = "localhost" };

    using var connection = factory.CreateConnection();
    using var channel = connection.CreateModel();
    channel.QueueDeclare(queue: "queue", durable: true, exclusive: false, autoDelete: false, arguments: null);
    var consumer = new EventingBasicConsumer(channel);
    int i = 0;
    
    consumer.Received += async (model, ea) =>
    {
      Console.WriteLine(++i);
      var body = ea.Body.ToArray();
      var message = Encoding.UTF8.GetString(body);
      // Console.WriteLine($"Message received: {message}");

      Request messageData = JsonConvert.DeserializeObject<Request>(message);
      // await InsertIntoDatabaseAsync(JsonConvert.DeserializeObject<File>(messageData.Data));
      await RequestHandler(message);
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
    command.Parameters.AddWithValue("@Extension", file.Extension);
    command.Parameters.AddWithValue("@Size", file.Size);
    await command.ExecuteNonQueryAsync();
  }
  
  private static async Task InsertCell(Cell cell)
  {
    var query = "INSERT INTO cells (id,row,col,data,bold,italic,underline,font,fontsize,align,file) VALUES (@Id,@Row,@Col,@Data,@Bold,@Italic,@Underline,@Font,@FontSize,@Align,@File)";
    using var connection = new MySqlConnection(_connectionString);
    await connection.OpenAsync();
    using var command = new MySqlCommand(query, connection);
    command.Parameters.AddWithValue("@Id", cell.Id);
    command.Parameters.AddWithValue("@Row", cell.Row);
    command.Parameters.AddWithValue("@Col", cell.Col);
    command.Parameters.AddWithValue("@Data", cell.Data);
    command.Parameters.AddWithValue("@Bold", cell.Bold);
    command.Parameters.AddWithValue("@Italic", cell.Italic);
    command.Parameters.AddWithValue("@Underline", cell.Underline);
    command.Parameters.AddWithValue("@Font", cell.Font);
    command.Parameters.AddWithValue("@FontSize", cell.FontSize);
    command.Parameters.AddWithValue("@Align", cell.Align);
    command.Parameters.AddWithValue("@File", cell.File);
    await command.ExecuteNonQueryAsync();
  }
  
  static async Task<int> fileExists(string name)
  {
    using var connection = new MySqlConnection(_connectionString);
    await connection.OpenAsync();

    using var command = new MySqlCommand("SELECT * FROM files WHERE name = @name", connection);
    command.Parameters.AddWithValue("@name", name);
    using var reader = await command.ExecuteReaderAsync();
    int fileId = -1;

    if (reader.HasRows)
    {
      while (reader.Read())
      {
        fileId = reader.GetInt32(0);
      }
    }
    connection.Close();
    return fileId;
  }
 
  private static async Task InsertFile(NewFile file)
  { 
    StringBuilder queryBuilder =new StringBuilder();
    queryBuilder.Append("INSERT INTO cells (`row`, col, data, file) VALUES ");
    int i =file.StartRow-1, j = -1;
    foreach (var row in file.Data.Split('\n'))
    {
      ++i;
      foreach (var col in row.Split(','))
      {
        ++j;
        queryBuilder.Append("(" + i + ", " + j + ", '" + secureData(col) + "', " + file.Id + "),");
      }
      j=-1;
    }
    string query = queryBuilder.ToString().Remove(queryBuilder.Length - 1);
    insertQuery(query);
  }

  static async Task insertQuery(string query)
  {
      using var sconnection = new MySqlConnection(_connectionString);
      await sconnection.OpenAsync();
      using var ecommand = new MySqlCommand(query, sconnection);
      await ecommand.ExecuteNonQueryAsync();
      sconnection.Close();
  }
  
  private static async Task RequestHandler(string message)
  {
    Request request = JsonConvert.DeserializeObject<Request>(message);
    string objtype = request.ObjectType;
    string type = request.Type;

    if (objtype == "files")
    {
      NewFile file = JsonConvert.DeserializeObject<NewFile>(request.Data);
      if (type == "PUT")
      {

      }
      if (type == "POST")
      {
        stopWatch.Start();
        await InsertFile(file);
        stopWatch.Stop();
        Console.WriteLine($"Elapsed time: {stopWatch} seconds");
        // stopWatch.Reset();
      }
    }
    else
    {
      if (type == "PUT")
      {

      }
      if (type == "POST")
      {

      }
    }
  }
  
  private static string secureData(string data)
  {
    return MySqlHelper.EscapeString(data);
  }

}

public class Request
{
  public string? Type { get; set; }

  public string? ObjectType { get; set; }

  public string? Data { get; set; }
}

public class File
{
  public long Id { get; set; }
  public string? Name { get; set; }
  public string? Extension { get; set; }
  public long Size { get; set; }
  public int Progress { get; set; }
  public string? Data { get; set; }
}

public class NewFile:File
{
    public string? Data { get; set; }

    public int StartRow{ get; set;}
}

public class Cell
{
  public long Id { get; set; }
  public int Row { get; set; }
  public int Col { get; set; }
  public string? Data { get; set; }
  public bool? Bold { get; set; }
  public bool? Italic { get; set; }
  public bool? Underline { get; set; }
  public string? Font { get; set; }
  public int FontSize { get; set; }
  public string? Align { get; set; }
  public int File { get; set; }
}

