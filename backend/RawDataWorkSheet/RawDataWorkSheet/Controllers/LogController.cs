using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [ApiController]
    [Route("api/logs")]
    public class LogController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpPost]
        public async Task<IActionResult> InsertLog([FromBody] WorksheetLogRequest request)
        {
            try
            {
                await _logService.InsertLogAsync(request);
                return Ok(new { message = "Log inserted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("worksheet/{worksheetId}")]
        public async Task<IActionResult> GetByWorksheet(string worksheetId)
        {
            var logs = await _logService.GetByWorksheetIdAsync(worksheetId);
            return Ok(logs);
        }
    }
}
