namespace RawDataWorkSheet.Models.DTOs
{
    public class InstrumentDto
    {
        public string InstrumentId { get; set; }
        public string? Name { get; set; }
        public string? Make { get; set; }
        public string? InstrumentTag { get; set; }
        public string? CalibrationDoneDate { get; set; }
        public string? CalibrationDueDate { get; set; }
    }

}
