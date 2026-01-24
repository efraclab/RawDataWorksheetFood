import type { CalculationData } from "./CalculationData";
import type { PreparationData } from "./PreparationData";

export interface ParameterDetail {
    id: number;
    paraCode: string;
    parameterName: string;
    methodCode: string;
    methodName: string;
    columnId?: string;
    diluentPreparation?: string;
    otherInfo?: string;
    analyzedBy?: string;
    approvedBy?: string;
    analyzedByName?: string;
    approvedByName?: string;
    analysisStartDate?: string;
    analysisCompletionDate?: string;
    approvedAt?: string;
    status?: string;

    instrumentIds: string[];
    chemicalIds: string[];
    standardIds: string[];

    // standardPreparations: StandardPreparationData[];
    // samplePreparations: SamplePreparationData[];

    preparations: PreparationData[];
    calculations: CalculationData[];
}
