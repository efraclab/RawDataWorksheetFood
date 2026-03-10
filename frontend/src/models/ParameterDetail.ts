import type { CalculationData } from "./CalculationData";
import type { PreparationData } from "./PreparationData";
import type { WorksheetFileData } from "./WorksheetFileData";

export interface ParameterDetail {
    id: number;
    paraCode: string;
    parameterName: string;
    methodCode: string;
    methodName: string;
    columnId?: string;
    otherInfo?: string;
    analyzedBy?: string;
    approvedByReviewer?: string;
    analyzedByName?: string;
    approvedByReviewerName?: string;
    analysisStartDate?: string;
    analysisCompletionDate?: string;
    approvedAtReviewer?: string;
    approvedByQAName?: string;
    approvedByQA?: string;
    approvedAtQA?: string;
    remarksByReviewer?: string;
    remarksByQA?: string;
    status?: string;

    instrumentIds: string[];
    chemicalIds: string[];
    standardIds: string[];

    // standardPreparations: StandardPreparationData[];
    // samplePreparations: SamplePreparationData[];

    preparations: PreparationData[];
    calculations: CalculationData[];
    files?: WorksheetFileData[];
}

