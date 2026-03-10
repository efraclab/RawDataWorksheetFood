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
  // QA workflow fields
  SubmittedQaBy: string | null;
  SubmittedQaAt: string | null;
  ApprovedBy: string | null;
}