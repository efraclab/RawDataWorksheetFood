export interface TblFileRow {
  WorksheetId: string;
  ParameterCode: string;
  PreparationType: string | null;
  PrepLabel: string | null;
  FileName: string;
  FileDataBase64: string | null;
}