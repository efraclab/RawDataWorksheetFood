// services/RawDataTransformer.ts
// This service transforms worksheet data into the format required for tblRawdataTrn and tblRawdataTrn2

import type { WorksheetDetail } from "../models/WorksheetDetail";

// interface WorksheetResponse {
//   sample: {
//     worksheetId: string;
//     registrationNo: string;
//     sampleName: string;
//     numberOfParameters: number;
//     dueDate: string;
//     preparedBy: string;
//     status: string;
//     createdAt: string;
//     updatedAt: string;
//   };
//   parameters: Array<{
//     id: number;
//     paraCode: string;
//     parameterName: string;
//     methodCode: string;
//     methodName: string;
//     columnId: string;
//     diluentPreparation: string;
//     otherInfo: string;
//     analyzedBy: string;
//     approvedBy: string;
//     analysisStartDate: string;
//     analysisCompletionDate: string;
//     approvedAt: string;
//     status: string;
//     instrumentIds: string[];
//     chemicalIds: string[];
//     standardIds: string[];
//     standardPreparations: Array<{
//       label: string;
//       assignedStandardId: string;
//       preparationType: string;
//       steps: string;
//     }>;
//     samplePreparations: Array<{
//       label: string;
//       assignedStandardId: string;
//       preparationType: string;
//       steps: string;
//     }>;
//     calculations: Array<{
//       label: string;
//       calculationType: string;
//       data: string;
//     }>;
//   }>;
// }

interface RawDataTrnRow {
  WorksheetId: string;
  Plantcd: string | null;
  TRNREFRW2: string;
  Instcd: string | null;
  CalibDueOn: string | null;
  CalibDonOn: string | null;
  Chemcd: string | null;
  Mak: string | null;
  BatchLot: string | null;
  Validity: string | null;
  Stdcd: string | null;
  Purity: string | null;
  Make: string | null;
  BatchLot1: string | null;
  Validity1: string | null;
  Colmcd: string | null;
  Regno: string;
  Dateofrec: string | null;
  Prodcd: string;
  Nos: number;
  Duedt: string;
  Anastdt: string | null;
  Anacompdt: string | null;
  Trn2header: string;
  Batchno: string | null;
  PreparationName: string;
  DilutName: string;
  Qty1: number | null;
  Unit1: string | null;
  Ver1: string | null;
  Qty2: number | null;
  Unit2: string | null;
  Ver2: string | null;
  Micron: string | null;
  LogBookid: string | null;
}

interface RawDataTrn2Row {
  WorksheetId: string;
  Plantcd: string | null;
  TRNREFRW2: string;
  Instcd: string | null;
  CalibDueOn: string | null;
  CalibDonOn: string | null;
  Chemcd: string | null;
  Mak: string | null;
  BatchLot: string | null;
  Validity: string | null;
  Stdcd: string | null;
  Purity: string | null;
  Make: string | null;
  BatchLot1: string | null;
  Validity1: string | null;
  Colmcd: string | null;
  Regno: string;
  Dateofrec: string | null;
  Prodcd: string;
  Nos: number;
  Duedt: string;
  Anastdt: string | null;
  Anacompdt: string | null;
  Trn2header: string;
  Batchno: string | null;
  PreparationName: string;
  Qty1: number | null;
  Unit1: string | null;
  ReAgent1: string | null;
  Qty2: number | null;
  Unit2: string | null;
  ReAgent2: string | null;
  LogBookid: string | null;
  PHto: string | null;
  LogBookid1: string | null;
  Phasefrm: string | null;
  Filternm: string | null;
  Phasefor: string | null;
  Phaseid: string | null;
}

export class RawDataTransformer {

  static transformWorksheetToRawData(
    worksheetData: WorksheetDetail,
    instruments: any[],
    chemicals: any[],
    standards: any[]
  ): {
    trnRows: RawDataTrnRow[];
    trn2Rows: RawDataTrn2Row[];
  } {
    const trnRows: RawDataTrnRow[] = [];
    const trn2Rows: RawDataTrn2Row[] = [];

    const { sample, parameters } = worksheetData;

    // Process each parameter
    parameters.forEach((param) => {
      // Get associated instruments, chemicals, standards
      const paramInstruments = instruments.filter((inst) =>
        param.instrumentIds.includes(inst.id)
      );
      const paramChemicals = chemicals.filter((chem) =>
        param.chemicalIds.includes(chem.id)
      );
      const paramStandards = standards.filter((std) =>
        param.standardIds.includes(std.id)
      );

      // Process Standard Preparations (for tblRawdataTrn)
      param.standardPreparations.forEach((stdPrep) => {
        const steps = JSON.parse(stdPrep.steps);
        const assignedStandard = paramStandards.find(
          (s) => s.id === stdPrep.assignedStandardId
        );

        // Process each step in standard preparation
        steps.forEach((step: any, stepIndex: number) => {
          if (this.hasStepData(step)) {
            const row = this.createTrnRow(
              sample,
              param,
              stdPrep,
              step,
              stepIndex,
              paramInstruments,
              paramChemicals,
              assignedStandard
            );
            trnRows.push(row);
          }
        });
      });

      // Process Sample Preparations (for tblRawdataTrn2)
      param.samplePreparations.forEach((samplePrep) => {
        const steps = JSON.parse(samplePrep.steps);
        const assignedStandard = paramStandards.find(
          (s) => s.id === samplePrep.assignedStandardId
        );

        // Process each step in sample preparation
        steps.forEach((step: any, stepIndex: number) => {
          if (this.hasStepData(step)) {
            const row = this.createTrn2Row(
              sample,
              param,
              samplePrep,
              step,
              stepIndex,
              paramInstruments,
              paramChemicals,
              assignedStandard
            );
            trn2Rows.push(row);
          }
        });
      });
    });

    return { trnRows, trn2Rows };
  }

  /**
   * Check if a step has any meaningful data
   */
  private static hasStepData(step: any): boolean {
    // For weighing steps
    if (step.name === "Weighing") {
      return !!(step.value || step.logBookID || step.solventChemical);
    }

    // For dilution steps
    if (step.name?.includes("Dilution")) {
      return !!(step.vol1 || step.vol2);
    }

    // For filtration steps
    if (step.name === "Filtration") {
      return !!step.value;
    }

    // For drying steps (LOD, Sulphated Ash, ROI)
    if (step.name === "Drying") {
      return !!(step.temp || step.time || step.logBookID);
    }

    // For instrument details (Dissolution)
    if (step.name === "Instrument Details") {
      return !!(step.id || step.rpm || step.temp);
    }

    // For tablet details (Dissolution)
    if (step.name === "Tablet Details") {
      return !!(step.claim || step.mediaVol || step.time);
    }

    // Default: check if step has any non-empty values
    return Object.values(step).some(
      (value) => value !== "" && value !== null && value !== undefined
    );
  }

  /**
   * Create a row for tblRawdataTrn (Standard Preparation)
   */
  private static createTrnRow(
    sample: WorksheetDetail["sample"],
    param: WorksheetDetail["parameters"][0],
    stdPrep: any,
    step: any,
    stepIndex: number,
    instruments: any[],
    chemicals: any[],
    standard: any
  ): RawDataTrnRow {
    // Get first instrument, chemical (or null if none)
    const instrument = instruments[0] || null;
    const chemical = chemicals[0] || null;

    // Parse dates
    const dueDate = this.parseDate(sample.dueDate);
    const analysisStartDate = this.parseDate(param.analysisStartDate);
    const analysisCompletionDate = this.parseDate(param.analysisCompletionDate);

    // Determine dilution name based on step
    const dilutionName = this.getDilutionName(step.name);

    return {
      WorksheetId: sample.worksheetId,
      Plantcd: null, // Need to be provided from plant configuration
      TRNREFRW2: param.paraCode,
      Instcd: instrument?.id || null,
      CalibDueOn: instrument ? this.parseDate(instrument.calibrationDueDate) : null,
      CalibDonOn: instrument ? this.parseDate(instrument.calibrationDoneDate) : null,
      Chemcd: chemical?.id || null,
      Mak: chemical?.make || null,
      BatchLot: chemical?.batchNo || null,
      Validity: chemical?.validity || null,
      Stdcd: standard?.id || null,
      Purity: standard?.purity || null,
      Make: standard?.make || null,
      BatchLot1: standard?.batchNo || null,
      Validity1: standard?.validity || null,
      Colmcd: param.columnId || null,
      Regno: sample.registrationNo,
      Dateofrec: null, // Would come from sample registration
      Prodcd: sample.sampleName,
      Nos: sample.numberOfParameters,
      Duedt: dueDate!,
      Anastdt: analysisStartDate,
      Anacompdt: analysisCompletionDate,
      Trn2header: stdPrep.label,
      Batchno: null, // Would come from sample batch info
      PreparationName: step.name,
      DilutName: dilutionName,
      Qty1: this.parseNumber(step.value || step.vol1),
      Unit1: step.unit || step.unit1 || null,
      Ver1: step.logBookID || null,
      Qty2: this.parseNumber(step.vol2),
      Unit2: step.unit2 || null,
      Ver2: null, // Additional verification field if needed
      Micron: step.name === "Filtration" ? step.value : null,
      LogBookid: step.logBookID || null,
    };
  }

  /**
   * Create a row for tblRawdataTrn2 (Sample Preparation)
   */
  private static createTrn2Row(
    sample: WorksheetDetail["sample"],
    param: WorksheetDetail["parameters"][0],
    samplePrep: any,
    step: any,
    stepIndex: number,
    instruments: any[],
    chemicals: any[],
    standard: any
  ): RawDataTrn2Row {
    const instrument = instruments[0] || null;
    const chemical = chemicals[0] || null;

    const dueDate = this.parseDate(sample.dueDate);
    const analysisStartDate = this.parseDate(param.analysisStartDate);
    const analysisCompletionDate = this.parseDate(param.analysisCompletionDate);

    return {
      WorksheetId: sample.worksheetId,
      Plantcd: null,
      TRNREFRW2: param.paraCode,
      Instcd: instrument?.id || null,
      CalibDueOn: instrument ? this.parseDate(instrument.calibrationDueDate) : null,
      CalibDonOn: instrument ? this.parseDate(instrument.calibrationDoneDate) : null,
      Chemcd: chemical?.id || null,
      Mak: chemical?.make || null,
      BatchLot: chemical?.batchNo || null,
      Validity: chemical?.validity || null,
      Stdcd: standard?.id || null,
      Purity: standard?.purity || null,
      Make: standard?.make || null,
      BatchLot1: standard?.batchNo || null,
      Validity1: standard?.validity || null,
      Colmcd: param.columnId || null,
      Regno: sample.registrationNo,
      Dateofrec: null,
      Prodcd: sample.sampleName,
      Nos: sample.numberOfParameters,
      Duedt: dueDate!,
      Anastdt: analysisStartDate,
      Anacompdt: analysisCompletionDate,
      Trn2header: samplePrep.label,
      Batchno: null,
      PreparationName: step.name,
      Qty1: this.parseNumber(step.value || step.vol1),
      Unit1: step.unit || step.unit1 || null,
      ReAgent1: step.solventChemical || null,
      Qty2: this.parseNumber(step.vol2),
      Unit2: step.unit2 || null,
      ReAgent2: null, // If there's a second reagent in the step
      LogBookid: step.logBookID || null,
      PHto: null, // pH value if applicable
      LogBookid1: null, // Secondary log book if needed
      Phasefrm: null, // Mobile phase from
      Filternm: step.name === "Filtration" ? step.value : null,
      Phasefor: null, // Mobile phase for
      Phaseid: null, // Phase identifier
    };
  }

  /**
   * Helper: Get dilution name for the step
   */
  private static getDilutionName(stepName: string): string {
    if (stepName === "Weighing") return "Weighing";
    if (stepName.includes("1st Dilution")) return "1st Dilution";
    if (stepName.includes("2nd Dilution")) return "2nd Dilution";
    if (stepName.includes("3rd Dilution")) return "3rd Dilution";
    if (stepName.includes("4th Dilution")) return "4th Dilution";
    if (stepName === "Filtration") return "Filtration";
    return stepName;
  }

  /**
   * Helper: Parse date from DD-MM-YYYY to YYYY-MM-DD
   */
  private static parseDate(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;
    
    try {
      // Handle DD-MM-YYYY format
      if (dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          // Check if already in YYYY-MM-DD format
          if (parts[0].length === 4) {
            return dateStr;
          }
          // Convert DD-MM-YYYY to YYYY-MM-DD
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      
      return dateStr;
    } catch (e) {
      console.error("Error parsing date:", dateStr, e);
      return null;
    }
  }

  /**
   * Helper: Parse number from string
   */
  private static parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === "") return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
}