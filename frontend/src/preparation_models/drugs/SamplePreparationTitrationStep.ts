export type SamplePreparationTitrationStep = {
  name: "Weighing" | "Tablet Details" | "1st Dilution" | "End Point Determination" ;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  logBookID?: string;
  solventChemical?: string;
};