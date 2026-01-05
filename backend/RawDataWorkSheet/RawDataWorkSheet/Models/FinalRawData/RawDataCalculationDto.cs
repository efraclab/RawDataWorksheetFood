namespace RawDataWorkSheet.Models.FinalRawData
{
    public class RawDataCalculationDto
    {
        public string WorksheetId { get; set; } = default!;
        public string ParameterCode { get; set; } = default!;

        public string CalculationLabel { get; set; } = default!;
        public string CalculationType { get; set; } = default!;
        public string? CalculationFor { get; set; }

        public string? AreaOfSample { get; set; }
        public string? AreaOfStandard { get; set; }

        public string? Purity { get; set; }
        public string? AvgWeight { get; set; }
        public string? AvgWeightUnit { get; set; }
        public string? AvgContent { get; set; }
        public string? AvgContentUnit { get; set; }
        public string? SampleVol { get; set; }
        public string? SampleVolUnit { get; set; }

        public string? MwSalt { get; set; }
        public string? MwBase { get; set; }
        public string? Claim { get; set; }
        public string? ClaimUnit { get; set; }
        public string? LabelClaim { get; set; }
        public string? LabelClaimUnit { get; set; } = "mg";

        public string? LodWaterType { get; set; }
        public string? LodWaterValue { get; set; }

        public string? W1_EmptyDish { get; set; }
        public string? W2_DishWithSample { get; set; }
        public string? W3_DishAfterIgnition { get; set; }

        public string? W1_EmptyCrucible { get; set; }
        public string? W2_CrucibleWithSample { get; set; }
        public string? W3_CrucibleAfterAsh { get; set; }

        public string? CalculationResult { get; set; }
        public string? CalculationResultUnit { get; set; }
        public string? LabelClaimPercentResult { get; set; }
        public string? LodWaterBasisResult { get; set; }

        public string? SelectedStandardPrepLabel { get; set; }
        public string? SelectedSamplePrepLabel { get; set; }
    }

}
