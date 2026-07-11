import type { StandardPreparationHypromelloseStep } from './Standardpreparationhypromellosestep.ts';

export interface StandardPreparationHypromellose {
  assignedStandardId: string | null;
  /** Hypromellose needs BOTH Methyl Iodide and 2-Iodopropane on the same preparation,
   *  unlike other templates which only ever assign one standard. */
  assignedStandardIds?: string[];
  id: number;
  label: string;
  steps: StandardPreparationHypromelloseStep[];
}