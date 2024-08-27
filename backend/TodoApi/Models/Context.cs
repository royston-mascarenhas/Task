using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

//inherit DbContext
public class Context : DbContext
{
    public Context(DbContextOptions<Context> options)
        : base(options)
    {
    }

    public DbSet<File> Files { get; set; } = null!;
    public DbSet<Cell> Cells { get; set; } = null!;
}