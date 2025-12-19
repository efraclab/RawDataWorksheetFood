import type { WorksheetParameter } from "./requests/WorksheetParameter";

export interface WorksheetRequest {
  registrationInfo: {
    registrationNo: string;
    sampleName: string;
    dateOfReceipt: string;
    numberOfParameters: number;
    dueDate: string;
    analysisStartDate: string;
    analysisCompletionDate: string;
  };
  documentInfo: {
    preparedBy: string;
    analyzedBy: string;
    approvedBy: string;
    classified: string;
    revisionDate: string;
  };
  parameters: WorksheetParameter[];
}


