namespace RawDataWorkSheet.Models.DTOs
{
    public class WorksheetDetailDto
    {
        public RawDataWorksheetDto Sample { get; set; }
        public List<ParameterDetailDto> Parameters { get; set; }
    }
}
