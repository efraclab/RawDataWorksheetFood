import type { SamplePreparationROIStep } from "./SamplePreparationROIStep";

export interface SamplePreparationROI {
  id: number;
  label: string;
  steps: SamplePreparationROIStep[];
}