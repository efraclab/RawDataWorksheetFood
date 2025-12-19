import type { SamplePreparationStep } from './SamplePreparationStep';

export interface SamplePreparation {
  id: number;
  label: string;
  steps: SamplePreparationStep[];
  assignedStandardId?: string;
}