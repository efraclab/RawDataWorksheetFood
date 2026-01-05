

export interface TblReferenceRow {
  WorksheetId: string;
  ParameterCode: string;
  ReferenceType: "INSTRUMENT" | "CHEMICAL" | "STANDARD";
  ReferenceCode: string;
}
