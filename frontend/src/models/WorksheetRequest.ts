import type { ParameterDetail } from "./ParameterDetail";

export interface WorksheetRequest {
  role: string;
  worksheetId?: string;
  registrationInfo?: {
    registrationNo: string;
    sampleName?: string;
    numberOfParameters: number;
    dueDate?: string;
  };
  documentInfo?: {
    preparedBy?: string;
    revisionDate?: string;
    status?: string;
    approvedAt?: string | null;
  };
  parameters?: ParameterDetail[];
}


