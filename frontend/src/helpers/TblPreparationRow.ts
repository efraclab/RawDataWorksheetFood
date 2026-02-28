


export interface TblPreparationRow {
  WorksheetId: string;
  ParameterCode: string;
  PrepCategory: "STANDARD" | "SAMPLE" | "MOBILE_PHASE" | "DILUENT" | "DISSOLUTION_MEDIA" | "SYSTEM_SUITABILITY" | "BLANK";
  PrepLabel: string;
  PreparationType: string;
  AssignedStandardId?: string | null;
  StepName: string | null;
  StepOrder: number | null;
  Value1?: string | null;
  Unit1?: string | null;
  Value2?: string | null;
  Unit2?: string | null;
  Value3?: string | null;
  Unit3?: string | null;
  // Need to add these attributes in database as well
  SolventChemical?: string | null;
  LogBookID?: string | null;
  LimitType?: string | null;
  Content?: any | null;
}