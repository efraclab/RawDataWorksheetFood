using System.ComponentModel.DataAnnotations;

namespace RawDataWorkSheet.Models.Requests
{
    public class SampleDetailsRequest
    {
        [Required]
        public string RegNo { get; set; }

        [Required]
        public string Lab { get; set; }
    }
}
