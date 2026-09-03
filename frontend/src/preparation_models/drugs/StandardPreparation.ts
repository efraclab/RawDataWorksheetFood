import type { StandardPreparationStep } from './StandardPreparationStep';
export interface StandardPreparation {
  assignedStandardId: string | null;
  id: number;
  label: string;
  steps: StandardPreparationStep[];
}