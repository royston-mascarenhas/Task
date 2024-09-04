using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class Mongo
{
    public long FileId { get; set; } // Field to store file ID

    public long Progress { get; set; } // Field to store progress percentage
}
