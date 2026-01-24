import type { SystemSuitabilityStep } from "./SystemSuitabilityStep";

export interface SystemSuitability {
  id: number;
  label: string;
  steps: SystemSuitabilityStep[];
}

