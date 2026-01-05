import type { ParameterDetail } from "../models/ParameterDetail";
import type { WorksheetDetail } from "../models/WorksheetDetail";


// Output row format matching SQL table
interface WorksheetTableRow {
  // WORKSHEET fields
  WorksheetId: string;
  RegistrationNo: string;
  SampleName: string;
  NumberOfParameters: number;
  DueDate: string;
  WorksheetPreparedBy: string;
  WorksheetStatus: string;
  WorksheetCreatedAt: string;
  WorksheetUpdatedAt: string;
  WorksheetApprovedAt: string | null;
  
  // PARAMETER fields
  ParameterId: number | null;
  ParaCode: string | null;
  ParameterName: string | null;
  MethodCode: string | null;
  MethodName: string | null;
  ColumnId: string | null;
  DiluentPreparation: string | null;
  OtherInfo: string | null;
  ParameterAnalyzedBy: string | null;
  ParameterApprovedBy: string | null;
  ParameterStatus: string | null;
  ParameterApprovedAt: string | null;
  
  // REFERENCES fields
  ReferenceType: string | null; // INSTRUMENT | CHEMICAL | STANDARD
  ReferenceCode: string | null;
  
  // PREPARATION fields
  PrepCategory: string | null; // STANDARD | SAMPLE
  PrepLabel: string | null;
  PreparationType: string | null;
  AssignedStandardId: string | null;
  
  // STEP fields
  StepName: string | null;
  StepOrder: number | null;
  
  // STEP VALUES
  Value1: string | null;
  Unit1: string | null;
  Value2: string | null;
  Unit2: string | null;
  Value3: string | null;
  Unit3: string | null;
  
  // CALCULATION fields
  CalculationLabel: string | null;
  CalculationType: string | null;
  AreaOfSample: string | null;
  AreaOfStandard: string | null;
  V1: string | null;
  V2: string | null;
  V3: string | null;
  V4: string | null;
  V5: string | null;
  V6: string | null;
  V7: string | null;
  V8: string | null;
  V9: string | null;
  V10: string | null;
  V11: string | null;
  V12: string | null;
  V13: string | null;
  V14: string | null;
  SW1: string | null;
  SW2: string | null;
  Purity: string | null;
  AvgWeight: string | null;
  Claim: string | null;
  SelectedStandardPrepLabel: string | null;
  SelectedSamplePrepLabel: string | null;
}

export class WorksheetDataTransformer {
  /**
   * Main transformation method
   * Converts worksheet response to flat table rows
   */
  public static transformToTableRows(response: WorksheetDetail): WorksheetTableRow[] {
    const rows: WorksheetTableRow[] = [];
    const { sample, parameters } = response;

    // Process each parameter
    for (const param of parameters) {
      // 1. Create rows for REFERENCES (Instruments, Chemicals, Standards)
      rows.push(...this.createReferenceRows(sample, param));

      // 2. Create rows for PREPARATIONS (Standard & Sample with Steps)
      rows.push(...this.createPreparationRows(sample, param));

      // 3. Create rows for CALCULATIONS
      rows.push(...this.createCalculationRows(sample, param));
    }

    // If no detailed rows were created, add at least one base row per parameter
    if (rows.length === 0 && parameters.length > 0) {
      for (const param of parameters) {
        rows.push(this.createBaseRow(sample, param));
      }
    }

    return rows;
  }

  /**
   * Creates base row with worksheet and parameter info
   */
  private static createBaseRow(
    sample: WorksheetDetail['sample'],
    param: ParameterDetail,
    overrides: Partial<WorksheetTableRow> = {}
  ): WorksheetTableRow {
    return {
      // Worksheet fields
      WorksheetId: sample.worksheetId,
      RegistrationNo: sample.registrationNo,
      SampleName: sample.sampleName,
      NumberOfParameters: sample.numberOfParameters,
      DueDate: sample.dueDate,
      WorksheetPreparedBy: sample.preparedBy,
      WorksheetStatus: sample.status,
      WorksheetCreatedAt: sample.createdAt,
      WorksheetUpdatedAt: sample.updatedAt!,
      WorksheetApprovedAt: sample.approvedAt! || null,
      
      // Parameter fields
      ParameterId: param.id,
      ParaCode: param.paraCode,
      ParameterName: param.parameterName,
      MethodCode: param.methodCode,
      MethodName: param.methodName,
      ColumnId: param.columnId || null,
      DiluentPreparation: param.diluentPreparation || null,
      OtherInfo: param.otherInfo || null,
      ParameterAnalyzedBy: param.analyzedBy || null,
      ParameterApprovedBy: param.approvedBy || null,
      ParameterStatus: param.status || null,
      ParameterApprovedAt: param.approvedAt || null,
      
      // References (null for base row)
      ReferenceType: null,
      ReferenceCode: null,
      
      // Preparation (null for base row)
      PrepCategory: null,
      PrepLabel: null,
      PreparationType: null,
      AssignedStandardId: null,
      
      // Step (null for base row)
      StepName: null,
      StepOrder: null,
      
      // Step Values (null for base row)
      Value1: null,
      Unit1: null,
      Value2: null,
      Unit2: null,
      Value3: null,
      Unit3: null,
      
      // Calculation (null for base row)
      CalculationLabel: null,
      CalculationType: null,
      AreaOfSample: null,
      AreaOfStandard: null,
      V1: null,
      V2: null,
      V3: null,
      V4: null,
      V5: null,
      V6: null,
      V7: null,
      V8: null,
      V9: null,
      V10: null,
      V11: null,
      V12: null,
      V13: null,
      V14: null,
      SW1: null,
      SW2: null,
      Purity: null,
      AvgWeight: null,
      Claim: null,
      SelectedStandardPrepLabel: null,
      SelectedSamplePrepLabel: null,
      
      // Apply any overrides
      ...overrides
    };
  }

  /**
   * Creates rows for references (Instruments, Chemicals, Standards)
   */
  private static createReferenceRows(
    sample: WorksheetDetail['sample'],
    param: ParameterDetail
  ): WorksheetTableRow[] {
    const rows: WorksheetTableRow[] = [];

    // Instruments
    if (param.instrumentIds && param.instrumentIds.length > 0) {
      for (const instId of param.instrumentIds) {
        rows.push(this.createBaseRow(sample, param, {
          ReferenceType: 'INSTRUMENT',
          ReferenceCode: instId.trim()
        }));
      }
    }

    // Chemicals
    if (param.chemicalIds && param.chemicalIds.length > 0) {
      for (const chemId of param.chemicalIds) {
        rows.push(this.createBaseRow(sample, param, {
          ReferenceType: 'CHEMICAL',
          ReferenceCode: chemId.trim()
        }));
      }
    }

    // Standards
    if (param.standardIds && param.standardIds.length > 0) {
      for (const stdId of param.standardIds) {
        rows.push(this.createBaseRow(sample, param, {
          ReferenceType: 'STANDARD',
          ReferenceCode: stdId.trim()
        }));
      }
    }

    return rows;
  }

  /**
   * Creates rows for preparations with their steps
   */
  private static createPreparationRows(
    sample: WorksheetDetail['sample'],
    param: ParameterDetail
  ): WorksheetTableRow[] {
    const rows: WorksheetTableRow[] = [];

    // Standard Preparations
    if (param.standardPreparations && param.standardPreparations.length > 0) {
      for (const prep of param.standardPreparations) {
        rows.push(...this.createStepsForPreparation(
          sample,
          param,
          prep,
          'STANDARD'
        ));
      }
    }

    // Sample Preparations
    if (param.samplePreparations && param.samplePreparations.length > 0) {
      for (const prep of param.samplePreparations) {
        rows.push(...this.createStepsForPreparation(
          sample,
          param,
          prep!,
          'SAMPLE'
        ));
      }
    }

    return rows;
  }

  /**
   * Creates rows for each step in a preparation
   */
  private static createStepsForPreparation(
    sample: WorksheetDetail['sample'],
    param: ParameterDetail,
    prep: any,
    category: 'STANDARD' | 'SAMPLE'
  ): WorksheetTableRow[] {
    const rows: WorksheetTableRow[] = [];
    
    try {
      const steps = JSON.parse(prep.steps);
      
      steps.forEach((step: any, index: number) => {
        const stepRow = this.createBaseRow(sample, param, {
          PrepCategory: category,
          PrepLabel: prep.label,
          PreparationType: prep.preparationType,
          AssignedStandardId: prep.assignedStandardId || null,
          StepName: step.name,
          StepOrder: index + 1,
          ...this.extractStepValues(step)
        });
        
        rows.push(stepRow);
      });
    } catch (error) {
      console.error('Error parsing preparation steps:', error);
    }

    return rows;
  }

  /**
   * Extracts step values based on step structure
   */
  private static extractStepValues(step: any): Partial<WorksheetTableRow> {
    const values: Partial<WorksheetTableRow> = {};

    // Weighing step
    if (step.value !== undefined) {
      values.Value1 = step.value || null;
      values.Unit1 = step.unit || null;
      values.Value2 = step.logBookID || null;
      values.Value3 = step.solventChemical || null;
    }

    // Dilution steps
    if (step.vol1 !== undefined) {
      values.Value1 = step.vol1 || null;
      values.Unit1 = step.unit1 || null;
      values.Value2 = step.vol2 || null;
      values.Unit2 = step.unit2 || null;
    }

    // Drying step
    if (step.temp !== undefined) {
      values.Value1 = step.temp || null;
      values.Unit1 = step.tempUnit || null;
      values.Value2 = step.time || null;
      values.Unit2 = step.timeUnit || null;
      values.Value3 = step.logBookID || null;
    }

    // Instrument Details (Dissolution)
    if (step.id !== undefined) {
      values.Value1 = step.id || null;
      values.Value2 = step.rpm || null;
      values.Value3 = step.temp || null;
      values.Unit3 = step.tempUnit || null;
    }

    // Tablet Details (Dissolution)
    if (step.claim !== undefined) {
      values.Value1 = step.claim || null;
      values.Unit1 = step.claimUnit || null;
      values.Value2 = step.mediaVol || null;
      values.Unit2 = step.unit || null;
      values.Value3 = step.time || null;
      values.Unit3 = step.timeUnit || null;
    }

    // Filtration
    if (step.name === 'Filtration' && step.value !== undefined) {
      values.Value1 = step.value || null;
      values.Unit1 = step.unit || null;
    }

    return values;
  }

  /**
   * Creates rows for calculations
   */
  private static createCalculationRows(
    sample: WorksheetDetail['sample'],
    param: ParameterDetail
  ): WorksheetTableRow[] {
    const rows: WorksheetTableRow[] = [];

    if (param.calculations && param.calculations.length > 0) {
      for (const calc of param.calculations) {
        try {
          const calcData = JSON.parse(calc.data);
          
          const calcRow = this.createBaseRow(sample, param, {
            CalculationLabel: calc.label,
            CalculationType: calc.calculationType,
            AreaOfSample: calcData.areaOfSample || null,
            AreaOfStandard: calcData.areaOfStandard || null,
            V1: calcData.v1 || null,
            V2: calcData.v2 || null,
            V3: calcData.v3 || null,
            V4: calcData.v4 || null,
            V5: calcData.v5 || null,
            V6: calcData.v6 || null,
            V7: calcData.v7 || null,
            V8: calcData.v8 || null,
            V9: calcData.v9 || null,
            V10: calcData.v10 || null,
            V11: calcData.v11 || null,
            V12: calcData.v12 || null,
            V13: calcData.v13 || null,
            V14: calcData.v14 || null,
            SW1: calcData.sw1 || null,
            SW2: calcData.sw2 || null,
            Purity: calcData.purity || calcData.baseXPurity || null,
            AvgWeight: calcData.avgWt || null,
            Claim: calcData.claim || calcData.labelClaim || null,
            SelectedStandardPrepLabel: calcData.selectedStandardPreparationLabel || null,
            SelectedSamplePrepLabel: calcData.selectedSamplePreparationLabel || null
          });
          
          rows.push(calcRow);
        } catch (error) {
          console.error('Error parsing calculation data:', error);
        }
      }
    }

    return rows;
  }

  /**
   * Utility method to preview the transformation
   */
  public static previewTransformation(response: WorksheetDetail): void {
    const rows = this.transformToTableRows(response);
    console.log(`Total rows generated: ${rows.length}`);
    console.log('\nSample rows:');
    console.table(rows.slice(0, 5));
    
    // Summary by type
    const summary = {
      references: rows.filter(r => r.ReferenceType !== null).length,
      preparations: rows.filter(r => r.PrepCategory !== null).length,
      calculations: rows.filter(r => r.CalculationLabel !== null).length
    };
    console.log('\nRow summary:', summary);
  }
}

// Example usage:
/*
import worksheetData from './worksheet-data.json';

// Transform the data
const tableRows = WorksheetDataTransformer.transformToTableRows(worksheetData);

// Preview the transformation
WorksheetDataTransformer.previewTransformation(worksheetData);

// Use the rows for SQL INSERT
console.log(`Generated ${tableRows.length} rows for insertion`);
*/