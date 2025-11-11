export type StandardPreparationStep = {
  name: "Weighing" | "1st Dilution" | "2nd Dilution" | "3rd Dilution" | "4th Dilution" | "Filtration";
  value?: string;
  unit?: string;
  vol1?: string;
  vol2?: string;
  unit1?: string;
  unit2?: string;
  logBookID?: string;
  solventChemical?: string;
};