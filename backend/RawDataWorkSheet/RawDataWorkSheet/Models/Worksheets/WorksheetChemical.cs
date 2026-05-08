namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetChemical
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public string SLNO { get; set; }
        public string Name { get; set; }
        public string? Code { get; set; }
        public string? Make { get; set; }
        public DateTime? ExpDate { get; set; }
        public string? BatchNo { get; set; }
    }

}
