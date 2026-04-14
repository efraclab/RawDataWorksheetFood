import type { DissoMediaPreparationStep } from './DissoMediaPreparationStep';
export interface DissoMediaPreparation {
  id: number;
  label: string;
  steps: DissoMediaPreparationStep[];
}