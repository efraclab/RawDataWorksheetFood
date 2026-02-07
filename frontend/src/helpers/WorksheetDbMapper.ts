import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { TblCalculationRow } from "./TblCalculationRow";
import type { TblParameterRow } from "./TblParameterRow";
import type { TblPreparationRow } from "./TblPreparationRow";
import type { TblReferenceRow } from "./TblReferenceRow";
import type { TblWorksheetRow } from "./TblWorksheetRow";
import type { WorksheetDbPayload } from "./WorksheetDbPayload";

const nv = (v: any): string | null =>
  v === undefined || v === null || String(v).trim() === "" ? null : String(v);

export class WorksheetDbMapper {
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
    };
  }

  static mapParameters(detail: WorksheetDetail): TblParameterRow[] {
    return detail.parameters.map((p) => ({
      WorksheetId: detail.sample.worksheetId,
      ParameterCode: p.paraCode,
      ParameterName: p.parameterName,
      MethodCode: p.methodCode,
      MethodName: p.methodName,
      ColumnId: nv(p.columnId),
      DiluentPreparation: nv(p.diluentPreparation),
      OtherInfo: nv(p.otherInfo),
      ParameterAnalyzedBy: nv(p.analyzedBy),
      ParameterApprovedBy: nv(p.approvedBy),
      ParameterStatus: p.status!,
      ParameterApprovedAt: nv(p.approvedAt),
      AnalysisStartedAt: nv(p.analysisStartDate),
      AnalysisCompletedAt: nv(p.analysisCompletionDate)
    }));
  }

  static mapReferences(detail: WorksheetDetail): TblReferenceRow[] {
    const rows: TblReferenceRow[] = [];
    const worksheetId = detail.sample.worksheetId;

    detail.parameters.forEach((p) => {
      p.instrumentIds?.forEach(
        (id) =>
          nv(id) &&
          rows.push({
            WorksheetId: worksheetId,
            ParameterCode: p.paraCode,
            ReferenceType: "INSTRUMENT",
            ReferenceCode: id.trim(),
          })
      );

      p.chemicalIds?.forEach(
        (id) =>
          nv(id) &&
          rows.push({
            WorksheetId: worksheetId,
            ParameterCode: p.paraCode,
            ReferenceType: "CHEMICAL",
            ReferenceCode: id.trim(),
          })
      );

      p.standardIds?.forEach(
        (id) =>
          nv(id) &&
          rows.push({
            WorksheetId: worksheetId,
            ParameterCode: p.paraCode,
            ReferenceType: "STANDARD",
            ReferenceCode: id.trim(),
          })
      );
    });

    return rows;
  }

  static mapPreparations(detail: WorksheetDetail): TblPreparationRow[] {
    const rows: TblPreparationRow[] = [];

    detail.parameters.forEach((p) => {
      const mapPrep = (prep: any, category: "STANDARD" | "SAMPLE" | "MOBILE_PHASE" | "DISSOLUTION_MEDIA" | "SYSTEM_SUITABILITY") => {
        const steps = JSON.parse(prep.steps || "[]");

        steps.forEach((step: any, idx: number) => {
          const v1 = nv(step.value1);
          const v2 = nv(step.value2);
          const v3 = nv(step.value3);

          if (!v1 && !v2 && !v3) return;

          rows.push({
            WorksheetId: detail.sample.worksheetId,
            ParameterCode: p.paraCode,
            PrepCategory: category,
            PrepLabel: prep.label,
            PreparationType: prep.preparationType,
            AssignedStandardId: nv(prep.assignedStandardId),
            StepName: step.name,
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
          });
        });
      };

      if (p.preparations) {
        const preps = typeof p.preparations === 'string' 
          ? JSON.parse(p.preparations || "[]") 
          : p.preparations;
          
        preps.forEach((prep: any) => {
          const category = prep.preparationCategory;
          if (category === "mobile_phase") {
            mapPrep(prep, "MOBILE_PHASE");
          } else if (category === "dissolution_media") {
            mapPrep(prep, "DISSOLUTION_MEDIA");
          } else if (category === "standard") {
            mapPrep(prep, "STANDARD");
          } else if (category === "sample") {
            mapPrep(prep, "SAMPLE");
          } else if (category === "system_suitability") {
            mapPrep(prep, "SYSTEM_SUITABILITY");
          }
        });
      }
    });

    return rows;
  }

  static mapCalculations(detail: WorksheetDetail): TblCalculationRow[] {
    const rows: TblCalculationRow[] = [];

    detail.parameters.forEach((p) => {
      p.calculations?.forEach((calc) => {
        const d = JSON.parse(calc.data || "{}");
        const calculationType = nv(calc.calculationType);

        const isDissolution = calculationType?.toLowerCase() === "dissolution";
        const isUniformityOfContent = calculationType?.toLowerCase() === "uniformity_of_content";

        if (isDissolution) {
          
          const tabletData = [
            {
              num: 1,
              area: d.areaOfSample1,
              result: d.calculationResultTablet1,
            },
            {
              num: 2,
              area: d.areaOfSample2,
              result: d.calculationResultTablet2,
            },
            {
              num: 3,
              area: d.areaOfSample3,
              result: d.calculationResultTablet3,
            },
            {
              num: 4,
              area: d.areaOfSample4,
              result: d.calculationResultTablet4,
            },
            {
              num: 5,
              area: d.areaOfSample5,
              result: d.calculationResultTablet5,
            },
            {
              num: 6,
              area: d.areaOfSample6,
              result: d.calculationResultTablet6,
            },
          ];

          tabletData.forEach((tablet) => {
            // Only create a row if there's an area value (tablet was used)
            const areaValue = nv(tablet.area);
            if (areaValue) {
              rows.push({
                WorksheetId: detail.sample.worksheetId,
                ParameterCode: p.paraCode,
                CalculationLabel: nv(calc.label),
                CalculationType: calculationType,

                // Tablet-specific values
                AreaOfSample: areaValue,
                CalculationFor: `Tablet${tablet.num}`,
                CalculationResult: nv(tablet.result),

                // Common values for all tablets
                AreaOfStandard: nv(d.areaOfStandard),
                Purity: nv(d.purity),
                MwSalt: nv(d.mwSalt),
                MwBase: nv(d.mwBase),
                CalculationResultUnit: nv(d.calculationResultUnit),
                SelectedStandardPrepLabel: nv(d.selectedStandardPrepLabel),
                SelectedSamplePrepLabel: nv(d.selectedSamplePrepLabel),

                // Set other fields to null for dissolution
                AvgWeight: null,
                AvgWeightUnit: null,
                AvgContent: null,
                AvgContentUnit: null,
                SampleVol: null,
                SampleVolUnit: null,
                Claim: null,
                ClaimUnit: null,
                LabelClaim: null,
                LabelClaimUnit: null,
                LodWaterType: null,
                LodWaterValue: null,
                W1_EmptyDish: null,
                W2_DishWithSample: null,
                W3_DishAfterIgnition: null,
                W1_EmptyCrucible: null,
                W2_CrucibleWithSample: null,
                W3_CrucibleAfterAsh: null,
                LabelClaimPercentResult: null,
                LodWaterBasisResult: null,
              });
            }
          });
        } else if (isUniformityOfContent) {
          
          const tabletData = [
            {
              num: 1,
              area: d.areaOfSample1,
              result: d.calculationResultTablet1,
            },
            {
              num: 2,
              area: d.areaOfSample2,
              result: d.calculationResultTablet2,
            },
            {
              num: 3,
              area: d.areaOfSample3,
              result: d.calculationResultTablet3,
            },
            {
              num: 4,
              area: d.areaOfSample4,
              result: d.calculationResultTablet4,
            },
            {
              num: 5,
              area: d.areaOfSample5,
              result: d.calculationResultTablet5,
            },
            {
              num: 6,
              area: d.areaOfSample6,
              result: d.calculationResultTablet6,
            },
            {
              num: 7,
              area: d.areaOfSample7,
              result: d.calculationResultTablet7,
            },
            {
              num: 8,
              area: d.areaOfSample8,
              result: d.calculationResultTablet8,
            },
            {
              num: 9,
              area: d.areaOfSample9,
              result: d.calculationResultTablet9,
            },
            {
              num: 10,
              area: d.areaOfSample10,
              result: d.calculationResultTablet10,
            },
          ];

          tabletData.forEach((tablet) => {
            // Only create a row if there's an area value (tablet was used)
            const areaValue = nv(tablet.area);
            if (areaValue) {
              rows.push({
                WorksheetId: detail.sample.worksheetId,
                ParameterCode: p.paraCode,
                CalculationLabel: nv(calc.label),
                CalculationType: calculationType,

                // Tablet-specific values
                AreaOfSample: areaValue,
                CalculationFor: `Tablet${tablet.num}`,
                CalculationResult: nv(tablet.result),

                // Common values for all tablets
                AreaOfStandard: nv(d.areaOfStandard),
                Purity: nv(d.purity),
                MwSalt: nv(d.mwSalt),
                MwBase: nv(d.mwBase),
                CalculationResultUnit: nv(d.calculationResultUnit),
                SelectedStandardPrepLabel: nv(d.selectedStandardPrepLabel),
                SelectedSamplePrepLabel: nv(d.selectedSamplePrepLabel),

                // Set other fields to null for UC
                AvgWeight: null,
                AvgWeightUnit: null,
                AvgContent: null,
                AvgContentUnit: null,
                SampleVol: null,
                SampleVolUnit: null,
                Claim: null,
                ClaimUnit: null,
                LabelClaim: null,
                LabelClaimUnit: null,
                LodWaterType: null,
                LodWaterValue: null,
                W1_EmptyDish: null,
                W2_DishWithSample: null,
                W3_DishAfterIgnition: null,
                W1_EmptyCrucible: null,
                W2_CrucibleWithSample: null,
                W3_CrucibleAfterAsh: null,
                LabelClaimPercentResult: null,
                LodWaterBasisResult: null,
              });
            }
          });
        } else {
          // For non-dissolution and non-UC calculations, use the original logic
          let resultValue = nv(d.calculationResult);
          let resultUnit = nv(d.calculationResultUnit);

          rows.push({
            WorksheetId: detail.sample.worksheetId,
            ParameterCode: p.paraCode,
            CalculationLabel: nv(calc.label),
            CalculationType: calculationType,

            AreaOfSample: nv(d.areaOfSample),
            AreaOfStandard: nv(d.areaOfStandard),

            CalculationFor: nv(d.calculationFor),
            Purity: nv(d.purity),
            AvgWeight: nv(d.avgWeight),
            AvgWeightUnit: nv(d.avgWeight) ? nv(d.avgWeightUnit) : null,
            AvgContent: nv(d.avgContent),
            AvgContentUnit: nv(d.avgContent) ? nv(d.avgContentUnit) : null,
            SampleVol: nv(d.sampleVol),
            SampleVolUnit: nv(d.sampleVol) ? nv(d.sampleVolUnit) : null,
            Claim: nv(d.claim),
            ClaimUnit: nv(d.claim) ? nv(d.claimUnit) : null,

            MwSalt: nv(d.mwSalt),
            MwBase: nv(d.mwBase),
            LabelClaim: nv(d.labelClaim),
            LabelClaimUnit: nv(d.labelClaim) ? nv(d.labelClaimUnit) : null,

            LodWaterType: nv(d.lodwaterType),
            LodWaterValue: nv(d.lodwaterValue),

            W1_EmptyDish: nv(d.w1_emptyDish),
            W2_DishWithSample: nv(d.w2_dishWithSample),
            W3_DishAfterIgnition: nv(d.w3_dishAfterIgnition),

            W1_EmptyCrucible: nv(d.w1_emptyCrucible),
            W2_CrucibleWithSample: nv(d.w2_crucibleWithSample),
            W3_CrucibleAfterAsh: nv(d.w3_crucibleAfterAsh),

            CalculationResult: resultValue,
            CalculationResultUnit: resultUnit,
            LabelClaimPercentResult: nv(d.labelClaimPercent),
            LodWaterBasisResult: nv(d.lodWaterBasisResult),

            SelectedStandardPrepLabel: nv(d.selectedStandardPrepLabel),
            SelectedSamplePrepLabel: nv(d.selectedSamplePrepLabel),
          });
        }
      });
    });

    return rows;
  }

  static mapAll(detail: WorksheetDetail): WorksheetDbPayload {
    return {
      worksheet: this.mapWorksheet(detail),
      parameters: this.mapParameters(detail),
      references: this.mapReferences(detail),
      preparations: this.mapPreparations(detail),
      calculations: this.mapCalculations(detail),
    };
  }
}