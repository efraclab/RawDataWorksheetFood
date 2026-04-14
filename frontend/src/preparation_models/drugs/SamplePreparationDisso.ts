import type { SamplePreparationDissoStep } from "./SamplePreparationDissoStep";

export interface SamplePreparationDisso {
  assignedStandardId: string | null;
  id: number;
  label: string;
  steps: SamplePreparationDissoStep[];
}