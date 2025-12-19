import type { MobilePhaseStep } from './MobilePhaseStep';
export interface MobilePhase {
  id: number;
  label: string;
  steps: MobilePhaseStep[];
}