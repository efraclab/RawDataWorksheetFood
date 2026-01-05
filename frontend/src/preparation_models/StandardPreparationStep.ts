export type StandardPreparationStep = {
  name: "Weighing" | "1st Dilution" | "2nd Dilution" | "3rd Dilution" | "4th Dilution" | "Filtration";
  value1?: string;
  value2?: string;
  unit1?: string;
  unit2?: string;
  logBookID?: string;
  solventChemical?: string;
};