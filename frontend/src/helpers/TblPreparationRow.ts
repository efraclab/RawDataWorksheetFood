

export interface TblPreparationRow {
  WorksheetId: string;
  ParameterCode: string;
  PrepCategory: "STANDARD" | "SAMPLE";
  PrepLabel: string;
  PreparationType: string;
  AssignedStandardId?: string | null;
  StepName: string;
  StepOrder: number;
  Value1?: string | null;
  Unit1?: string | null;
  Value2?: string | null;
  Unit2?: string | null;
  Value3?: string | null;
  Unit3?: string | null;
}
