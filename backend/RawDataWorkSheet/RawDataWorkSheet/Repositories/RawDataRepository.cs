using Dapper;
using Microsoft.Data.SqlClient;
using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Repositories
{
    public class RawDataRepository : IRawDataRepository
    {
        private readonly string _connectionString;

        public RawDataRepository(IConfiguration configuration)
        {
            _connectionString = configuration["Connnectionstrings:Connection1"];
        }

        public async Task<IEnumerable<SampleDetails>> GetSampleDetailsByIdAsync(SampleDetailsRequest request)
        {

            var query = @"
    ;WITH RegisRanker AS
    (
        SELECT
            i.QUOTNO,
            r2.TRN2REFNO,
            i.QUOTAMT,
            i.QUOTDISCOUNTAXAMT,
            i.QUOTUSD,
            i.USDRATE,
            i.QUOTSEMPLECHARGE,
            i.QUOTMISC,
            i.QUOTHCC,
            r2.TRN2TESTRATE,
            r1.TRN1DATE,
            r2.Trn2Pardate,
            r2.TRN2_METHDO_DTL,
            r2.TRN2METHOD,
            r1.TRN1CANCEL,
            ROW_NUMBER() OVER (PARTITION BY i.QUOTNO ORDER BY r1.TRN1DATE, r2.TRN2REFNO) AS RegRank
        FROM OQUOTMST i
        INNER JOIN TRN205 r2 ON r2.TRN2QOTNO = i.QUOTNO
        LEFT JOIN TRN105 r1 ON r1.TRN1REFNO = r2.TRN2REFNO
        WHERE r2.TRN2REFNO IS NOT NULL
    ),
    RegisBase AS
    (
        SELECT
            r.TRN2REFNO AS RegisNo,
            CASE
                WHEN MAX(r.TRN1CANCEL) = 'Y' THEN 0
                ELSE
                    CASE WHEN MAX(r.QUOTUSD) = 'Y'
                         THEN (
                                   (
                                       SUM(CAST(NULLIF(r.TRN2TESTRATE, '') AS DECIMAL(18,2)))
                                       * ( (MIN(r.QUOTAMT) - MIN(ISNULL(r.QUOTDISCOUNTAXAMT,0))) / NULLIF(MIN(r.QUOTAMT),0) )
                                   )
                                   + CASE WHEN MIN(r.RegRank) = 1
                                          THEN MIN(r.QUOTSEMPLECHARGE)
                                               + MIN(r.QUOTMISC)
                                               + MIN(r.QUOTHCC)
                                          ELSE 0 END
                               ) * MAX(r.USDRATE)
                         ELSE (
                                   (
                                       SUM(CAST(NULLIF(r.TRN2TESTRATE, '') AS DECIMAL(18,2)))
                                       * ( (MIN(r.QUOTAMT) - MIN(ISNULL(r.QUOTDISCOUNTAXAMT,0))) / NULLIF(MIN(r.QUOTAMT),0) )
                                   )
                                   + CASE WHEN MIN(r.RegRank) = 1
                                          THEN MIN(r.QUOTSEMPLECHARGE)
                                               + MIN(r.QUOTMISC)
                                               + MIN(r.QUOTHCC)
                                          ELSE 0 END
                               )
                    END
            END AS RegisVal
        FROM RegisRanker r
        GROUP BY r.TRN2REFNO, r.QUOTNO
    ),
    SampleCount AS
    (
        SELECT
            TRN2REFNO,
            COUNT(*) AS SampleCnt
        FROM TRN205
        WHERE TRN2REFNO IS NOT NULL
        GROUP BY TRN2REFNO
    )
    SELECT 
        t1.TRN1REFNO AS RegistrationNo,
        CASE
            WHEN t1.trn1recdt IS NOT NULL THEN FORMAT(t1.trn1recdt, 'dd/MM/yyyy') 
            ELSE ''
        END AS RecieptDate,
        t2.TRN2_METHDO_DTL AS MethodCode,
        t2.TRN2METHOD AS MethodName,
        CASE
            WHEN t1.TRN1DATE IS NOT NULL THEN FORMAT(t1.TRN1DATE, 'dd/MM/yyyy')
            ELSE ''
        END AS RegistrationDate,
        CASE
            WHEN t2.Trn2Pardate IS NOT NULL THEN FORMAT(t2.Trn2Pardate, 'dd/MM/yyyy') 
            ELSE ''
        END AS TatDate, 
        CASE
            WHEN t1.TRN1DATE IS NOT NULL THEN FORMAT(t1.TRN1DATE, 'dd/MM/yyyy')
            ELSE ''
        END AS ReportIssueDate, 
        t2.TRN2PRODALIAS AS SampleName,
        t2.TRN2PRODCD AS SampleCode,
        CASE
            WHEN t2.TRN2_ANA_STARTDT IS NOT NULL THEN FORMAT(T2.TRN2_ANA_STARTDT, 'dd/MM/yyyy')
            ELSE ''
        END AS AnalysisStartDate,
        CASE
            WHEN t2.TRN2COMPLETIONDT IS NOT NULL THEN FORMAT(t2.TRN2COMPLETIONDT, 'dd/MM/yyyy')
            ELSE ''
        END AS AnalysisCompletionDate,
        CONVERT(NVARCHAR(10), t2.TRN2MdateofReport, 103) AS MailingDate,
        t2.TRN2HEADER AS ParaCode, 
        p.headdesc AS Parameter, 
        L.CODEDESC AS Lab,
        CAST(r.RegisVal / NULLIF(s.SampleCnt, 0) AS DECIMAL(18,2)) AS DistributedRegisVal,
        CASE 
            WHEN t2.TRN2COMPLETIONDT IS NOT NULL AND t2.TRN2REPODT IS NULL THEN 'Pending from QA End' 
            WHEN t2.TRN2REPODT IS NOT NULL AND t2.TRN2MdateofReport IS NULL THEN 'Report not Released' 
            WHEN t2.TRN2COMPLETIONDT IS NULL THEN 'Pending from Lab End' 
            WHEN t2.TRN2MdateofReport IS NOT NULL THEN 'Report Delivered' 
        END AS [Status] 
    FROM 
        trn105 t1
    INNER JOIN trn205 t2 ON t1.TRN1REFNO = t2.TRN2REFNO
    INNER JOIN OHEADMST p ON t2.TRN2HEADER = p.headcd
    INNER JOIN OCODEMST L ON t2.TRN2DEPARTCD = L.CODECD AND L.CODETYPE = 'DM'
    LEFT JOIN RegisBase r ON t2.TRN2REFNO = r.RegisNo
    LEFT JOIN SampleCount s ON t2.TRN2REFNO = s.TRN2REFNO
    WHERE 
        t1.TRN1PLANTCD = 'P001'
        AND t1.TRN1DATE BETWEEN '2025-04-01 00:00:00.000' AND '2028-03-31 00:00:00.000'
        AND (@RegNo IS NULL OR t1.TRN1REFNO = @RegNo)
        AND (
            @Lab IS NULL 
            OR @Lab LIKE '%Quality Assurance%'
            OR EXISTS (
                SELECT 1
                FROM dbo.SplitStrings(
                    REPLACE(REPLACE(REPLACE(@Lab, '&', ' '), 'AND', ' '), 'Lab', ''),
                    ' '
                ) S
                WHERE
                    LTRIM(RTRIM(S.[Value])) <> ''
                    AND L.CODEDESC LIKE '%' + LTRIM(RTRIM(S.[Value])) + '%'
            )
        )
    ORDER BY 
        t1.TRN1REFNO, t2.TRN2PRODALIAS;
";

            using (var connection = new SqlConnection(_connectionString))
            {

                int? commandTimeout = 60;


                return await connection.QueryAsync<SampleDetails>(query, new
                {
                    request.RegNo,
                    request.Lab
                }, commandTimeout: commandTimeout);
            }
        }

        //public async Task<IEnumerable<Columns>> GetColumnsAsync()
        //{

        //    var query = @"
        //        select
        //            ColumnId as Id,
        //            ColumnName as Name
        //        from COLUMNMASTER
        //    ";

        //    using (var connection = new SqlConnection(_connectionString))
        //    {

        //        int? commandTimeout = 60;


        //        return await connection.QueryAsync<Columns>(query, commandTimeout: commandTimeout);
        //    }
        //}
    }
}
