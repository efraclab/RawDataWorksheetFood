import type { SamplePreparationMetalStep } from "./SamplePreparationMetalStep";

export interface SamplePreparationMetal {
  id: number;
  label: string;
  steps: SamplePreparationMetalStep[];
}
