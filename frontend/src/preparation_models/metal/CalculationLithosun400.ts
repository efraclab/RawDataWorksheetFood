export interface CalculationLithosun400 {
  id: number;
  label: string;


  selectedSamplePreparationLabel: string | null;

  v1: string | null;
  v2: string | null;
  v3: string | null;

  conversionFactor: string | null;

  labelClaim: string | null;
  labelClaimUnit: string | null;

  // ─── Per-time-point blank concentration ───────────────────────────────────
  instrumentConcentrationBlankT1: string | null;  instrumentConcentrationBlankUnitT1: string | null;
  instrumentConcentrationBlankT2: string | null;  instrumentConcentrationBlankUnitT2: string | null;
  instrumentConcentrationBlankT3: string | null;  instrumentConcentrationBlankUnitT3: string | null;
  instrumentConcentrationBlankT4: string | null;  instrumentConcentrationBlankUnitT4: string | null;
  instrumentConcentrationBlankT5: string | null;  instrumentConcentrationBlankUnitT5: string | null;
  instrumentConcentrationBlankT6: string | null;  instrumentConcentrationBlankUnitT6: string | null;
  instrumentConcentrationBlankT7: string | null;  instrumentConcentrationBlankUnitT7: string | null;
  instrumentConcentrationBlankT8: string | null;  instrumentConcentrationBlankUnitT8: string | null;
  instrumentConcentrationBlankT9: string | null;  instrumentConcentrationBlankUnitT9: string | null;
  instrumentConcentrationBlankT10: string | null; instrumentConcentrationBlankUnitT10: string | null;

  instrumentConcentrationSampleUnit: string;

  numberOfTimePoints: number;

  timePointLabel1: string | null;
  timePointLabel2: string | null;
  timePointLabel3: string | null;
  timePointLabel4: string | null;
  timePointLabel5: string | null;
  timePointLabel6: string | null;
  timePointLabel7: string | null;
  timePointLabel8: string | null;
  timePointLabel9: string | null;
  timePointLabel10: string | null;


  // Time Point 1
  sampleT1Tab1: string | null;
  sampleT1Tab2: string | null;
  sampleT1Tab3: string | null;
  sampleT1Tab4: string | null;
  sampleT1Tab5: string | null;
  sampleT1Tab6: string | null;

  // Time Point 2
  sampleT2Tab1: string | null;
  sampleT2Tab2: string | null;
  sampleT2Tab3: string | null;
  sampleT2Tab4: string | null;
  sampleT2Tab5: string | null;
  sampleT2Tab6: string | null;

  // Time Point 3
  sampleT3Tab1: string | null;
  sampleT3Tab2: string | null;
  sampleT3Tab3: string | null;
  sampleT3Tab4: string | null;
  sampleT3Tab5: string | null;
  sampleT3Tab6: string | null;

  // Time Point 4
  sampleT4Tab1: string | null;
  sampleT4Tab2: string | null;
  sampleT4Tab3: string | null;
  sampleT4Tab4: string | null;
  sampleT4Tab5: string | null;
  sampleT4Tab6: string | null;

  // Time Point 5
  sampleT5Tab1: string | null;
  sampleT5Tab2: string | null;
  sampleT5Tab3: string | null;
  sampleT5Tab4: string | null;
  sampleT5Tab5: string | null;
  sampleT5Tab6: string | null;

  // Time Point 6
  sampleT6Tab1: string | null;
  sampleT6Tab2: string | null;
  sampleT6Tab3: string | null;
  sampleT6Tab4: string | null;
  sampleT6Tab5: string | null;
  sampleT6Tab6: string | null;

  // Time Point 7
  sampleT7Tab1: string | null;
  sampleT7Tab2: string | null;
  sampleT7Tab3: string | null;
  sampleT7Tab4: string | null;
  sampleT7Tab5: string | null;
  sampleT7Tab6: string | null;

  // Time Point 8
  sampleT8Tab1: string | null;
  sampleT8Tab2: string | null;
  sampleT8Tab3: string | null;
  sampleT8Tab4: string | null;
  sampleT8Tab5: string | null;
  sampleT8Tab6: string | null;

  // Time Point 9
  sampleT9Tab1: string | null;
  sampleT9Tab2: string | null;
  sampleT9Tab3: string | null;
  sampleT9Tab4: string | null;
  sampleT9Tab5: string | null;
  sampleT9Tab6: string | null;

  // Time Point 10
  sampleT10Tab1: string | null;
  sampleT10Tab2: string | null;
  sampleT10Tab3: string | null;
  sampleT10Tab4: string | null;
  sampleT10Tab5: string | null;
  sampleT10Tab6: string | null;

  // ─── Per-time-point computed results (% of L.C.) per tablet ───────────────
  // Naming convention: resultT{timePoint}Tab{tablet}

  // Time Point 1
  resultT1Tab1: string | null;
  resultT1Tab2: string | null;
  resultT1Tab3: string | null;
  resultT1Tab4: string | null;
  resultT1Tab5: string | null;
  resultT1Tab6: string | null;

  // Time Point 2
  resultT2Tab1: string | null;
  resultT2Tab2: string | null;
  resultT2Tab3: string | null;
  resultT2Tab4: string | null;
  resultT2Tab5: string | null;
  resultT2Tab6: string | null;

  // Time Point 3
  resultT3Tab1: string | null;
  resultT3Tab2: string | null;
  resultT3Tab3: string | null;
  resultT3Tab4: string | null;
  resultT3Tab5: string | null;
  resultT3Tab6: string | null;

  // Time Point 4
  resultT4Tab1: string | null;
  resultT4Tab2: string | null;
  resultT4Tab3: string | null;
  resultT4Tab4: string | null;
  resultT4Tab5: string | null;
  resultT4Tab6: string | null;

  // Time Point 5
  resultT5Tab1: string | null;
  resultT5Tab2: string | null;
  resultT5Tab3: string | null;
  resultT5Tab4: string | null;
  resultT5Tab5: string | null;
  resultT5Tab6: string | null;

  // Time Point 6
  resultT6Tab1: string | null;
  resultT6Tab2: string | null;
  resultT6Tab3: string | null;
  resultT6Tab4: string | null;
  resultT6Tab5: string | null;
  resultT6Tab6: string | null;

  // Time Point 7
  resultT7Tab1: string | null;
  resultT7Tab2: string | null;
  resultT7Tab3: string | null;
  resultT7Tab4: string | null;
  resultT7Tab5: string | null;
  resultT7Tab6: string | null;

  // Time Point 8
  resultT8Tab1: string | null;
  resultT8Tab2: string | null;
  resultT8Tab3: string | null;
  resultT8Tab4: string | null;
  resultT8Tab5: string | null;
  resultT8Tab6: string | null;

  // Time Point 9
  resultT9Tab1: string | null;
  resultT9Tab2: string | null;
  resultT9Tab3: string | null;
  resultT9Tab4: string | null;
  resultT9Tab5: string | null;
  resultT9Tab6: string | null;

  // Time Point 10
  resultT10Tab1: string | null;
  resultT10Tab2: string | null;
  resultT10Tab3: string | null;
  resultT10Tab4: string | null;
  resultT10Tab5: string | null;
  resultT10Tab6: string | null;

  // ─── Per-time-point summary statistics ────────────────────────────────────
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

  // ─── Per-time-point acceptance limits ─────────────────────────────────────
  acceptanceLimitMin1: string | null;  acceptanceLimitMax1: string | null;
  acceptanceLimitMin2: string | null;  acceptanceLimitMax2: string | null;
  acceptanceLimitMin3: string | null;  acceptanceLimitMax3: string | null;
  acceptanceLimitMin4: string | null;  acceptanceLimitMax4: string | null;
  acceptanceLimitMin5: string | null;  acceptanceLimitMax5: string | null;
  acceptanceLimitMin6: string | null;  acceptanceLimitMax6: string | null;
  acceptanceLimitMin7: string | null;  acceptanceLimitMax7: string | null;
  acceptanceLimitMin8: string | null;  acceptanceLimitMax8: string | null;
  acceptanceLimitMin9: string | null;  acceptanceLimitMax9: string | null;
  acceptanceLimitMin10: string | null; acceptanceLimitMax10: string | null;

  calculationResultUnit: string | null;
}