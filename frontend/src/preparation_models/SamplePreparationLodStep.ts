export type SamplePreparationLodStep = {
  name: "Weighing (Empty Bottle)" | "Weighing (Before Drying)" | "Drying" | "Weighing (After Drying)";
  value?: string;
  unit?: string;
  temp?: string;
  tempUnit?: string;
  time?: string;
  timeUnit?: string;
  logBookID?: string;
};