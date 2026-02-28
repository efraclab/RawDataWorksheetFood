using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.FinalRawData;
using RawDataWorkSheet.Models.Worksheets;
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

        public async Task InsertWorksheetAsync(
            RawDataWorksheetDto worksheet,
            IDbTransaction tx
        )
        {
            var map = new Dictionary<string, long>();

            const string query = """
                INSERT INTO tblWorksheets (
                    WorksheetId, RegistrationNo, SampleName,
                    NumberOfParameters, DueDate, WorksheetCreatedAt, WorksheetPreparedBy
                )
                VALUES (
                    @WorksheetId, @RegistrationNo, @SampleName,
                    @NumberOfParameters, @DueDate, @WorksheetCreatedAt, @WorksheetPreparedBy
                )
            """;

            await tx.Connection.ExecuteScalarAsync<long>(
                query, new
                {
                    worksheet.WorksheetId,
                    worksheet.RegistrationNo,
                    worksheet.SampleName,
                    worksheet.NumberOfParameters,
                    DueDate = ParseDate(worksheet.DueDate),
                    WorksheetCreatedAt = ParseDate(worksheet.WorksheetCreatedAt),
                    worksheet.WorksheetPreparedBy
                }, tx);
        }

        public async Task<Dictionary<string, long>> InsertParametersAsync(
            List<RawDataParameterDto> parameters,
            IDbTransaction tx
        )
        {
            var map = new Dictionary<string, long>();

            const string query = """
                INSERT INTO tblParameters (
                    WorksheetId, ParameterCode, ParameterName,
                    MethodCode, MethodName, ColumnId, OtherInfo,
                    ParameterAnalyzedBy, ParameterApprovedBy,
                    ParameterStatus, ParameterApprovedAt, AnalysisStartedAt, AnalysisCompletedAt
                )
                OUTPUT INSERTED.ParameterId
                VALUES (
                    @WorksheetId, @ParameterCode, @ParameterName,
                    @MethodCode, @MethodName, @ColumnId, @OtherInfo,
                    @ParameterAnalyzedBy, @ParameterApprovedBy,
                    @ParameterStatus, @ParameterApprovedAt, @AnalysisStartedAt, @AnalysisCompletedAt
                )
            """;

            foreach (var p in parameters)
            {
                var id = await tx.Connection.ExecuteScalarAsync<long>(
                    query,
                    new
                    {
                        p.WorksheetId,
                        p.ParameterCode,
                        p.ParameterName,
                        p.MethodName,
                        p.MethodCode,
                        p.ColumnId,
                        p.OtherInfo,
                        p.ParameterAnalyzedBy,
                        p.ParameterApprovedBy,
                        p.ParameterStatus,
                        ParameterApprovedAt = ParseDate(p.ParameterApprovedAt),
                        AnalysisStartedAt = ParseDate(p.AnalysisStartedAt),
                        AnalysisCompletedAt = ParseDate(p.AnalysisCompletedAt)
                    }, tx);

                map[p.ParameterCode] = id;
            }

            return map;
        }


        public async Task InsertReferencesAsync(
        List<RawDataReferenceDto> references,
        Dictionary<string, long> paramMap,
        IDbTransaction tx)
        {
            if (references == null || references.Count == 0)
                return;

            const string sql = """
                INSERT INTO tblReferences (
                    WorksheetId,
                    ParameterId,
                    ReferenceType,
                    ReferenceCode
                )
                VALUES (
                    @WorksheetId,
                    @ParameterId,
                    @ReferenceType,
                    @ReferenceCode
                )
            """;

            foreach (var r in references)
            {
                if (!paramMap.TryGetValue(r.ParameterCode, out var parameterId))
                {
                    throw new InvalidOperationException(
                        $"ParameterCode '{r.ParameterCode}' not found while inserting references.");
                }

                await tx.Connection.ExecuteAsync(
                    sql,
                    new
                    {
                        r.WorksheetId,
                        ParameterId = parameterId,
                        r.ReferenceType,
                        r.ReferenceCode
                    },
                    tx
                );
            }
        }


        public async Task<Dictionary<string, long>> InsertPreparationsAsync(
    List<RawDataPreparationDto> preps,
    Dictionary<string, long> paramMap,
    IDbTransaction tx)
        {
            // key → PreparationId
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
            Value1,
            Unit1,
            Value2,
            Unit2,
            Value3,
            Unit3,
            SolventChemical,
            LogBookID,
            content
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
            @Value1,
            @Unit1,
            @Value2,
            @Unit2,
            @Value3,
            @Unit3,
            @SolventChemical,
            @LogBookID,
            @Content
        )
    """;

            foreach (var p in preps)
            {
                var parameterId = paramMap[p.ParameterCode];

                // 🔑 Logical preparation key
                var prepKey =
                    $"{parameterId}|{p.PrepCategory}|{p.PrepLabel}|{p.PreparationType}";

                // 🔑 Create ONE PreparationId per logical preparation
                if (!prepMap.TryGetValue(prepKey, out var preparationId))
                {
                    preparationId = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                    prepMap[prepKey] = preparationId;
                }

                await tx.Connection.ExecuteAsync(
                    insertSql,
                    new
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
                        p.Content
                    },
                    tx
                );
            }

            return prepMap;
        }



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
            AvgWeight,
            AvgWeightUnit,
            AvgContent,
            AvgContentUnit,
            SampleVol,
            SampleVolUnit,
            Claim,
            ClaimUnit,
            MwSalt,
            MwBase,
            CalculationResult,
            CalculationResultUnit,
            TimePointDetailInHr,
            CF,
            CorrectedResult,
            CorrectedResultUnit,
            Limit
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
            @AvgWeight,
            @AvgWeightUnit,
            @AvgContent,
            @AvgContentUnit,
            @SampleVol,
            @SampleVolUnit,
            @Claim,
            @ClaimUnit,
            @MwSalt,
            @MwBase,
            @CalculationResult,
            @CalculationResultUnit,
            @TimePointDetailInHr,
            @CF,
            @CorrectedResult,
            @CorrectedResultUnit,
            @Limit
        );
    """;

            foreach (var c in calcs)
            {
                var paramId = paramMap[c.ParameterCode];

                long? samplePrepId = null;
                long? standardPrepId = null;

                if (!string.IsNullOrWhiteSpace(c.SelectedSamplePrepLabel))
                {
                    if (prepMap.TryGetValue(
                        $"{paramId}|SAMPLE|{c.SelectedSamplePrepLabel}|{c.CalculationType}",
                        out var tmpSamplePrepId))
                    {
                        samplePrepId = tmpSamplePrepId;
                    }
                }

                if (!string.IsNullOrWhiteSpace(c.SelectedStandardPrepLabel))
                {
                    if (prepMap.TryGetValue(
                        $"{paramId}|STANDARD|{c.SelectedStandardPrepLabel}|{c.CalculationType}",
                        out var tmpStandardPrepId))
                    {
                        standardPrepId = tmpStandardPrepId;
                    }
                }

                // 🔐 Backend unit-safety (MANDATORY)
                var avgWeightUnit = c.AvgWeight != null ? c.AvgWeightUnit : null;
                var avgContentUnit = c.AvgContent != null ? c.AvgContentUnit : null;
                var sampleVolUnit = c.SampleVol != null ? c.SampleVolUnit : null;
                var claimUnit = c.Claim != null ? c.ClaimUnit : null;

                await tx.Connection.ExecuteAsync(
                    sql,
                    new
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
                        AvgWeightUnit = avgWeightUnit,
                        c.AvgContent,
                        AvgContentUnit = avgContentUnit,
                        c.SampleVol,
                        SampleVolUnit = sampleVolUnit,
                        c.Claim,
                        ClaimUnit = claimUnit,
                        c.MwSalt,
                        c.MwBase,
                        c.CalculationResult,
                        c.CalculationResultUnit,
                        c.TimePointDetailInHr,
                        c.CF,
                        c.CorrectedResult,
                        c.CorrectedResultUnit,
                        c.Limit
                    },
                    tx
                );
            }
        }

        private DateTime? ParseDate(string dateString)
        {
            if (string.IsNullOrWhiteSpace(dateString))
                return null;

            string[] formats = { "dd/MM/yyyy", "yyyy-MM-dd", "MM/dd/yyyy" };

            foreach (var format in formats)
            {
                if (DateTime.TryParseExact(dateString, format, null,
                    System.Globalization.DateTimeStyles.None, out DateTime result))
                {
                    return result;
                }
            }

            if (DateTime.TryParse(dateString, out DateTime generalResult))
            {
                return generalResult;
            }

            return null;
        }


    }
}