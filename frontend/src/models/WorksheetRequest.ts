import type { WorksheetParameter } from "./WorksheetParameter";

export interface WorksheetRequest {
  worksheetId?: string;
  registrationInfo?: {
    registrationNo: string;
    sampleName: string;
    numberOfParameters: number;
    dueDate: string;
  };
  documentInfo?: {
    preparedBy?: string;
    revisionDate?: string;
  };
  parameters?: WorksheetParameter[];
}


