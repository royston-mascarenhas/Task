using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
namespace RabbitMQApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
    
public class MessagesController : ControllerBase
{
[HttpPost("send")]
public IActionResult Send([FromBody] MessageData[] data)
{
  try
  {
    var factory = new ConnectionFactory() { HostName = "localhost" };
    using var connection = factory.CreateConnection();
    using var channel = connection.CreateModel();
    channel.QueueDeclare(queue:"queue",durable: true,exclusive: false,autoDelete: false,arguments: null);

    foreach (var item in data)
    {
      var jsonData = JsonSerializer.Serialize(item);
      var bodyBytes = Encoding.UTF8.GetBytes(jsonData);
      channel.BasicPublish(exchange: "",routingKey:"queue",basicProperties: null,body: bodyBytes);
      Console.WriteLine("Message sent: " + jsonData);
      
    }

    var queueDeclareOk = channel.QueueDeclarePassive(queue:"queue");
    var messageCount = queueDeclareOk.MessageCount;

    Console.WriteLine($"Number of messages in the queue: {messageCount}");
    for (int i = 0; i < messageCount; i++)
            {
                var result = channel.BasicGet(queue:"queue", autoAck: true);
                if (result != null)
                {
                    var message = System.Text.Encoding.UTF8.GetString(result.Body.ToArray());
                    Console.WriteLine($"Message {i + 1}: {message}");
                }
            }

            
    return Ok(new { Status = "Message sent" });
  }
  catch (Exception ex)
  {
    Console.WriteLine("Error sending message: " + ex.Message);
    return StatusCode(500,new{Status = "Error", Message = ex.Message});
  }
}
}

public class MessageData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }

}


