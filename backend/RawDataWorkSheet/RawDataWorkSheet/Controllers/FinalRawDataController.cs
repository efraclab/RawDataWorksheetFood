using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Models.FinalRawData;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [ApiController]
    [Route("api/raw-data")]
    public class FinalRawDataController : ControllerBase
    {
        private readonly IFinalRawDataService _service;

        public FinalRawDataController(IFinalRawDataService service)
        {
            _service = service;
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] SaveWorksheetRawDataRequest request)
        {
            await _service.SaveRawDataAsync(request);
            return Ok(new { success = true });
        }
    }
}
