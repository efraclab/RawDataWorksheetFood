import type { WorksheetDetail } from "../models/WorksheetDetail";

export interface WorksheetAllDataRow {
  WorksheetId: string;
  RegistrationNo: string;
  SampleName: string;
  NumberOfParameters: number;
  DueDate: string;

  WorksheetPreparedBy: string;
  WorksheetStatus: string;
  WorksheetCreatedAt: string;
  WorksheetUpdatedAt: string;
  WorksheetApprovedAt?: string;

  ParameterId: number;
  ParaCode: string;
  ParameterName: string;
  MethodCode: string;
  MethodName: string;

  ColumnId: string;
  DiluentPreparation: string;
  OtherInfo: string;

  ParameterAnalyzedBy: string;
  ParameterApprovedBy: string;
  ParameterStatus: string;
  ParameterApprovedAt?: string;

  ReferenceType?: 'INSTRUMENT' | 'CHEMICAL' | 'STANDARD';
  ReferenceCode?: string;

  PrepCategory?: 'STANDARD' | 'SAMPLE';
  PrepLabel?: string;
  PreparationType?: string;
  AssignedStandardId?: string;

  StepName?: string;
  StepOrder?: number;
  Value1?: string;
  Unit1?: string;
  Value2?: string;
  Unit2?: string;
  Value3?: string;
  Unit3?: string;

  CalculationLabel?: string;
  CalculationType?: string;

  AreaOfSample?: string;
  AreaOfStandard?: string;

  Purity?: string;
  AvgWeight?: string;
  Claim?: string;
  ClaimUnit?: string;

  SelectedStandardPrepLabel?: string;
  SelectedSamplePrepLabel?: string;

  AvgWt?: string;
  MwSalt?: string;
  MwBase?: string;
  LabelClaim?: string;

  LodType?: string;
  LodValue?: string;

  W1_EmptyDish?: string;
  W2_DishWithSample?: string;
  W3_DishAfterIgnition?: string;

  W1_EmptyCrucible?: string;
  W2_CrucibleWithSample?: string;
  W3_CrucibleAfterAsh?: string;
}

export class WorksheetMapper {

  public static mapWorksheetDetailToTableRows(
    worksheetDetail: WorksheetDetail
  ): WorksheetAllDataRow[] {

    const rows: WorksheetAllDataRow[] = [];
    const s = worksheetDetail.sample;

    worksheetDetail.parameters.forEach((p) => {

      const base: WorksheetAllDataRow = {
        WorksheetId: s.worksheetId,
        RegistrationNo: s.registrationNo,
        SampleName: s.sampleName,
        NumberOfParameters: s.numberOfParameters,
        DueDate: s.dueDate,

        WorksheetPreparedBy: s.preparedBy,
        WorksheetStatus: s.status,
        WorksheetCreatedAt: s.createdAt,
        WorksheetUpdatedAt: s.updatedAt!,
        WorksheetApprovedAt: s.approvedAt!,

        ParameterId: p.id,
        ParaCode: p.paraCode,
        ParameterName: p.parameterName,
        MethodCode: p.methodCode,
        MethodName: p.methodName,

        ColumnId: p.columnId ?? '',
        DiluentPreparation: p.diluentPreparation ?? '',
        OtherInfo: p.otherInfo ?? '',

        ParameterAnalyzedBy: p.analyzedBy ?? '',
        ParameterApprovedBy: p.approvedBy ?? '',
        ParameterStatus: p.status!,
        ParameterApprovedAt: p.approvedAt
      };

      const beforeCount = rows.length;

      /* ===== REFERENCES ===== */
      p.instrumentIds?.forEach(id =>
        rows.push({ ...base, ReferenceType: 'INSTRUMENT', ReferenceCode: id.trim() })
      );

      p.chemicalIds?.forEach(id =>
        rows.push({ ...base, ReferenceType: 'CHEMICAL', ReferenceCode: id.trim() })
      );

      p.standardIds?.forEach(id =>
        rows.push({ ...base, ReferenceType: 'STANDARD', ReferenceCode: id })
      );

      /* ===== STANDARD PREPARATIONS ===== */
      p.standardPreparations?.forEach(prep => {
        const steps = JSON.parse(prep.steps || '[]');
        steps.forEach((step: any, idx: number) => {
          rows.push({
            ...base,
            PrepCategory: 'STANDARD',
            PrepLabel: prep.label,
            PreparationType: prep.preparationType,
            AssignedStandardId: prep.assignedStandardId!,
            StepName: step.name,
            StepOrder: idx + 1,
            Value1: step.value ?? step.vol1 ?? '',
            Unit1: step.unit ?? step.unit1 ?? '',
            Value2: step.vol2 ?? '',
            Unit2: step.unit2 ?? '',
            Value3: step.temp ?? '',
            Unit3: step.tempUnit ?? ''
          });
        });
      });

      /* ===== SAMPLE PREPARATIONS ===== */
      p.samplePreparations?.forEach(prep => {
        const steps = JSON.parse(prep.steps || '[]');
        steps.forEach((step: any, idx: number) => {
          rows.push({
            ...base,
            PrepCategory: 'SAMPLE',
            PrepLabel: prep.label,
            PreparationType: prep.preparationType,
            AssignedStandardId: prep.assignedStandardId || '',
            StepName: step.name,
            StepOrder: idx + 1,
            Value1: step.value ?? step.vol1 ?? step.temp ?? '',
            Unit1: step.unit ?? step.unit1 ?? step.tempUnit ?? '',
            Value2: step.vol2 ?? step.time ?? '',
            Unit2: step.unit2 ?? step.timeUnit ?? ''
          });
        });
      });

      /* ===== CALCULATIONS (FULL COVERAGE) ===== */
      p.calculations?.forEach(calc => {
        const d = JSON.parse(calc.data || '{}');

        rows.push({
          ...base,
          CalculationLabel: calc.label,
          CalculationType: calc.calculationType,

          AreaOfSample: d.areaOfSample ?? '',
          AreaOfStandard: d.areaOfStandard ?? '',

          V1: d.v1 ?? '', V2: d.v2 ?? '', V3: d.v3 ?? '', V4: d.v4 ?? '',
          V5: d.v5 ?? '', V6: d.v6 ?? '', V7: d.v7 ?? '', V8: d.v8 ?? '',
          V9: d.v9 ?? '', V10: d.v10 ?? '', V11: d.v11 ?? '', V12: d.v12 ?? '',
          V13: d.v13 ?? '', V14: d.v14 ?? '',

          SW1: d.sw1 ?? '',
          SW2: d.sw2 ?? '',

          Purity: d.purity ?? '',
          AvgWeight: d.avgWt ?? '',
          Claim: d.claim ?? '',

          BaseXPurity: d.baseXPurity ?? '',
          AvgWt: d.avgWt ?? '',
          MwSalt: d.mwSalt ?? '',
          MwBase: d.mwBase ?? '',
          ClaimVolume: d.claimVolume ?? '',
          LabelClaim: d.labelClaim ?? '',

          LodType: d.lodType ?? '',
          LodValue: d.lodValue ?? '',

          W1_EmptyDish: d.w1_emptyDish ?? '',
          W2_DishWithSample: d.w2_dishWithSample ?? '',
          W3_DishAfterIgnition: d.w3_dishAfterIgnition ?? '',

          W1_EmptyCrucible: d.w1_emptyCrucible ?? '',
          W2_CrucibleWithSample: d.w2_crucibleWithSample ?? '',
          W3_CrucibleAfterAsh: d.w3_crucibleAfterAsh ?? '',

          SelectedStandardPrepLabel: d.selectedStandardPreparationLabel ?? '',
          SelectedSamplePrepLabel: d.selectedSamplePreparationLabel ?? ''
        });
      });

      /* ===== FALLBACK (PARAMETER EXISTS) ===== */
      if (rows.length === beforeCount) {
        rows.push(base);
      }
    });

    return rows;
  }
}
