namespace RawDataWorkSheet.Models.ReportModels
{
    public class FormDataDto
    {
        public RegistrationInfoDto RegistrationInfo { get; set; }
        public DocumentInfoDto DocumentInfo { get; set; }
        public List<ParameterDto> Parameters { get; set; }

        // State restoration (converted to simple lists)
        public List<string> SelectedParamsForDetail { get; set; }

        public List<ColumnMappingDto> ColumnsPerParam { get; set; }
        public List<MobilePhaseMappingDto> MobilePhasesPerParam { get; set; }
        public List<DissoMediaMappingDto> DissoMediaPerParam { get; set; }
        public List<PreparationMappingDto> StandardPreparationPerParam { get; set; }
        public List<PreparationMappingDto> SamplePreparationPerParam { get; set; }
        public List<PreparationMappingDto> SamplePreparationTitrationPerParam { get; set; }
        public List<PreparationMappingDto> SamplePreparationLodPerParam { get; set; }
        public List<PreparationMappingDto> SamplePreparationSulphatedAshPerParam { get; set; }
        public List<PreparationMappingDto> SamplePreparationLossOnIgnationPerParam { get; set; }
        public List<PreparationMappingDto> SamplePreparationDissoPerParam { get; set; }

        public List<InstrumentMappingDto> AddedInstruments { get; set; }
        public List<ChemicalMappingDto> AddedChemicals { get; set; }
        public List<StandardMappingDto> AddedStandards { get; set; }

        public List<TestSolutionMappingDto> TestSolutionPerParam { get; set; }
        public List<DiluentMappingDto> DiluentPerParam { get; set; }
    }

}
