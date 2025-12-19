using System.ComponentModel.DataAnnotations;

namespace RawDataWorkSheet.Models.Requests
{
    public class LogInRequest
    {
        [Required]
        public string EmployeeId { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
