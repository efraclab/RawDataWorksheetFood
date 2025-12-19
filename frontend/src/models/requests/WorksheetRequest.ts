import type { WorksheetParameter } from "./WorksheetParameter";

export interface WorksheetRequest {
  worksheetId?: string;
  registrationInfo?: {
    registrationNo: string;
    sampleName: string;
    dateOfReceipt: string;
    numberOfParameters: number;
    dueDate: string;
    analysisStartDate: string;
    analysisCompletionDate: string;
  };
  documentInfo?: {
    preparedBy: string;
    analyzedBy: string;
    approvedBy: string;
    classified: string;
    revisionDate: string;
  };
  parameters?: WorksheetParameter[];
}


