namespace RawDataWorkSheet.Models.DTOs
{
    public class StandardPreparationDto
    {
        public string Label { get; set; }
        public string AssignedStandardId { get; set; }
        public string? PreparationType { get; set; }
        public object Steps { get; set; } // Will be serialized to JSON
    }
}
