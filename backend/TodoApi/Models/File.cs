namespace TodoApi.Models;

/// <summary>
/// Represents a file with metadata such as name, extension, size, and upload progress.
/// </summary>
public class File
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Extension{ get; set; }
    public long Size { get; set; }
    public int ChunkCount { get; set; }
}

//inherit class File
public class NewFile:File
{
    public string? Data { get; set; }

    public int StartRow{ get; set;}
}