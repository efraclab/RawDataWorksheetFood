
export interface WorksheetSummary {

    worksheetId: string;
    registrationNo: string;
    sampleName: string;
    numberOfParameters: number;
    dueDate: string;
    preparedBy: string;
    preparedByName: string;
    revisionDate: string;
    status: string;
    approvedAt: string | null;
    createdAt: string;
    updatedAt: string | null;
    submittedQaBy: string | null;
    submittedQaAt: string | null;
    approvedBy: string | null;
}
