import type { SamplePreparationHypromelloseStep } from './Samplepreparationhypromellosestep';

export interface SamplePreparationHypromellose {
  id: number;
  label: string;
  assignedStandardId?: string;
  assignedStandardIds?: string[];
  steps: SamplePreparationHypromelloseStep[];
}