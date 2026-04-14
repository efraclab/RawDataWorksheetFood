import type { SamplePreparationUCStep } from "./SamplePreparationUCStep";

export interface SamplePreparationUC {
  id: number;
  label: string;
  assignedStandardId: string | null;
  steps: SamplePreparationUCStep[];
}

