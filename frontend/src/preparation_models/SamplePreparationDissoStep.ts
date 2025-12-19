export type SamplePreparationDissoStep = {
  name: "Instrument Details" | "Tablet Details" | "1st Dilution" | "2nd Dilution" | "3rd Dilution" | "Filtration";
  id?: string;
  rpm?: string;
  temp?: string;
  tempUnit?: string;
  claim?: string;
  claimUnit?: string;
  mediaVol?: string;
  time?: string;
  timeUnit?: string;
  value?: string;
  unit?: string;
  vol1?: string;
  vol2?: string;
  unit1?: string;
  unit2?: string;
  solventChemical?: string;
};