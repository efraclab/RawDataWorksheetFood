using RawDataWorkSheet.Models.FinalRawData;
using RawDataWorkSheet.Repositories;

namespace RawDataWorkSheet.Services
{
    public class FinalRawDataService : IFinalRawDataService
    {
        private readonly IFinalRawDataRepository _repo;

        public FinalRawDataService(IFinalRawDataRepository repo)
        {
            _repo = repo;
        }

        public async Task SaveRawDataAsync(SaveWorksheetRawDataRequest request)
        {
            using var tx = await _repo.BeginTransactionAsync();

            try
            {
                await _repo.InsertWorksheetAsync(request.Worksheet, tx);

                var parameterIdMap =
                    await _repo.InsertParametersAsync(request.Parameters, tx);

                await _repo.InsertReferencesAsync(
                    request.References, parameterIdMap, tx);

                var preparationIdMap =
                    await _repo.InsertPreparationsAsync(
                        request.Preparations, parameterIdMap, tx);

                await _repo.InsertCalculationsAsync(
                    request.Calculations,
                    parameterIdMap,
                    preparationIdMap,
                    tx
                );

                tx.Commit();
            }
            catch
            {
                tx.Rollback();
                throw;
            }
        }
    }

}
