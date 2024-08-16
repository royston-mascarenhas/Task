using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class FileContext : DbContext
{
    public FileContext(DbContextOptions<FileContext> options)
        : base(options)
    {
    }

    public DbSet<File> Files { get; set; } = null!;
}