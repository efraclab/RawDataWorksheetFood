import type { SamplePreparationDissoStep } from "./SamplePreparationDissoStep";

export interface SamplePreparationDisso {
  id: number;
  label: string;
  steps: SamplePreparationDissoStep[];
}