export interface MobilePhasePreparationStep {
  name: "Weighing/Measuring" | "PH" | "Filtration" | "Sonication";
  value1: string;
  unit1?: string;
  logBookID?: string;
  mobilePhaseID?: string;
  solventChemical?: string;
}