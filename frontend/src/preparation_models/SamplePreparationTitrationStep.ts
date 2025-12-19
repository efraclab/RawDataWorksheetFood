export type SamplePreparationTitrationStep = {
  name: "Weighing" | "1st Dilution" | "End Point Determination" ;
  value?: string;
  unit?: string;
  logBookID?: string;
  solventChemical?: string;
};