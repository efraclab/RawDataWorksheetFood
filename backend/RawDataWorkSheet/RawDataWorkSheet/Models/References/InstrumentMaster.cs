namespace RawDataWorkSheet.Models.References
{
    public class InstrumentMaster
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public string? Sl_No { get; set; }
        public string? Make { get; set; }
        public string? InstrumentTag { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? LabName { get; set; }
        public DateTime? Warrenty_UOTO { get; set; }
        public string? AMC_UPTO { get; set; }
        public string? CMC_UPTO { get; set; }
        public DateTime? CalibrationDoneDate { get; set; }
        public DateTime? CalibrationDueDate { get; set; }
        public string? CalibrationAgency { get; set; }
    }
}
