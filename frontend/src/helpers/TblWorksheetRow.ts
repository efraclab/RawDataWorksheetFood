

export interface TblWorksheetRow {
  WorksheetId: string;
  RegistrationNo: string;
  SampleName: string;
  NumberOfParameters: number;
  DueDate: string;
  WorksheetPreparedBy: string;
  WorksheetStatus: string;
  WorksheetCreatedAt: string;
  WorksheetUpdatedAt: string;
  WorksheetApprovedAt?: string | null;
}
