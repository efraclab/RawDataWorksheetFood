using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [Route("api")]
    [ApiController]
    public class RawDataController : ControllerBase
    {
        private readonly IRawDataService _rawDataService;
        public RawDataController(IRawDataService rawDataService)
        {
            _rawDataService = rawDataService;
        }

        [HttpPost("sample-details")]
        public async Task<IActionResult> GetSampleDetailsById([FromBody] string regNo)
        {
            try
            {
                var response = await _rawDataService.GetSampleDetailsByIdAsync(regNo);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("instruments")]
        public async Task<IActionResult> GetInstruments()
        {
            try
            {
                var response = await _rawDataService.GetInstrumentsAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("chemicals")]
        public async Task<IActionResult> GetChemicals()
        {
            try
            {
                var response = await _rawDataService.GetChemicalsAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("standards")]
        public async Task<IActionResult> GetStandards()
        {
            try
            {
                var response = await _rawDataService.GetStandardsAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("columns")]
        public async Task<IActionResult> GetColumns()
        {
            try
            {
                var response = await _rawDataService.GetCloumnsAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
