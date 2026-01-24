namespace RawDataWorkSheet.Models.References
{
    public class ChemicalMaster
    {
        public string SLNO { get; set; }
        public string Name { get; set; }
        public string? Code { get; set; }
        public string? Make { get; set; }
        public string? Part_No { get; set; }
        public DateTime? Exp_Date { get; set; }
        public string? BatchNo { get; set; }
        public string? Modular_Height { get; set; }
        public string? Cas_No { get; set; }
        public DateTime? Manufacturer_Date { get; set; }
        public string? PackQuantity { get; set; }
        public string? PackUnit { get; set; }
    }
}
