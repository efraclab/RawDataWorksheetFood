using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Models.References;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [ApiController]
    [Route("api/standards")]
    public class StandardController : ControllerBase
    {
        private readonly IStandardService _service;

        public StandardController(IStandardService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] StandardMaster request)
        {
            await _service.AddAsync(request);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] StandardMaster request)
        {
            await _service.UpdateAsync(request);
            return Ok();
        }

        [HttpDelete("{serialNo}")]
        public async Task<IActionResult> Delete(string serialNo)
        {
            await _service.DeleteAsync(serialNo);
            return NoContent();
        }
    }
}
