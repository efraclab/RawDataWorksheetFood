export interface DissoMediaPreparationStep {
  name: "Weighing" | "PH" | "Filtration" | "Sonication";
  value1: string;
  unit1?: string;
  logBookID?: string;
  solventChemical?: string;
}