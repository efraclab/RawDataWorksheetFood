import type { ParameterDetail } from "./ParameterDetail";


export interface WorksheetDetail {
    worksheet: {
        worksheetId: string;
        registrationNo: string;
        sampleName: string;
        dateOfReceipt: string;
        numberOfParameters: number;
        dueDate: string;
        preparedBy: string;
        revisionDate: string;
        status: string;
        submittedAt: string | null;
        createdAt: string;
        updatedAt: string | null;
    };
    parameters: ParameterDetail[];
}
