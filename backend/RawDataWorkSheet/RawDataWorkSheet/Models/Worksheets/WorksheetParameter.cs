namespace RawDataWorkSheet.Models.Worksheets
{
    public class WorksheetParameter
    {
        public int Id { get; set; }
        public string WorksheetId { get; set; }
        public int ParameterId { get; set; }
        public string ParaCode { get; set; }
        public string ParameterName { get; set; }
        public string MethodCode { get; set; }
        public string MethodName { get; set; }
        public string ColumnId { get; set; }
        public string DiluentPreparation { get; set; }
        public string OtherInfo { get; set; }
        public DateTime? AnalysisStartDate { get; set; }
        public DateTime? AnalysisCompletionDate { get; set; }
        public string AnalyzedBy { get; set; }
        public string ApprovedBy { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string? Status { get; set; }
    }

}
