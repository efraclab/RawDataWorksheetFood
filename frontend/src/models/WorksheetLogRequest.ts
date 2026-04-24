
export interface WorksheetLogRequest {
    worksheetId?: string;
    parameterId?: number | null;
    remarks?: string | null;
    action: string;
    employeeId: string;
    role: string;
    referenceType?: string | null;
    referenceId?: string | null;
}
