namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetMedia
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public int MediaId { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public DateTime? ExpDate { get; set; }
        public int? QuantityValue { get; set; }
        public string? QuantityUnit { get; set; }
    }

}
