using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Models;
using RawDataWorkSheet.Models.DTOs;
using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [ApiController]
    [Route("api/worksheets")]
    public class WorksheetController : ControllerBase
    {
        private readonly IWorksheetService _worksheetService;
        private readonly IUserService _userService;

        public WorksheetController(IWorksheetService worksheetService, IUserService userService)
        {
            _worksheetService = worksheetService;
            _userService = userService;
        }

        [HttpGet("analysts")]
        public async Task<IActionResult> GetAnalysts()
        {
            try
            {
                var analysts = await _userService.GetAnalystsAsync();
                return Ok(analysts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        

        [HttpPost()]
        public async Task<IActionResult> CreateWorksheet([FromBody] SaveWorksheetRequest request)
        {
            try
            {
                var worksheetId = await _worksheetService.CreateWorksheetAsync(request);
                return CreatedAtAction(nameof(GetWorksheetById), new { worksheetId }, new { worksheetId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{worksheetId}")]
        public async Task<IActionResult> UpdateWorksheet(string worksheetId, [FromBody] SaveWorksheetRequest request)
        {
            try
            {
                request.WorksheetId = worksheetId;
                var id = await _worksheetService.UpdateWorksheetAsync(request);
                return Ok(new { worksheetId = id });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("parameters/{parameterId}")]
        public async Task<IActionResult> UpdateParameter(int parameterId, [FromBody] ParameterDto request)
        {
            try
            {
                request.Id = parameterId;
                var id = await _worksheetService.UpdateParameterAsync(parameterId, request);
                return Ok(new { ParameterId = id });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{worksheetId}")]
        public async Task<IActionResult> DeleteWorksheet(string worksheetId)
        {
            try
            {
                await _worksheetService.DeleteWorksheetAsync(worksheetId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("parameters/{parameterId}")]
        public async Task<IActionResult> DeleteParameter(int parameterId)
        {
            try
            {
                await _worksheetService.DeleteParameterAsync(parameterId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("get/{worksheetId}")]
        public async Task<IActionResult> GetWorksheetById(string worksheetId, [FromBody] FetchWorksheetsRequest request)
        {
            try
            {
                return Ok(await _worksheetService.GetWorksheetByIdAsync(worksheetId, request));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        //[HttpGet]
        //public async Task<IActionResult> GetAll([FromQuery] string? status)
        //{
        //    return Ok(await _worksheetService.GetAllAsync(status));
        //}

        [HttpPost("get-all")]
        public async Task<IActionResult> GetAllWorksheets([FromBody] FetchWorksheetsRequest request)
        {
            return Ok(await _worksheetService.GetAllWorksheetsAsync(request));
        }
    }
}
