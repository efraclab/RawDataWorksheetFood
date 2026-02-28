export interface CalculationDissoProfile {
  id: number;
  label: string;
  selectedStandardPreparationLabel: string | null;
  selectedSamplePreparationLabel: string | null;

  areaOfStandard: string;

  numberOfTimePoints: number;

  volumeWithdraw: string;
  volumeReplaced: string;

  // ── Per-time-point detail labels ──────────────────────────────────────────
  timePointDetail1: string | null;
  timePointDetail2: string | null;
  timePointDetail3: string | null;
  timePointDetail4: string | null;
  timePointDetail5: string | null;
  timePointDetail6: string | null;
  timePointDetail7: string | null;
  timePointDetail8: string | null;
  timePointDetail9: string | null;
  timePointDetail10: string | null;

  // ── Per-time-point sample areas (T1..T10, S1..S6) ────────────────────────
  areaOfSampleT1S1: string | null;
  areaOfSampleT1S2: string | null;
  areaOfSampleT1S3: string | null;
  areaOfSampleT1S4: string | null;
  areaOfSampleT1S5: string | null;
  areaOfSampleT1S6: string | null;

  areaOfSampleT2S1: string | null;
  areaOfSampleT2S2: string | null;
  areaOfSampleT2S3: string | null;
  areaOfSampleT2S4: string | null;
  areaOfSampleT2S5: string | null;
  areaOfSampleT2S6: string | null;

  areaOfSampleT3S1: string | null;
  areaOfSampleT3S2: string | null;
  areaOfSampleT3S3: string | null;
  areaOfSampleT3S4: string | null;
  areaOfSampleT3S5: string | null;
  areaOfSampleT3S6: string | null;

  areaOfSampleT4S1: string | null;
  areaOfSampleT4S2: string | null;
  areaOfSampleT4S3: string | null;
  areaOfSampleT4S4: string | null;
  areaOfSampleT4S5: string | null;
  areaOfSampleT4S6: string | null;

  areaOfSampleT5S1: string | null;
  areaOfSampleT5S2: string | null;
  areaOfSampleT5S3: string | null;
  areaOfSampleT5S4: string | null;
  areaOfSampleT5S5: string | null;
  areaOfSampleT5S6: string | null;

  areaOfSampleT6S1: string | null;
  areaOfSampleT6S2: string | null;
  areaOfSampleT6S3: string | null;
  areaOfSampleT6S4: string | null;
  areaOfSampleT6S5: string | null;
  areaOfSampleT6S6: string | null;

  areaOfSampleT7S1: string | null;
  areaOfSampleT7S2: string | null;
  areaOfSampleT7S3: string | null;
  areaOfSampleT7S4: string | null;
  areaOfSampleT7S5: string | null;
  areaOfSampleT7S6: string | null;

  areaOfSampleT8S1: string | null;
  areaOfSampleT8S2: string | null;
  areaOfSampleT8S3: string | null;
  areaOfSampleT8S4: string | null;
  areaOfSampleT8S5: string | null;
  areaOfSampleT8S6: string | null;

  areaOfSampleT9S1: string | null;
  areaOfSampleT9S2: string | null;
  areaOfSampleT9S3: string | null;
  areaOfSampleT9S4: string | null;
  areaOfSampleT9S5: string | null;
  areaOfSampleT9S6: string | null;

  areaOfSampleT10S1: string | null;
  areaOfSampleT10S2: string | null;
  areaOfSampleT10S3: string | null;
  areaOfSampleT10S4: string | null;
  areaOfSampleT10S5: string | null;
  areaOfSampleT10S6: string | null;

  // ── Analytical parameters ─────────────────────────────────────────────────
  purity: string;
  mWSalt: string;
  mWBase: string;

  claim: string;
  claimUnit: string;

  // ── Persisted calculation outputs ─────────────────────────────────────────
  // Per-sample results for each time point (index 0 = S1 .. index 5 = S6, null if not entered)
  sampleResultsT1: (number | null)[] | null;
  sampleResultsT2: (number | null)[] | null;
  sampleResultsT3: (number | null)[] | null;
  sampleResultsT4: (number | null)[] | null;
  sampleResultsT5: (number | null)[] | null;
  sampleResultsT6: (number | null)[] | null;
  sampleResultsT7: (number | null)[] | null;
  sampleResultsT8: (number | null)[] | null;
  sampleResultsT9: (number | null)[] | null;
  sampleResultsT10: (number | null)[] | null;

  // Per-sample correction factors for T2..T10 (index 0 = S1 .. index 5 = S6, null if not entered)
  correctionFactorsT2: (number | null)[] | null;
  correctionFactorsT3: (number | null)[] | null;
  correctionFactorsT4: (number | null)[] | null;
  correctionFactorsT5: (number | null)[] | null;
  correctionFactorsT6: (number | null)[] | null;
  correctionFactorsT7: (number | null)[] | null;
  correctionFactorsT8: (number | null)[] | null;
  correctionFactorsT9: (number | null)[] | null;
  correctionFactorsT10: (number | null)[] | null;

  // Per-sample result-after-correction for T2..T10 (index 0 = S1 .. index 5 = S6, null if not entered)
  resultsAfterCorrectionT2: (number | null)[] | null;
  resultsAfterCorrectionT3: (number | null)[] | null;
  resultsAfterCorrectionT4: (number | null)[] | null;
  resultsAfterCorrectionT5: (number | null)[] | null;
  resultsAfterCorrectionT6: (number | null)[] | null;
  resultsAfterCorrectionT7: (number | null)[] | null;
  resultsAfterCorrectionT8: (number | null)[] | null;
  resultsAfterCorrectionT9: (number | null)[] | null;
  resultsAfterCorrectionT10: (number | null)[] | null;

  // Stats per time point
  minT1: number | null; avgT1: number | null; maxT1: number | null;
  minT2: number | null; avgT2: number | null; maxT2: number | null;
  minT3: number | null; avgT3: number | null; maxT3: number | null;
  minT4: number | null; avgT4: number | null; maxT4: number | null;
  minT5: number | null; avgT5: number | null; maxT5: number | null;
  minT6: number | null; avgT6: number | null; maxT6: number | null;
  minT7: number | null; avgT7: number | null; maxT7: number | null;
  minT8: number | null; avgT8: number | null; maxT8: number | null;
  minT9: number | null; avgT9: number | null; maxT9: number | null;
  minT10: number | null; avgT10: number | null; maxT10: number | null;

  // ── Volume snapshot fields ────────────────────────────────────────────────
  sw1: string | null;
  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;
  v5: string | null;
  v6: string | null;
  v7: string | null;
  v8: string | null;
  v9: string | null;
  v10: string | null;
  v11: string | null;
  v12: string | null;
  v13: string | null;
  v14: string | null;

  v8TimePoint1: string | null;
  v8TimePoint2: string | null;
  v8TimePoint3: string | null;
  v8TimePoint4: string | null;
  v8TimePoint5: string | null;
  v8TimePoint6: string | null;
  v8TimePoint7: string | null;
  v8TimePoint8: string | null;
  v8TimePoint9: string | null;
  v8TimePoint10: string | null;

  // ── Per-time-point acceptance limits (range: min to max) ─────────────────
  acceptanceLimitMin1: string | null;
  acceptanceLimitMax1: string | null;
  acceptanceLimitMin2: string | null;
  acceptanceLimitMax2: string | null;
  acceptanceLimitMin3: string | null;
  acceptanceLimitMax3: string | null;
  acceptanceLimitMin4: string | null;
  acceptanceLimitMax4: string | null;
  acceptanceLimitMin5: string | null;
  acceptanceLimitMax5: string | null;
  acceptanceLimitMin6: string | null;
  acceptanceLimitMax6: string | null;
  acceptanceLimitMin7: string | null;
  acceptanceLimitMax7: string | null;
  acceptanceLimitMin8: string | null;
  acceptanceLimitMax8: string | null;
  acceptanceLimitMin9: string | null;
  acceptanceLimitMax9: string | null;
  acceptanceLimitMin10: string | null;
  acceptanceLimitMax10: string | null;

  /** @deprecated Use acceptanceLimitMin1/Max1 etc. – kept for backward-compat */
  acceptanceLimit: string | null;
}