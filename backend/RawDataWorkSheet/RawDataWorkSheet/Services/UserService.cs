using Microsoft.AspNetCore.Identity.Data;
using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Repositories;
using RawDataWorkSheet.Utils;

namespace RawDataWorkSheet.Services
{

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;

        public UserService(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<string?> LoginAsync(LogInRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.EmployeeId) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return null;
            }

            var user = await _userRepository.GetUserAsync(request.EmployeeId);

            if (user == null)
                return null;

            // ⚠️ Plain-text comparison (same as your existing logic)
            // If hashing is added later, it should be done HERE
            if (user.Password != request.Password)
                return null;

            return _jwtService.GenerateToken(user);
        }


        public async Task<IEnumerable<User?>> GetAnalystsAsync()
        {
            var analysts = await _userRepository.GetAnalystsAsync();

            return analysts;
        }
    }
}
