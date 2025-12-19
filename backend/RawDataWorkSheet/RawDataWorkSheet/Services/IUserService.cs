using RawDataWorkSheet.Models.Requests;

namespace RawDataWorkSheet.Services
{
    public interface IUserService
    {
        Task<string?> LoginAsync(LogInRequest request);
    }
}
