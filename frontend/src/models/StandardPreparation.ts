import type { StandardPreparationStep } from './StandardPreparationStep';
export interface StandardPreparation {
  id: number;
  label: string;
  steps: StandardPreparationStep[];
}