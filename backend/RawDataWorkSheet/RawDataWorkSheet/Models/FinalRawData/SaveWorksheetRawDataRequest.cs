using RawDataWorkSheet.Models.DTOs;

namespace RawDataWorkSheet.Models.FinalRawData
{
    public class SaveWorksheetRawDataRequest
    {
        public RawDataWorksheetDto? Worksheet { get; set; }
        public List<RawDataParameterDto>? Parameters { get; set; }
        public List<RawDataReferenceDto>? References { get; set; }
        public List<RawDataPreparationDto>? Preparations { get; set; }
        public List<RawDataCalculationDto>? Calculations { get; set; }

        public List<RawDataFileDto>? Files { get; set; }
    }

}
