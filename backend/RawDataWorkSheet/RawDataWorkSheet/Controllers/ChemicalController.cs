using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RawDataWorkSheet.Models.References;
using RawDataWorkSheet.Services;

namespace RawDataWorkSheet.Controllers
{
    [ApiController]
    [Route("api/chemicals")]
    public class ChemicalController : ControllerBase
    {
        private readonly IChemicalService _service;

        public ChemicalController(IChemicalService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] ChemicalMaster request)
        {
            await _service.AddAsync(request);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ChemicalMaster request)
        {
            await _service.UpdateAsync(request);
            return Ok();
        }

        [HttpDelete("{slNo}")]
        public async Task<IActionResult> Delete(string slNo)
        {
            await _service.DeleteAsync(slNo);
            return NoContent();
        }
    }
}
