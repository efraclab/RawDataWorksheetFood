using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LogInRequest request)
        {
            if (request == null)
                return BadRequest("Invalid request.");

            var token = await _userService.LoginAsync(request);

            if (string.IsNullOrEmpty(token))
                return Unauthorized("Invalid username or password.");

            return Ok(new { token });
        }
    }
}
