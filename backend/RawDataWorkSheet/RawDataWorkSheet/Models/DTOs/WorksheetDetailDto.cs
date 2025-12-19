namespace RawDataWorkSheet.Models.DTOs
{
    public class WorksheetDetailDto
    {
        public RawDataWorksheetDto Worksheet { get; set; }
        public List<ParameterDetailDto> Parameters { get; set; }
    }
}
