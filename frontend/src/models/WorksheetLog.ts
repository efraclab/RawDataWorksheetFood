export interface WorksheetLog {
  id: number;
  worksheetId: string;
  parameterCode: string | null;
  parameterName: string | null;
  timestamp: string;
  remarks: string | null;
  action: string;
  employeeId: string;
  employeeName: string;
  role: string;
  referenceType: string | null;
  referenceId: string | null;
}

