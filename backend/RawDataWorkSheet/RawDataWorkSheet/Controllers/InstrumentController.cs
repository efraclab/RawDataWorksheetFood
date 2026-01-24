using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Models.References;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [ApiController]
    [Route("api/instruments")]
    public class InstrumentController : ControllerBase
    {
        private readonly IInstrumentService _service;

        public InstrumentController(IInstrumentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] InstrumentMaster request)
        {
            await _service.AddAsync(request);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] InstrumentMaster request)
        {
            await _service.UpdateAsync(request);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
