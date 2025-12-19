using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Models.Requests;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [ApiController]
    [Route("api/worksheets")]
    public class WorksheetController : ControllerBase
    {
        private readonly IWorksheetService _service;

        public WorksheetController(IWorksheetService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SaveWorksheetRequest request)
        {
            try
            {
                var worksheetId = await _service.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { worksheetId }, new { worksheetId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{worksheetId}")]
        public async Task<IActionResult> Update(string worksheetId, [FromBody] SaveWorksheetRequest request)
        {
            try
            {
                request.WorksheetId = worksheetId;
                var id = await _service.UpdateAsync(request);
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

        [HttpDelete("{worksheetId}")]
        public async Task<IActionResult> Delete(string worksheetId)
        {
            try
            {
                await _service.DeleteAsync(worksheetId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("{worksheetId}")]
        public async Task<IActionResult> GetById(string worksheetId)
        {
            try
            {
                return Ok(await _service.GetAsync(worksheetId));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? status)
        {
            return Ok(await _service.GetAllAsync(status));
        }
    }
}
