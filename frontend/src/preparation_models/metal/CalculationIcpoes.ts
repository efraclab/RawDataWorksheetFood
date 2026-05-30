export interface CalculationIcpoes {
  id: number;
  label: string;

  /** Label of the SamplePreparationIcpoes whose SW1/V1/V2/V3 feed this calculation. */
  selectedSamplePreparationLabel: string | null;

  /** Auto-populated from the selected sample preparation. */
  sw: string | null;
  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;
  v5: string | null;
  v6: string | null;
  v7: string | null;


  /** User-entered instrument readings. */
  instrumentConcentrationSample: string;
  instrumentConcentrationSampleUnit: string;
  instrumentConcentrationBlank: string;
  instrumentConcentrationBlankUnit: string;

  /** Acceptance limits (as-text). */
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;

  /** Computed result. */
  calculationResult: string | null;
  calculationResultUnit: string | null;
}
