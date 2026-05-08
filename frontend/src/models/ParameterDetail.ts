import type { CalculationData } from "./CalculationData";
import type { PreparationData } from "./PreparationData";
import type { WorksheetChemical } from "./WorksheetChemical";
import type { WorksheetFileData } from "./WorksheetFileData";
import type { WorksheetInstrument } from "./WorksheetInstrument";
import type { WorksheetMedia } from "./WorksheetMedia";
import type { WorksheetStandard } from "./WorksheetStandard";

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
    submittedQaByName: string | null;
    submittedQaBy: string | null;
    status: string | null;
    additional_info: string | null;

    instruments?: WorksheetInstrument[];
    chemicals?: WorksheetChemical[];
    standards?: WorksheetStandard[];
    media?: WorksheetMedia[];

    preparations?: PreparationData[];
    calculations?: CalculationData[];
    files?: WorksheetFileData[];
}

