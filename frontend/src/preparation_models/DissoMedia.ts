import type { DissoMediaStep } from './DissoMediaStep';
export interface DissoMedia {
  id: number;
  label: string;
  steps: DissoMediaStep[];
}