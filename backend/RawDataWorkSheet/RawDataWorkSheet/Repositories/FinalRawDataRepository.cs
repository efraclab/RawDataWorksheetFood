using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models.FinalRawData;
using System.Data;
using System.Globalization;

namespace RawDataWorkSheet.Repositories
{
    public class FinalRawDataRepository : IFinalRawDataRepository
    {
        private readonly string _connectionString;

        public FinalRawDataRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection2"];
        }

        public async Task<IDbTransaction> BeginTransactionAsync()
        {
            var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            return conn.BeginTransaction();
        }

        // ════════════════════════════════════════════════════════════════════
        // WORKSHEET
        // ════════════════════════════════════════════════════════════════════

        public async Task InsertWorksheetAsync(
            RawDataWorksheetDto worksheet,
            IDbTransaction tx)
        {
            const string query = """
                INSERT INTO tblWorksheets (
                    WorksheetId, RegistrationNo, SampleName,
                    NumberOfParameters, DueDate, WorksheetCreatedAt, WorksheetPreparedBy,
                    WorksheetStatus,
                    SubmittedQaBy, SubmittedQaAt,
                    ApprovedBy
                )
                VALUES (
                    @WorksheetId, @RegistrationNo, @SampleName,
                    @NumberOfParameters, @DueDate, @WorksheetCreatedAt, @WorksheetPreparedBy,
                    @WorksheetStatus,
                    @SubmittedQaBy, @SubmittedQaAt,
                    @ApprovedBy
                )
            """;

            await tx.Connection!.ExecuteAsync(query, new
            {
                worksheet.WorksheetId,
                worksheet.RegistrationNo,
                worksheet.SampleName,
                worksheet.NumberOfParameters,
                DueDate = ParseDate(worksheet.DueDate),
                WorksheetCreatedAt = ParseDate(worksheet.WorksheetCreatedAt),
                worksheet.WorksheetPreparedBy,
                worksheet.WorksheetStatus,
                worksheet.SubmittedQaBy,
                SubmittedQaAt = ParseDateTime(worksheet.SubmittedQaAt),
                worksheet.ApprovedBy,
            }, tx);
        }

        // ════════════════════════════════════════════════════════════════════
        // PARAMETERS
        // ════════════════════════════════════════════════════════════════════

        public async Task<Dictionary<string, long>> InsertParametersAsync(
            List<RawDataParameterDto> parameters,
            IDbTransaction tx)
        {
            var map = new Dictionary<string, long>();

            const string query = """
                INSERT INTO tblParameters (
                    WorksheetId, ParameterCode, ParameterName,
                    MethodCode, MethodName, ColumnId, OtherInfo,
                    ParameterAnalyzedBy,
                    ParameterStatus,
                    AnalysisStartedAt, AnalysisCompletedAt,
                    ApprovedByReviewer, ApprovedAtReviewer,
                    ApprovedByQA,      ApprovedAtQA,
                    RemarksByQA,       RemarksByReviewer
                )
                OUTPUT INSERTED.ParameterId
                VALUES (
                    @WorksheetId, @ParameterCode, @ParameterName,
                    @MethodCode, @MethodName, @ColumnId, @OtherInfo,
                    @ParameterAnalyzedBy,
                    @ParameterStatus,
                    @AnalysisStartedAt, @AnalysisCompletedAt,
                    @ApprovedByReviewer, @ApprovedAtReviewer,
                    @ApprovedByQA,      @ApprovedAtQA,
                    @RemarksByQA,       @RemarksByReviewer
                )
            """;

            foreach (var p in parameters)
            {
                var id = await tx.Connection!.ExecuteScalarAsync<long>(query, new
                {
                    p.WorksheetId,
                    p.ParameterCode,
                    p.ParameterName,
                    p.MethodCode,
                    p.MethodName,
                    p.ColumnId,
                    p.OtherInfo,
                    p.ParameterAnalyzedBy,
                    p.ParameterStatus,
                    AnalysisStartedAt = ParseDateTime(p.AnalysisStartedAt),
                    AnalysisCompletedAt = ParseDateTime(p.AnalysisCompletedAt),
                    p.ApprovedByReviewer,
                    ApprovedAtReviewer = ParseDateTime(p.ApprovedAtReviewer),
                    p.ApprovedByQA,
                    ApprovedAtQA = ParseDateTime(p.ApprovedAtQA),
                    p.RemarksByQA,
                    p.RemarksByReviewer,
                }, tx);

                map[p.ParameterCode] = id;
            }

            return map;
        }

        // ════════════════════════════════════════════════════════════════════
        // REFERENCES
        // ════════════════════════════════════════════════════════════════════

        public async Task InsertReferencesAsync(
            List<RawDataReferenceDto> references,
            Dictionary<string, long> paramMap,
            IDbTransaction tx)
        {
            if (references == null || references.Count == 0) return;

            const string sql = """
                INSERT INTO tblReferences (
                    WorksheetId, ParameterId, ReferenceType, ReferenceCode
                )
                VALUES (
                    @WorksheetId, @ParameterId, @ReferenceType, @ReferenceCode
                )
            """;

            foreach (var r in references)
            {
                if (!paramMap.TryGetValue(r.ParameterCode, out var parameterId))
                    throw new InvalidOperationException(
                        $"ParameterCode '{r.ParameterCode}' not found while inserting references.");

                await tx.Connection!.ExecuteAsync(sql, new
                {
                    r.WorksheetId,
                    ParameterId = parameterId,
                    r.ReferenceType,
                    r.ReferenceCode
                }, tx);
            }
        }

        // ════════════════════════════════════════════════════════════════════
        // PREPARATIONS
        // ════════════════════════════════════════════════════════════════════

        public async Task<Dictionary<string, long>> InsertPreparationsAsync(
            List<RawDataPreparationDto> preps,
            Dictionary<string, long> paramMap,
            IDbTransaction tx)
        {
            var prepMap = new Dictionary<string, long>();

            const string insertSql = """
                INSERT INTO tblPreparations (
                    PreparationId,
                    ParameterId,
                    WorksheetId,
                    PrepCategory,
                    PrepLabel,
                    PreparationType,
                    AssignedStandardId,
                    StepName,
                    StepOrder,
                    Value1, Unit1,
                    Value2, Unit2,
                    Value3, Unit3,
                    SolventChemical,
                    LogBookID,
                    LimitType,
                    Content
                )
                VALUES (
                    @PreparationId,
                    @ParameterId,
                    @WorksheetId,
                    @PrepCategory,
                    @PrepLabel,
                    @PreparationType,
                    @AssignedStandardId,
                    @StepName,
                    @StepOrder,
                    @Value1, @Unit1,
                    @Value2, @Unit2,
                    @Value3, @Unit3,
                    @SolventChemical,
                    @LogBookID,
                    @LimitType,
                    @Content
                )
            """;

            foreach (var p in preps)
            {
                var parameterId = paramMap[p.ParameterCode];

                // One PreparationId shared across all step-rows of the same logical prep
                var prepKey = $"{parameterId}|{p.PrepCategory}|{p.PrepLabel}|{p.PreparationType}";

                if (!prepMap.TryGetValue(prepKey, out var preparationId))
                {
                    preparationId = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                    prepMap[prepKey] = preparationId;
                }

                await tx.Connection!.ExecuteAsync(insertSql, new
                {
                    PreparationId = preparationId,
                    ParameterId = parameterId,
                    p.WorksheetId,
                    p.PrepCategory,
                    p.PrepLabel,
                    p.PreparationType,
                    p.AssignedStandardId,
                    p.StepName,
                    p.StepOrder,
                    p.Value1,
                    p.Unit1,
                    p.Value2,
                    p.Unit2,
                    p.Value3,
                    p.Unit3,
                    p.SolventChemical,
                    p.LogBookID,
                    p.LimitType,
                    p.Content
                }, tx);
            }

            return prepMap;
        }

        // ════════════════════════════════════════════════════════════════════
        // CALCULATIONS
        // ════════════════════════════════════════════════════════════════════

        public async Task InsertCalculationsAsync(
            List<RawDataCalculationDto> calcs,
            Dictionary<string, long> paramMap,
            Dictionary<string, long> prepMap,
            IDbTransaction tx)
        {
            const string sql = """
                INSERT INTO tblCalculations (
                    ParameterId,
                    WorksheetId,
                    SamplePreparationId,
                    StandardPreparationId,
                    CalculationLabel,
                    CalculationType,
                    CalculationFor,
                    AreaOfSample,
                    AreaOfStandard,
                    Purity,
                    AvgWeight,      AvgWeightUnit,
                    AvgContent,     AvgContentUnit,
                    SampleVol,      SampleVolUnit,
                    Claim,          ClaimUnit,
                    MwSalt,         MwBase,
                    LabelClaim,     LabelClaimUnit,
                    LodWaterType,   LodWaterValue,
                    W1_EmptyDish,   W2_DishWithSample,  W3_DishAfterIgnition,
                    W1_EmptyCrucible, W2_CrucibleWithSample, W3_CrucibleAfterAsh,
                    CalculationResult,      CalculationResultUnit,
                    LabelClaimPercentResult, LodWaterBasisResult,
                    SelectedStandardPrepLabel, SelectedSamplePrepLabel,
                    TimePointDetailInHr,
                    CF, CorrectedResult, CorrectedResultUnit,
                    LimitMax,          LimitMin,
                    BuretteReading,
                    BuretteReading1, BuretteReading2, BuretteReading3,
                    BuretteReading4, BuretteReading5, BuretteReading6,
                    TheoreticalMolarity, ActualMolarity,
                    Factor,         FactorUnit,
                    DissoMediaVolume, SampleTaken, DryBasisResult
                )
                VALUES (
                    @ParameterId,
                    @WorksheetId,
                    @SamplePreparationId,
                    @StandardPreparationId,
                    @CalculationLabel,
                    @CalculationType,
                    @CalculationFor,
                    @AreaOfSample,
                    @AreaOfStandard,
                    @Purity,
                    @AvgWeight,     @AvgWeightUnit,
                    @AvgContent,    @AvgContentUnit,
                    @SampleVol,     @SampleVolUnit,
                    @Claim,         @ClaimUnit,
                    @MwSalt,        @MwBase,
                    @LabelClaim,    @LabelClaimUnit,
                    @LodWaterType,  @LodWaterValue,
                    @W1_EmptyDish,  @W2_DishWithSample,  @W3_DishAfterIgnition,
                    @W1_EmptyCrucible, @W2_CrucibleWithSample, @W3_CrucibleAfterAsh,
                    @CalculationResult,      @CalculationResultUnit,
                    @LabelClaimPercentResult, @LodWaterBasisResult,
                    @SelectedStandardPrepLabel, @SelectedSamplePrepLabel,
                    @TimePointDetailInHr,
                    @CF, @CorrectedResult, @CorrectedResultUnit,
                    @LimitMax,         @LimitMin,
                    @BuretteReading,
                    @BuretteReading1, @BuretteReading2, @BuretteReading3,
                    @BuretteReading4, @BuretteReading5, @BuretteReading6,
                    @TheoreticalMolarity, @ActualMolarity,
                    @Factor,        @FactorUnit,
                    @DissoMediaVolume, @SampleTaken, @DryBasisResult
                )
            """;

            foreach (var c in calcs)
            {
                var paramId = paramMap[c.ParameterCode];

                // ── Resolve prep FK references ─────────────────────────────
                long? samplePrepId = null;
                long? standardPrepId = null;

                if (!string.IsNullOrWhiteSpace(c.SelectedSamplePrepLabel))
                {
                    var sampleKeys = new[]
                    {
                        $"{paramId}|SAMPLE|{c.SelectedSamplePrepLabel}|{c.CalculationType}",
                        $"{paramId}|SAMPLE|{c.SelectedSamplePrepLabel}|"
                    };
                    foreach (var key in sampleKeys)
                        if (prepMap.TryGetValue(key, out var id)) { samplePrepId = id; break; }
                }

                if (!string.IsNullOrWhiteSpace(c.SelectedStandardPrepLabel))
                {
                    var standardKeys = new[]
                    {
                        $"{paramId}|STANDARD|{c.SelectedStandardPrepLabel}|{c.CalculationType}",
                        $"{paramId}|STANDARD|{c.SelectedStandardPrepLabel}|"
                    };
                    foreach (var key in standardKeys)
                        if (prepMap.TryGetValue(key, out var id)) { standardPrepId = id; break; }
                }

                await tx.Connection!.ExecuteAsync(sql, new
                {
                    ParameterId = paramId,
                    c.WorksheetId,
                    SamplePreparationId = samplePrepId,
                    StandardPreparationId = standardPrepId,
                    c.CalculationLabel,
                    c.CalculationType,
                    c.CalculationFor,
                    c.AreaOfSample,
                    c.AreaOfStandard,
                    c.Purity,
                    c.AvgWeight,
                    AvgWeightUnit = c.AvgWeight != null ? c.AvgWeightUnit : null,
                    c.AvgContent,
                    AvgContentUnit = c.AvgContent != null ? c.AvgContentUnit : null,
                    c.SampleVol,
                    SampleVolUnit = c.SampleVol != null ? c.SampleVolUnit : null,
                    c.Claim,
                    ClaimUnit = c.Claim != null ? c.ClaimUnit : null,
                    c.MwSalt,
                    c.MwBase,
                    c.LabelClaim,
                    LabelClaimUnit = c.LabelClaim != null ? c.LabelClaimUnit : null,
                    c.LodWaterType,
                    c.LodWaterValue,
                    c.W1_EmptyDish,
                    c.W2_DishWithSample,
                    c.W3_DishAfterIgnition,
                    c.W1_EmptyCrucible,
                    c.W2_CrucibleWithSample,
                    c.W3_CrucibleAfterAsh,
                    c.CalculationResult,
                    c.CalculationResultUnit,
                    c.LabelClaimPercentResult,
                    c.LodWaterBasisResult,
                    c.SelectedStandardPrepLabel,
                    c.SelectedSamplePrepLabel,
                    c.TimePointDetailInHr,
                    c.CF,
                    c.CorrectedResult,
                    c.CorrectedResultUnit,
                    c.LimitMin,
                    c.LimitMax,
                    c.BuretteReading,
                    c.BuretteReading1,
                    c.BuretteReading2,
                    c.BuretteReading3,
                    c.BuretteReading4,
                    c.BuretteReading5,
                    c.BuretteReading6,
                    c.TheoreticalMolarity,
                    c.ActualMolarity,
                    c.Factor,
                    c.FactorUnit,
                    c.DissoMediaVolume,
                    c.SampleTaken,
                    c.DryBasisResult
                }, tx);
            }
        }

        // ════════════════════════════════════════════════════════════════════
        // FILES
        // ════════════════════════════════════════════════════════════════════

        public async Task InsertFilesAsync(
            List<RawDataFileDto> files,
            Dictionary<string, long> paramMap,
            IDbTransaction tx)
        {
            if (files == null || files.Count == 0) return;

            const string sql = """
                INSERT INTO tblFiles (
                    WorksheetId,
                    ParameterId,
                    PreparationType,
                    PrepLabel,
                    FileName,
                    FileDataBase64
                )
                VALUES (
                    @WorksheetId,
                    @ParameterId,
                    @PreparationType,
                    @PrepLabel,
                    @FileName,
                    @FileDataBase64
                )
            """;

            foreach (var f in files)
            {
                if (!paramMap.TryGetValue(f.ParameterCode, out var parameterId))
                    throw new InvalidOperationException(
                        $"ParameterCode '{f.ParameterCode}' not found while inserting files.");

                await tx.Connection!.ExecuteAsync(sql, new
                {
                    f.WorksheetId,
                    ParameterId = parameterId,
                    f.PreparationType,
                    f.PrepLabel,
                    f.FileName,
                    f.FileDataBase64
                }, tx);
            }
        }

        // ════════════════════════════════════════════════════════════════════
        // HELPERS
        // ════════════════════════════════════════════════════════════════════

        private static DateTime? ParseDate(string? dateString)
        {
            if (string.IsNullOrWhiteSpace(dateString)) return null;

            string[] formats = { "dd/MM/yyyy", "yyyy-MM-dd", "MM/dd/yyyy" };
            foreach (var fmt in formats)
                if (DateTime.TryParseExact(dateString, fmt, null, DateTimeStyles.None, out var r))
                    return r;

            return DateTime.TryParse(dateString, out var gen) ? gen : null;
        }

        private static DateTime? ParseDateTime(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return null;
            return DateTime.TryParse(value, null, DateTimeStyles.RoundtripKind, out var r) ? r : null;
        }
    }
}