import type { SamplePreparationLodStep } from "./SamplePreparationLodStep";


export interface SamplePreparationLod {
  id: number;
  label: string;
  steps: SamplePreparationLodStep[];
}