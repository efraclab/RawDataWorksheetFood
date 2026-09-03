export type SamplePreparationHypromelloseStep = {
  name:
    | "Weighing (Sample)"
    | "Weighing (Adipic Acid)"
    | "Internal Standard Solution"
    | "Hydriodic Acid"
    | "Weighing (Vial + Contents)"
    | "Isopropyl Iodide - in Weight"
    | "Methyl Iodide - in Weight"
    | "Heating";
  value1?: string; // primary reading, or weight BEFORE addition for by-difference steps; temperature for Heating
  unit1?: string;
  value2?: string; // weight AFTER addition for by-difference steps; duration for Heating
  unit2?: string;
  logBookID?: string;
  solventChemical?: string;
};