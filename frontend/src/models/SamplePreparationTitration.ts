import type { SamplePreparationTitrationStep } from "./SamplePreparationTitrationStep";

export interface SamplePreparationTitration {
  id: number;
  label: string;
  steps: SamplePreparationTitrationStep[];
}