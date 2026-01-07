namespace RawDataWorkSheet.Models
{
    public class SampleDetails
    {
        public string RegistrationNo { get; set; }
        public string SampleName { get; set; }
        public string Lab { get; set; }
        public string Parameter { get; set; }
        public string ParaCode { get; set; }
        public string MethodName { get; set; }
        public string MethodCode { get; set; }
        public string RegistrationDate { get; set; }
        public string? MailingDate { get; set; }
        public string? TatDate { get; set; }
        public string? RecieptDate { get; set; }
        public string? AnalysisStartDate { get; set; }
        public string? AnalysisCompletionDate { get; set; }
        public decimal? DistributedRegisVal { get; set; }
        public string Status { get; set; }
    }
}
