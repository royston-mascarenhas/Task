namespace TodoApi.Models;

/// <summary>
/// Represents a cell in a table or grid with various formatting and content options.
/// </summary>
public class Cell
{
    public long Id { get; set; }
    public int Row { get; set; }
    public int Col { get; set; }
    public string? Data { get; set; }
    public bool? Bold{ get; set; }
    public bool? Italic{ get; set; }
    public bool? Underline{ get; set; }
    public string? Font { get; set; }
    public int FontSize { get; set; }
    public string? Align { get; set; }
    public int File { get; set; }
}