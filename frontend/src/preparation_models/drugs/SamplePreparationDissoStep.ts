export type SamplePreparationDissoStep = {
  name: "Instrument Details" | "Tablet Details" | "1st Dilution" | "2nd Dilution" | "3rd Dilution" | "Filtration";
  id?: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  solventChemical?: string;
};