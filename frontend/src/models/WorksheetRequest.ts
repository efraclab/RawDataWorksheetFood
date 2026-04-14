import type { ParameterDetail } from "./ParameterDetail";

export interface WorksheetRequest {
  role: string;
  worksheetId?: string;
  registrationInfo?: {
    registrationNo: string;
    sampleName?: string;
    sampleCode?: string;
    sampleQuantity?: number;
    natureOfSample?: string;
    numberOfParameters: number;
    dueDate?: string;
    lab: string;
  };
  documentInfo?: {
    preparedBy?: string;
    revisionDate?: string;
    status?: string;
    approvedAt?: string | null;
  };
  parameters?: ParameterDetail[];
}


