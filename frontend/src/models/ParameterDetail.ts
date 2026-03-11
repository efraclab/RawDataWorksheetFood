import type { CalculationData } from "./CalculationData";
import type { PreparationData } from "./PreparationData";
import type { WorksheetFileData } from "./WorksheetFileData";

export interface ParameterDetail {
    preparationCompletedBy: string | null;
    preparationCompletedAt: string | null;
    remarksByAnalyst: string | null;
    id: number;
    paraCode: string | null;
    parameterName: string | null;
    methodCode: string | null;
    methodName: string | null;
    analyzedBy: string | null;
    approvedByReviewer: string | null;
    analyzedByName: string | null;
    approvedByReviewerName: string | null;
    analysisStartDate: string | null;
    analysisCompletionDate: string | null;
    approvedAtReviewer: string | null;
    approvedByQAName: string | null;
    approvedByQA: string | null;
    approvedAtQA: string | null;
    remarksByReviewer: string | null;
    remarksByQA: string | null;
    status: string | null;

    instrumentIds: string[];
    chemicalIds: string[];
    standardIds: string[];

    // standardPreparations: StandardPreparationData[];
    // samplePreparations: SamplePreparationData[];

    preparations: PreparationData[];
    calculations: CalculationData[];
    files?: WorksheetFileData[];
}

