import type { StandardPreparationMetalStep } from "./StandardPreparationMetalStep";


export interface StandardPreparationMetal {
  id: number;
  label: string;
  steps: StandardPreparationMetalStep[];
}
