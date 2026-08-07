// file: frontend/src/models/ParameterDetail.ts
import type { CalculationData } from "./CalculationData";
import type { PreparationData } from "./PreparationData";
import type { WorksheetChemical } from "./WorksheetChemical";
import type { WorksheetFileData } from "./WorksheetFileData";
import type { WorksheetInstrument } from "./WorksheetInstrument";
import type { WorksheetMedia } from "./WorksheetMedia";
import type { WorksheetStandard } from "./WorksheetStandard";
import type { PreparationDraft } from "../pages/food/types/PreparationDraft";

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
    analysisObservationDate: string | null;
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
    other_info?: string | null;
    showAdditionalInfo?: boolean;
    showInternalStandardPreparation?: boolean;

    instruments?: WorksheetInstrument[];
    chemicals?: WorksheetChemical[];
    standards?: WorksheetStandard[];
    /** Hypromellose-only: independent standard pool for the Internal Standard
     *  Preparation table, separate from `standards`. */
    internalStandards?: WorksheetStandard[];
    media?: WorksheetMedia[];

    preparations?: PreparationData[];
    calculations?: CalculationData[];
    files?: WorksheetFileData[];

    preparationDraft?: PreparationDraft;
}