export interface CalculationZptoShampoo {
  id: number;
  label: string;

  /** Label of the SamplePreparationZptoShampoo whose SW1/V1-V3 feed this calculation. */
  selectedSamplePreparationLabel: string | null;

  /** Auto-populated from the selected sample preparation. */
  sw1: string | null;
  /** 1st Dilution value1 — Volume Makeup (multiplied directly in numerator). */
  v1: string | null;
  /** 2nd Dilution value1 — take volume. */
  v2: string | null;
  /** 2nd Dilution value2 — makeup volume → DF = V3/V2 */
  v3: string | null;

  /** Pycnometer weights used to derive specific gravity. */
  w1EmptyPycnometer: string;
  w1Unit: string;
  w2PycnometerWithSample: string;
  w2Unit: string;
  w3PycnometerWithWater: string;
  w3Unit: string;

  /** Specific gravity (typically (W2−W1)/(W3−W1), but user may override). */
  specificGravity: string;

  /**
   * Molecular weights for the compound conversion.
   * MW1 = compound MW (e.g., Zinc Pyrithione = 317.68)
   * MW2 = element atomic weight measured by instrument (e.g., Zn = 65.39)
   */
  molecularWeight1: string;
  molecularWeight2: string;

  /** Label claim. */
  labelClaim: string;

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
