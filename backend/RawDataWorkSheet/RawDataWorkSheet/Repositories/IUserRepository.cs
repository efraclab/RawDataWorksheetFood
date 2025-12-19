using RawDataWorkSheet.Models;

namespace RawDataWorkSheet.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserAsync(string employeeId);
    }
}