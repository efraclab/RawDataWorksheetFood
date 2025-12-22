import type { StandardPreparationData } from "./StandardPreparationData";
import type { SamplePreparationData } from "./SamplePreparationData";
import type { CalculationData } from "./CalculationData";

export interface ParameterDetail {
    id: number;
    paraCode: string;
    parameterName: string;
    methodCode: string;
    methodName: string;
    columnId: string;
    diluentPreparation: string;
    otherInfo: string;
    analyzedBy: string;
    approvedBy: string;
    analysisStartDate: string;
    analysisCompletionDate: string;
    approvedAt: string | null;

    instrumentIds: string[];
    chemicalIds: string[];
    standardIds: string[];

    standardPreparations: StandardPreparationData[];
    samplePreparations: SamplePreparationData[];
    calculations: CalculationData[];
}
