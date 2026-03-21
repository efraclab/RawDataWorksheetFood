namespace RawDataWorkSheet.Models.DTOs
{
    public class WorksheetDetailDto
    {
        public WorksheetDto Sample { get; set; }
        public List<ParameterDto> Parameters { get; set; }
        public List<WorksheetLogDto> Logs { get; set; }
    }
}
