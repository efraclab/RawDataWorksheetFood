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
    SELECT 
        t1.TRN1REFNO                                                        AS RegistrationNo,
        t2.TRN2PRODALIAS                                                    AS SampleName,
        t2.TRN2PRODCD                                                       AS SampleCode,
        L.CODEDESC                                                          AS Lab,
        p.headdesc                                                          AS Parameter,
        t2.TRN2HEADER                                                       AS ParaCode,
        t2.TRN2METHOD                                                       AS MethodName,
        t2.TRN2_METHDO_DTL                                                  AS MethodCode,
        CASE WHEN t1.TRN1DATE         IS NOT NULL THEN FORMAT(t1.TRN1DATE,         'dd/MM/yyyy') ELSE '' END AS RegistrationDate,
        CONVERT(NVARCHAR(10), t2.TRN2MdateofReport, 103)                   AS MailingDate,
        CASE WHEN t2.Trn2Pardate       IS NOT NULL THEN FORMAT(t2.Trn2Pardate,      'dd/MM/yyyy') ELSE '' END AS TatDate,
        CASE WHEN t1.trn1recdt         IS NOT NULL THEN FORMAT(t1.trn1recdt,        'dd/MM/yyyy') ELSE '' END AS RecieptDate,
        CASE WHEN t2.TRN2_ANA_STARTDT  IS NOT NULL THEN FORMAT(t2.TRN2_ANA_STARTDT,'dd/MM/yyyy') ELSE '' END AS AnalysisStartDate,
        CASE WHEN t2.TRN2COMPLETIONDT  IS NOT NULL THEN FORMAT(t2.TRN2COMPLETIONDT, 'dd/MM/yyyy') ELSE '' END AS AnalysisCompletionDate,
        CASE 
            WHEN t2.TRN2COMPLETIONDT IS NOT NULL AND t2.TRN2REPODT     IS NULL THEN 'Pending from QA End' 
            WHEN t2.TRN2REPODT       IS NOT NULL AND t2.TRN2MdateofReport IS NULL THEN 'Report not Released' 
            WHEN t2.TRN2COMPLETIONDT IS NULL                                   THEN 'Pending from Lab End' 
            WHEN t2.TRN2MdateofReport IS NOT NULL                              THEN 'Report Delivered' 
        END AS Status
    FROM trn105 t1
    INNER JOIN trn205 t2 ON t1.TRN1REFNO   = t2.TRN2REFNO
    INNER JOIN OHEADMST p ON t2.TRN2HEADER = p.headcd
    INNER JOIN OCODEMST L ON t2.TRN2DEPARTCD = L.CODECD AND L.CODETYPE = 'DM'
    WHERE 
        t1.TRN1PLANTCD = 'P001'
        AND t1.TRN1DATE BETWEEN '2025-04-01' AND '2028-03-31'
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
                WHERE LTRIM(RTRIM(S.[Value])) <> ''
                  AND L.CODEDESC LIKE '%' + LTRIM(RTRIM(S.[Value])) + '%'
            )
        )
    ORDER BY t1.TRN1REFNO, t2.TRN2PRODALIAS;
";

            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<SampleDetails>(query, new
                {
                    request.RegNo,
                    request.Lab
                }, commandTimeout: 60);
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
