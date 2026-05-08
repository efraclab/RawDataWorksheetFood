namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetInstrument
    {
        public int? Id { get; set; }
        public int? ParameterId { get; set; }
        public string? InstrumentId { get; set; }
        public string? Name { get; set; }
        public string? Make { get; set; }
        public string? InstrumentTag { get; set; }
        public DateTime? CalibrationDoneDate { get; set; }
        public DateTime? CalibrationDueDate { get; set; }
    }

}
