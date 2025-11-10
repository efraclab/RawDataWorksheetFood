export interface MobilePhaseStep {
  name: "Weighing" | "PH" | "Filtration" | "Sonication";
  value: string;
  unit?: string;
  logBookID?: string;
  mobilePhaseID?: string;
  solventChemical?: string;
}