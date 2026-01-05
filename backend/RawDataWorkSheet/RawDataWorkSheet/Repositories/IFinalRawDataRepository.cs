using RawDataWorkSheet.Models.FinalRawData;
using System.Data;

namespace RawDataWorkSheet.Repositories
{
    public interface IFinalRawDataRepository
    {
        Task<IDbTransaction> BeginTransactionAsync();
        Task InsertCalculationsAsync(List<RawDataCalculationDto> calcs, Dictionary<string, long> paramMap, Dictionary<string, long> prepMap, IDbTransaction tx);
        Task<Dictionary<string, long>> InsertParametersAsync(List<RawDataParameterDto> parameters, IDbTransaction tx);
        Task<Dictionary<string, long>> InsertPreparationsAsync(List<RawDataPreparationDto> preps, Dictionary<string, long> paramMap, IDbTransaction tx);
        Task InsertWorksheetAsync(RawDataWorksheetDto worksheet, IDbTransaction tx);
        Task InsertReferencesAsync(
        List<RawDataReferenceDto> references,
        Dictionary<string, long> paramMap,
        IDbTransaction tx);

    }
}