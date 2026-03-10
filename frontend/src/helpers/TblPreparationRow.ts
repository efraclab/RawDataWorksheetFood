export interface TblPreparationRow {
  WorksheetId: string;
  ParameterCode: string;
  /**
   * BUFFER      → step-based (has real steps, no content)
   * MOBILE_PHASE / DILUENT / BLANK → content-based (single row, no steps)
   */
  PrepCategory:
    | "STANDARD"
    | "SAMPLE"
    | "MOBILE_PHASE"
    | "DILUENT"
    | "BUFFER"
    | "DISSOLUTION_MEDIA"
    | "SYSTEM_SUITABILITY"
    | "BLANK";
  PrepLabel: string;
  /** null for BUFFER, MOBILE_PHASE, DILUENT, SYSTEM_SUITABILITY, BLANK */
  PreparationType: string | null;
  AssignedStandardId?: string | null;
  StepName: string | null;
  StepOrder: number | null;
  Value1?: string | null;
  Unit1?: string | null;
  Value2?: string | null;
  Unit2?: string | null;
  Value3?: string | null;
  Unit3?: string | null;
  SolventChemical?: string | null;
  LogBookID?: string | null;
  /** Only populated for SYSTEM_SUITABILITY steps */
  LimitType?: string | null;
  /** Only populated for MOBILE_PHASE, DILUENT, BLANK */
  Content?: any | null;
}