namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetStandard
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string SerialNo { get; set; }
        public string Name { get; set; }
        public string? BatchNo { get; set; }
        public string? Make { get; set; }
        public string? Purity { get; set; }
        public DateTime? Validity { get; set; }
    }

}
