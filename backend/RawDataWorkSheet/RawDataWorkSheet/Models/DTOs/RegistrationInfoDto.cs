namespace RawDataWorkSheet.Models.DTOs
{

    public class RegistrationInfoDto
    {
        public string? RegistrationNo { get; set; }
        public string? SampleName { get; set; }
        public string? SampleCode { get; set; }
        public int? SampleQuantity { get; set; }
        public string? NatureOfSample { get; set; }
        public string? Lab { get; set; }
        public int? NumberOfParameters { get; set; }
        public string? DueDate { get; set; }
        
    }
}
