import type { LinearityStandardStockSolutionStep } from './LinearityStandardStockSolutionStep';


export interface LinearityStandardStockSolution {
  id: number;
  label: string;
  steps: LinearityStandardStockSolutionStep[];
}
