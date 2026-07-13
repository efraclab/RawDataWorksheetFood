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

        // Internal Standard Preparation (Hypromellose only): when true, this row belongs
        // to the independent "Internal Standards" pool instead of the regular Standards
        // table/list. Same shape, same table - just a different bucket per parameter.
        public bool IsInternalStandard { get; set; }
    }

}