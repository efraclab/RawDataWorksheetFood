import type { ParameterDetail } from "./ParameterDetail";


export interface WorksheetDetail {
    worksheet: {
        worksheetId: string;
        registrationNo: string;
        sampleName: string;
        dateOfReceipt: string;
        numberOfParameters: number;
        dueDate: string;
        analysisStartDate: string;
        analysisCompletionDate: string;
        preparedBy: string;
        analyzedBy: string;
        approvedBy: string;
        classified: string;
        revisionDate: string;
        status: string;
        submittedAt: string | null;
        approvedAt: string | null;
        createdAt: string;
        updatedAt: string | null;
    };
    parameters: ParameterDetail[];
}
