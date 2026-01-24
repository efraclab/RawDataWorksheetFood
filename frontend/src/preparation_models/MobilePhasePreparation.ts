import type { MobilePhasePreparationStep } from './MobilePhasePreparationStep';
export interface MobilePhasePreparation {
  id: number;
  label: string;
  steps: MobilePhasePreparationStep[];
}