
export interface WorksheetSummary {

    worksheetId: string;
    registrationNo: string;
    sampleName: string;
    sampleCode: string;
    sampleQuantity: number | null;
    natureOfSample: string | null;
    numberOfParameters: number;
    dueDate: string;
    lab: string;
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
