export type StandardPreparationHypromelloseStep = {
  name:
    | "Weighing (Adipic Acid)"
    | "Hydriodic Acid"
    | "Internal Standard Solution"
    | "Weighing (Vial + Contents)"
    | "Isopropyl Iodide - By Difference"
    | "Isopropyl Iodide - in Weight"
    | "Weight of Isopropyl Iodide"
    | "Methyl Iodide - By Difference"
    | "Methyl Iodide - in Weight"
    | "Weight of Methyl Iodide";
  value1?: string; // primary reading, or weight BEFORE addition for by-difference steps
  unit1?: string;
  value2?: string; // weight AFTER addition for by-difference steps
  unit2?: string;
  logBookID?: string;
  solventChemical?: string;
};