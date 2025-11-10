export interface DissoMediaStep {
  name: "Weighing" | "PH" | "Filtration" | "Sonication";
  value: string;
  unit?: string;
  logBookID?: string;
  solventChemical?: string;
}