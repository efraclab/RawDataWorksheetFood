import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { TblCalculationRow } from "./TblCalculationRow";
import type { TblFileRow } from "./TblFileRow";
import type { TblParameterRow } from "./TblParameterRow";
import type { TblPreparationRow } from "./TblPreparationRow";
import type { TblReferenceRow } from "./TblReferenceRow";
import type { TblWorksheetRow } from "./TblWorksheetRow";
import type { WorksheetDbPayload } from "./WorksheetDbPayload";

const nv = (v: any): string | null =>
  v === undefined || v === null || String(v).trim() === "" ? null : String(v);

const safeParse = <T = any>(json: any, fallback: T): T => {
  if (!json) return fallback;
  if (typeof json !== "string") return json as T;
  try { return JSON.parse(json); } catch { return fallback; }
};

export class WorksheetDbMapper {

  // ════════════════════════════════════════════════════════════════════════════
  // WORKSHEET
  // ════════════════════════════════════════════════════════════════════════════

  static mapWorksheet(detail: WorksheetDetail): TblWorksheetRow {
    const s = detail.sample;
    return {
      WorksheetId: s.worksheetId,
      RegistrationNo: s.registrationNo,
      SampleName: s.sampleName,
      NumberOfParameters: s.numberOfParameters,
      DueDate: s.dueDate,
      WorksheetPreparedBy: s.preparedBy,
      WorksheetStatus: s.status,
      WorksheetCreatedAt: s.createdAt,
      WorksheetUpdatedAt: s.updatedAt!,
      WorksheetApprovedAt: nv(s.approvedAt),
      // QA workflow fields
      SubmittedQaBy: nv(s.submittedQaBy),
      SubmittedQaAt: nv(s.submittedQaAt),
      ApprovedBy:    nv(s.approvedBy),
    };
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PARAMETERS
  // ════════════════════════════════════════════════════════════════════════════

  static mapParameters(detail: WorksheetDetail): TblParameterRow[] {
    return detail.parameters.map((p) => ({
      WorksheetId: detail.sample.worksheetId,
      ParameterCode: p.paraCode,
      ParameterName: p.parameterName,
      MethodCode: p.methodCode,
      MethodName: p.methodName,
      ColumnId: nv(p.columnId),
      OtherInfo: nv(p.otherInfo),
      ParameterAnalyzedBy: nv(p.analyzedBy),
      ParameterStatus: p.status!,
      AnalysisStartedAt: nv(p.analysisStartDate),
      AnalysisCompletedAt: nv(p.analysisCompletionDate),
      // Reviewer approval
      ApprovedByReviewer: nv(p.approvedByReviewer),
      ApprovedAtReviewer: nv(p.approvedAtReviewer),
      // QA validation
      ApprovedByQA:      nv(p.approvedByQA),
      ApprovedAtQA:      nv(p.approvedAtQA),
      // Remarks
      RemarksByQA:       nv(p.remarksByQA),
      RemarksByReviewer: nv(p.remarksByReviewer),
    }));
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REFERENCES  (instruments / chemicals / standards)
  // ════════════════════════════════════════════════════════════════════════════

  static mapReferences(detail: WorksheetDetail): TblReferenceRow[] {
    const rows: TblReferenceRow[] = [];
    const worksheetId = detail.sample.worksheetId;

    detail.parameters.forEach((p) => {
      p.instrumentIds?.forEach(
        (id) => nv(id) && rows.push({ WorksheetId: worksheetId, ParameterCode: p.paraCode, ReferenceType: "INSTRUMENT", ReferenceCode: id.trim() })
      );
      p.chemicalIds?.forEach(
        (id) => nv(id) && rows.push({ WorksheetId: worksheetId, ParameterCode: p.paraCode, ReferenceType: "CHEMICAL",    ReferenceCode: id.trim() })
      );
      p.standardIds?.forEach(
        (id) => nv(id) && rows.push({ WorksheetId: worksheetId, ParameterCode: p.paraCode, ReferenceType: "STANDARD",   ReferenceCode: id.trim() })
      );
    });

    return rows;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PREPARATIONS
  // ════════════════════════════════════════════════════════════════════════════

  static mapPreparations(detail: WorksheetDetail): TblPreparationRow[] {
    const rows: TblPreparationRow[] = [];

    detail.parameters.forEach((p) => {

      const mapPrep = (prep: any, category: TblPreparationRow["PrepCategory"]) => {
        const base = {
          WorksheetId: detail.sample.worksheetId,
          ParameterCode: p.paraCode,
          PrepCategory: category,
          PrepLabel: prep.label,
          // prep.preparationType may be null for buffer/mobile_phase/diluent/blank/system_suitability
          PreparationType: nv(prep.preparationType),
          AssignedStandardId: nv(prep.assignedStandardId),
        };

        // ── Content-only preps (single row, no step expansion) ─────────────
        if (category === "BLANK" || category === "MOBILE_PHASE" || category === "DILUENT") {
          rows.push({
            ...base,
            StepName: null,
            StepOrder: null,
            Value1: null, Unit1: null,
            Value2: null, Unit2: null,
            Value3: null, Unit3: null,
            SolventChemical: null,
            LogBookID: null,
            LimitType: null,
            Content: nv(prep.content),
          });
          return;
        }

        // ── Step-based preps (STANDARD, SAMPLE, DISSOLUTION_MEDIA, BUFFER, SYSTEM_SUITABILITY) ──
        const steps: any[] = safeParse(prep.steps, []);

        steps.forEach((step: any, idx: number) => {
          const v1 = nv(step.value1);
          const v2 = nv(step.value2);
          const v3 = nv(step.value3);

          // Skip completely empty steps
          if (!v1 && !v2 && !v3) return;

          rows.push({
            ...base,
            StepName: step.name ?? null,
            StepOrder: idx + 1,
            Value1: v1,
            Unit1: v1 ? nv(step.unit ?? step.unit1 ?? step.tempUnit) : null,
            Value2: v2,
            Unit2: v2 ? nv(step.unit2) : null,
            Value3: v3,
            Unit3: v3 ? nv(step.unit3) : null,
            SolventChemical: nv(step.solventChemical),
            LogBookID: nv(step.logBookID),
            LimitType: category === "SYSTEM_SUITABILITY" ? nv(step.limitType) : null,
            Content: null,
          });
        });
      };

      if (p.preparations) {
        const preps: any[] = safeParse(p.preparations, []);
        preps.forEach((prep: any) => {
          const cat = prep.preparationCategory;
          if      (cat === "standard")           mapPrep(prep, "STANDARD");
          else if (cat === "sample")             mapPrep(prep, "SAMPLE");
          else if (cat === "dissolution_media")  mapPrep(prep, "DISSOLUTION_MEDIA");
          else if (cat === "mobile_phase")       mapPrep(prep, "MOBILE_PHASE");
          else if (cat === "diluent")            mapPrep(prep, "DILUENT");
          else if (cat === "buffer")             mapPrep(prep, "BUFFER");        // ← NEW
          else if (cat === "system_suitability") mapPrep(prep, "SYSTEM_SUITABILITY");
          else if (cat === "blank")              mapPrep(prep, "BLANK");
          // unknown categories are silently ignored
        });
      }
    });

    return rows;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CALCULATIONS
  // ════════════════════════════════════════════════════════════════════════════

  static mapCalculations(detail: WorksheetDetail): TblCalculationRow[] {
    const rows: TblCalculationRow[] = [];

    detail.parameters.forEach((p) => {
      p.calculations?.forEach((calc) => {

        // Support both pre-parsed objects and JSON strings
        const d = safeParse(calc.data, {}) as any;
        const calculationType = nv(calc.calculationType);
        const calcType = calculationType?.toLowerCase() ?? "";

        // ── DISSOLUTION PROFILE ─────────────────────────────────────────────
        if (calcType === "dissolution_profile") {
          interface NormSR  { sampleNumber: number; result: number|null; correctionFactor: number|null; resultAfterCorrection: number|null; }
          interface NormTP  { timePoint: number; timePointLabel: string; sampleResults: NormSR[]; min: number|null; avg: number|null; max: number|null; }

          const normalised: NormTP[] = [];

          if (d.calculationResults) {
            // FORMAT A: new calculationResults JSON array
            const parsed: any[] = safeParse(d.calculationResults, []);
            parsed.forEach((tp: any) => {
              normalised.push({
                timePoint:      Number(tp.timePoint),
                timePointLabel: tp.timePointLabel ?? `T${tp.timePoint}`,
                sampleResults:  (tp.sampleResults ?? []).map((sr: any) => ({
                  sampleNumber:          Number(sr.sampleNumber),
                  result:                sr.result               != null ? Number(sr.result)               : null,
                  correctionFactor:      sr.correctionFactor     != null ? Number(sr.correctionFactor)     : null,
                  resultAfterCorrection: sr.resultAfterCorrection != null ? Number(sr.resultAfterCorrection) : null,
                })),
                min: tp.min != null ? Number(tp.min) : null,
                avg: tp.avg != null ? Number(tp.avg) : null,
                max: tp.max != null ? Number(tp.max) : null,
              });
            });
          } else {
            // FORMAT B: old flat per-TP fields
            const nTP = Number(d.numberOfTimePoints) || 0;
            for (let tpNum = 1; tpNum <= nTP; tpNum++) {
              const results: number[] = safeParse(d[`sampleResultsT${tpNum}`], []);
              const cfs:     number[] = safeParse(d[`correctionFactorsT${tpNum}`], []);
              const racs:    number[] = safeParse(d[`resultsAfterCorrectionT${tpNum}`], []);
              if (!results.length) continue;
              normalised.push({
                timePoint:      tpNum,
                timePointLabel: nv(d[`timePointDetail${tpNum}`]) ?? `T${tpNum}`,
                sampleResults:  results.map((res, idx) => ({
                  sampleNumber:          idx + 1,
                  result:                res      != null ? Number(res)      : null,
                  correctionFactor:      cfs[idx] != null ? Number(cfs[idx]) : null,
                  resultAfterCorrection: racs[idx] != null ? Number(racs[idx]) : null,
                })),
                min: d[`minT${tpNum}`] != null ? Number(d[`minT${tpNum}`]) : null,
                avg: d[`avgT${tpNum}`] != null ? Number(d[`avgT${tpNum}`]) : null,
                max: d[`maxT${tpNum}`] != null ? Number(d[`maxT${tpNum}`]) : null,
              });
            }
          }

          // Nulls for columns not used by dissolution_profile
          const dpNulls: Partial<TblCalculationRow> = {
            AvgWeight: null, AvgWeightUnit: null,
            AvgContent: null, AvgContentUnit: null,
            SampleVol: null, SampleVolUnit: null,
            LabelClaim: null, LabelClaimUnit: null,
            LodWaterType: null, LodWaterValue: null,
            W1_EmptyDish: null, W2_DishWithSample: null, W3_DishAfterIgnition: null,
            W1_EmptyCrucible: null, W2_CrucibleWithSample: null, W3_CrucibleAfterAsh: null,
            LabelClaimPercentResult: null, LodWaterBasisResult: null,
            BuretteReading: null, BuretteReading1: null, BuretteReading2: null,
            BuretteReading3: null, BuretteReading4: null, BuretteReading5: null, BuretteReading6: null,
            TheoreticalMolarity: null, ActualMolarity: null, Factor: null, FactorUnit: null,
            DissoMediaVolume: null, SampleTaken: null, DryBasisResult: null,
          };

          const dpCommon = {
            WorksheetId: detail.sample.worksheetId,
            ParameterCode: p.paraCode,
            CalculationLabel: nv(calc.label),
            CalculationType: calculationType,
            AreaOfStandard: nv(d.areaOfStandard),
            Purity: nv(d.purity),
            MwSalt: nv(d.mWSalt),
            MwBase: nv(d.mWBase),
            Claim: nv(d.claim),
            ClaimUnit: nv(d.claimUnit),
            SelectedStandardPrepLabel: nv(d.selectedStandardPreparationLabel),
            SelectedSamplePrepLabel:   nv(d.selectedSamplePreparationLabel),
            Limit:    nv(d.acceptanceLimitMin),
            LimitMax: nv(d.acceptanceLimitMax),
          };

          normalised.forEach((tp) => {
            const tpNum         = tp.timePoint;
            const tpLabel       = tp.timePointLabel;
            const hasCorrection = tpNum > 1; // T1 never has correction factor

            // One row per sample
            tp.sampleResults.forEach((sr) => {
              rows.push({
                ...dpCommon, ...dpNulls,
                CalculationFor:        `TimePoint${tpNum}`,
                AreaOfSample:          nv(d[`areaOfSampleT${tpNum}S${sr.sampleNumber}`]),
                TimePointDetailInHr:   tpLabel,
                CalculationResult:     sr.result != null ? String(Number(sr.result).toFixed(4)) : null,
                CalculationResultUnit: "% of LC",
                CF:              hasCorrection && sr.correctionFactor     != null ? String(Number(sr.correctionFactor).toFixed(4))     : null,
                CorrectedResult: hasCorrection && sr.resultAfterCorrection != null ? String(Number(sr.resultAfterCorrection).toFixed(4)) : null,
                CorrectedResultUnit: hasCorrection ? "% of LC" : null,
              });
            });

            // One stats row per time point (avg | min in CF | max in CorrectedResult)
            if (tp.sampleResults.length > 0) {
              rows.push({
                ...dpCommon, ...dpNulls,
                CalculationFor:        `TimePoint${tpNum}_Stats`,
                AreaOfSample:          null,
                TimePointDetailInHr:   tpLabel,
                CalculationResult:     tp.avg != null ? String(Number(tp.avg).toFixed(4)) : null,
                CalculationResultUnit: "% of LC",
                CF:              tp.min != null ? String(Number(tp.min).toFixed(4)) : null,
                CorrectedResult: tp.max != null ? String(Number(tp.max).toFixed(4)) : null,
                CorrectedResultUnit: "% of LC",
              });
            }
          });

        // ── DISSOLUTION (per-tablet rows, 6 tablets) ───────────────────────
        } else if (calcType === "dissolution") {

          const nulls: Partial<TblCalculationRow> = {
            AvgWeight: null, AvgWeightUnit: null, AvgContent: null, AvgContentUnit: null,
            SampleVol: null, SampleVolUnit: null, LabelClaim: null, LabelClaimUnit: null,
            LodWaterType: null, LodWaterValue: null,
            W1_EmptyDish: null, W2_DishWithSample: null, W3_DishAfterIgnition: null,
            W1_EmptyCrucible: null, W2_CrucibleWithSample: null, W3_CrucibleAfterAsh: null,
            LabelClaimPercentResult: null, LodWaterBasisResult: null,
            TimePointDetailInHr: null, CF: null, CorrectedResult: null, CorrectedResultUnit: null,
            BuretteReading: null, BuretteReading1: null, BuretteReading2: null,
            BuretteReading3: null, BuretteReading4: null, BuretteReading5: null, BuretteReading6: null,
            TheoreticalMolarity: null, ActualMolarity: null, Factor: null, FactorUnit: null,
            DissoMediaVolume: null, SampleTaken: null, DryBasisResult: null,
          };

          [1,2,3,4,5,6].forEach((n) => {
            const areaValue = nv(d[`areaOfSample${n}`]);
            if (!areaValue) return;
            rows.push({
              ...nulls,
              WorksheetId: detail.sample.worksheetId,
              ParameterCode: p.paraCode,
              CalculationLabel: nv(calc.label),
              CalculationType: calculationType,
              AreaOfSample:   areaValue,
              CalculationFor: `Tablet${n}`,
              CalculationResult:     nv(d[`calculationResultTablet${n}`]),
              AreaOfStandard:        nv(d.areaOfStandard),
              Purity:                nv(d.purity),
              MwSalt:                nv(d.mWSalt),
              MwBase:                nv(d.mWBase),
              Claim:                 nv(d.claim),
              ClaimUnit:             null,
              CalculationResultUnit: nv(d.calculationResultUnit),
              SelectedStandardPrepLabel: nv(d.selectedStandardPreparationLabel),
              SelectedSamplePrepLabel:   nv(d.selectedSamplePreparationLabel),
              LimitMin:    nv(d.acceptanceLimitMin),
              LimitMax: nv(d.acceptanceLimitMax),
            });
          });

        // ── UNIFORMITY OF CONTENT (per-tablet rows, up to 10 tablets) ──────
        } else if (calcType === "uniformity_of_content") {

          const nulls: Partial<TblCalculationRow> = {
            AvgWeight: null, AvgWeightUnit: null, AvgContent: null, AvgContentUnit: null,
            SampleVol: null, SampleVolUnit: null, LabelClaim: null, LabelClaimUnit: null,
            LodWaterType: null, LodWaterValue: null,
            W1_EmptyDish: null, W2_DishWithSample: null, W3_DishAfterIgnition: null,
            W1_EmptyCrucible: null, W2_CrucibleWithSample: null, W3_CrucibleAfterAsh: null,
            LabelClaimPercentResult: null, LodWaterBasisResult: null,
            TimePointDetailInHr: null, CF: null, CorrectedResult: null, CorrectedResultUnit: null,
            Claim: null, ClaimUnit: null,
            BuretteReading: null, BuretteReading1: null, BuretteReading2: null,
            BuretteReading3: null, BuretteReading4: null, BuretteReading5: null, BuretteReading6: null,
            TheoreticalMolarity: null, ActualMolarity: null, Factor: null, FactorUnit: null,
            DissoMediaVolume: null, SampleTaken: null, DryBasisResult: null,
          };

          [1,2,3,4,5,6,7,8,9,10].forEach((n) => {
            const areaValue = nv(d[`areaOfSample${n}`]);
            if (!areaValue) return;
            rows.push({
              ...nulls,
              WorksheetId: detail.sample.worksheetId,
              ParameterCode: p.paraCode,
              CalculationLabel: nv(calc.label),
              CalculationType: calculationType,
              AreaOfSample:   areaValue,
              CalculationFor: `Tablet${n}`,
              CalculationResult:     nv(d[`calculationResultTablet${n}`]),
              AreaOfStandard:        nv(d.areaOfStandard),
              Purity:                nv(d.purity),
              MwSalt:                nv(d.mWSalt),
              MwBase:                nv(d.mWBase),
              CalculationResultUnit: nv(d.calculationResultUnit),
              SelectedStandardPrepLabel: nv(d.selectedStandardPrepLabel),
              SelectedSamplePrepLabel:   nv(d.selectedSamplePrepLabel),
              LimitMin:    nv(d.acceptanceLimitMin),
              LimitMax: nv(d.acceptanceLimitMax),
            });
          });

        // ── ASSAY FERROUS FUMARATE (titration, single row) ─────────────────
        } else if (calcType === "assay_ferrous_fumarate") {

          rows.push({
            WorksheetId: detail.sample.worksheetId,
            ParameterCode: p.paraCode,
            CalculationLabel: nv(calc.label),
            CalculationType: calculationType,
            CalculationFor: nv(d.calculationFor),

            SelectedSamplePrepLabel:   nv(d.selectedSamplePreparationLabel),
            SelectedStandardPrepLabel: null,

            BuretteReading:    nv(d.buretteReading),
            TheoreticalMolarity: nv(d.theoreticalMolarity),
            ActualMolarity:    nv(d.actualMolarity),
            Factor:            nv(d.factor),
            FactorUnit:        nv(d.factorUnit),
            AvgWeight:         nv(d.avgWeight),
            AvgWeightUnit:     nv(d.avgWeightUnit),
            LabelClaim:        nv(d.labelClaim),
            LabelClaimUnit:    nv(d.labelClaimUnit),
            LodWaterType:      nv(d.lodWaterType),
            LodWaterValue:     nv(d.lodWaterValue),
            CalculationResult:       nv(d.calculationResult),
            CalculationResultUnit:   nv(d.calculationResultUnit),
            LabelClaimPercentResult: nv(d.labelClaimPercent),
            DryBasisResult:          nv(d.dryBasisResult),
            LodWaterBasisResult:     nv(d.dryBasisResult), // same value, dual-stored for reporting
            LimitMin:    nv(d.acceptanceLimitMin),
            LimitMax: nv(d.acceptanceLimitMax),

            // Unused
            AreaOfSample: null, AreaOfStandard: null,
            Purity: null, MwSalt: null, MwBase: null,
            SampleVol: null, SampleVolUnit: null,
            AvgContent: null, AvgContentUnit: null,
            Claim: null, ClaimUnit: null,
            W1_EmptyDish: null, W2_DishWithSample: null, W3_DishAfterIgnition: null,
            W1_EmptyCrucible: null, W2_CrucibleWithSample: null, W3_CrucibleAfterAsh: null,
            TimePointDetailInHr: null, CF: null, CorrectedResult: null, CorrectedResultUnit: null,
            BuretteReading1: null, BuretteReading2: null, BuretteReading3: null,
            BuretteReading4: null, BuretteReading5: null, BuretteReading6: null,
            DissoMediaVolume: null, SampleTaken: null,
          });

        // ── DISSOLUTION FERROUS FUMARATE (per-tablet burette rows + summary) ─
        } else if (calcType === "dissolution_ferrous_fumarate") {

          const shared = {
            WorksheetId: detail.sample.worksheetId,
            ParameterCode: p.paraCode,
            CalculationLabel: nv(calc.label),
            CalculationType: calculationType,
            SelectedSamplePrepLabel:   nv(d.selectedSamplePreparationLabel),
            SelectedStandardPrepLabel: null,
            TheoreticalMolarity: nv(d.theoreticalMolarity),
            ActualMolarity:      nv(d.actualMolarity),
            Factor:              nv(d.factor),
            FactorUnit:          nv(d.factorUnit),
            DissoMediaVolume:    nv(d.dissoMediaVolume),
            LabelClaim:          nv(d.labelClaim),
            SampleTaken:         nv(d.sampleTaken),
            CalculationResultUnit: nv(d.calculationResultUnit),
            Limit:    nv(d.acceptanceLimitMin),
            LimitMax: nv(d.acceptanceLimitMax),
            // Unused
            AreaOfSample: null, AreaOfStandard: null,
            Purity: null, MwSalt: null, MwBase: null,
            AvgWeight: null, AvgWeightUnit: null,
            AvgContent: null, AvgContentUnit: null,
            SampleVol: null, SampleVolUnit: null,
            LabelClaimUnit: null, LodWaterType: null, LodWaterValue: null,
            W1_EmptyDish: null, W2_DishWithSample: null, W3_DishAfterIgnition: null,
            W1_EmptyCrucible: null, W2_CrucibleWithSample: null, W3_CrucibleAfterAsh: null,
            LabelClaimPercentResult: null, LodWaterBasisResult: null, DryBasisResult: null,
            TimePointDetailInHr: null, CF: null, CorrectedResult: null, CorrectedResultUnit: null,
            Claim: null, ClaimUnit: null, BuretteReading: null,
          };

          // One row per tablet that has a burette reading
          [1,2,3,4,5,6].forEach((n) => {
            const bv = nv(d[`buretteReading${n}`]);
            if (!bv) return;
            rows.push({
              ...shared,
              CalculationFor: `Tablet${n}`,
              CalculationResult: nv(d[`calculationResultTablet${n}`]),
              BuretteReading1: n === 1 ? bv : null,
              BuretteReading2: n === 2 ? bv : null,
              BuretteReading3: n === 3 ? bv : null,
              BuretteReading4: n === 4 ? bv : null,
              BuretteReading5: n === 5 ? bv : null,
              BuretteReading6: n === 6 ? bv : null,
            });
          });

          // Summary row with the overall average result
          const overallResult = nv(d.calculationResult);
          if (overallResult) {
            rows.push({
              ...shared,
              CalculationFor: "Summary",
              CalculationResult: overallResult,
              BuretteReading1: null, BuretteReading2: null, BuretteReading3: null,
              BuretteReading4: null, BuretteReading5: null, BuretteReading6: null,
            });
          }

        // ── ALL OTHER CALCULATIONS (assay, lod, roi, sulphated_ash, residual_solvent, related_substance) ──
        } else {
          rows.push({
            WorksheetId: detail.sample.worksheetId,
            ParameterCode: p.paraCode,
            CalculationLabel: nv(calc.label),
            CalculationType: calculationType,
            CalculationFor: nv(d.calculationFor),

            AreaOfSample:  nv(d.areaOfSample),
            AreaOfStandard: nv(d.areaOfStandard),
            Purity:        nv(d.purity),

            AvgWeight:     nv(d.avgWeight),
            AvgWeightUnit: nv(d.avgWeight) ? nv(d.avgWeightUnit) : null,
            AvgContent:    nv(d.avgContent),
            AvgContentUnit: nv(d.avgContent) ? nv(d.avgContentUnit) : null,
            SampleVol:     nv(d.sampleVol),
            SampleVolUnit: nv(d.sampleVol) ? nv(d.sampleVolUnit) : null,
            Claim:         nv(d.claim),
            ClaimUnit:     nv(d.claim) ? nv(d.claimUnit) : null,

            // Field names differ between calc types — try both casings
            MwSalt: nv(d.mwSalt ?? d.mWSalt),
            MwBase: nv(d.mwBase ?? d.mWBase),

            LabelClaim:     nv(d.labelClaim),
            LabelClaimUnit: nv(d.labelClaim) ? nv(d.labelClaimUnit) : null,

            // Field names differ between calc types — try both casings
            LodWaterType:  nv(d.lodWaterType  ?? d.lodwaterType),
            LodWaterValue: nv(d.lodWaterValue ?? d.lodwaterValue),

            W1_EmptyDish:         nv(d.w1_emptyDish),
            W2_DishWithSample:    nv(d.w2_dishWithSample),
            W3_DishAfterIgnition: nv(d.w3_dishAfterIgnition),

            W1_EmptyCrucible:      nv(d.w1_emptyCrucible),
            W2_CrucibleWithSample: nv(d.w2_crucibleWithSample),
            W3_CrucibleAfterAsh:   nv(d.w3_crucibleAfterAsh),

            CalculationResult:       nv(d.calculationResult),
            CalculationResultUnit:   nv(d.calculationResultUnit),
            LabelClaimPercentResult: nv(d.labelClaimPercent),
            LodWaterBasisResult:     nv(d.lodWaterBasisResult),

            SelectedStandardPrepLabel: nv(d.selectedStandardPrepLabel ?? d.selectedStandardPreparationLabel),
            SelectedSamplePrepLabel:   nv(d.selectedSamplePrepLabel   ?? d.selectedSamplePreparationLabel),

            LimitMin:    nv(d.acceptanceLimitMin),
            LimitMax: nv(d.acceptanceLimitMax),

            // Ferrous fumarate fields not used here
            BuretteReading: null, BuretteReading1: null, BuretteReading2: null,
            BuretteReading3: null, BuretteReading4: null, BuretteReading5: null, BuretteReading6: null,
            TheoreticalMolarity: null, ActualMolarity: null, Factor: null, FactorUnit: null,
            DissoMediaVolume: null, SampleTaken: null, DryBasisResult: null,
            TimePointDetailInHr: null, CF: null, CorrectedResult: null, CorrectedResultUnit: null,
          });
        }
      });
    });

    return rows;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // FILES
  // ════════════════════════════════════════════════════════════════════════════

  static mapFiles(detail: WorksheetDetail): TblFileRow[] {
    const rows: TblFileRow[] = [];
    const worksheetId = detail.sample.worksheetId;

    detail.parameters.forEach((p) => {
      (p.files ?? []).forEach((f: any) => {
        // Treat null / undefined / empty-string all as "no value"
        const hasType  = f.preparationType != null && f.preparationType !== "";
        const hasLabel = f.label           != null && f.label           !== "";

        rows.push({
          WorksheetId:     worksheetId,
          ParameterCode:   p.paraCode,
          PreparationType: hasType  ? String(f.preparationType) : null,
          PrepLabel:       hasLabel ? String(f.label)           : null,
          FileName:        f.fileName,
          FileDataBase64:  f.fileDataBase64 ?? null,
        });
      });
    });

    return rows;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // MAP ALL
  // ════════════════════════════════════════════════════════════════════════════

  static mapAll(detail: WorksheetDetail): WorksheetDbPayload {
    return {
      worksheet:    this.mapWorksheet(detail),
      parameters:   this.mapParameters(detail),
      references:   this.mapReferences(detail),
      preparations: this.mapPreparations(detail),
      calculations: this.mapCalculations(detail),
      files:        this.mapFiles(detail),        // ← NEW
    };
  }
}