

export interface TblParameterRow {
  WorksheetId: string;
  ParameterCode: string;
  ParameterName: string;
  MethodCode: string;
  MethodName: string;
  ColumnId: string | null;
  DiluentPreparation: string | null;
  OtherInfo: string | null;
  ParameterAnalyzedBy: string | null;
  ParameterApprovedBy: string | null;
  ParameterStatus: string;
  ParameterApprovedAt?: string | null;
}
