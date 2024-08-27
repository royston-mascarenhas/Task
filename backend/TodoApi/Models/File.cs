namespace TodoApi.Models;

public class File
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Extension{ get; set; }
    public long Size { get; set; }
    public int Progress { get; set; }
}

//inherit class File
public class NewFile:File
{
    public string? Data { get; set; }

    public int StartRow{ get; set;}
}