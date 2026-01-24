export type SamplePreparationTitrationStep = {
  name: "Weighing" | "1st Dilution" | "End Point Determination" ;
  value1?: string;
  unit1?: string;
  logBookID?: string;
  solventChemical?: string;
};