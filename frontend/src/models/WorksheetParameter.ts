import type { CalculationData } from "./CalculationData";
import type { SamplePreparationData } from "./SamplePreparationData";
import type { StandardPreparationData } from "./StandardPreparationData";

export interface WorksheetParameter {
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
    analysisStartDate?: string;
    analysisCompletionDate?: string;
    approvedAt?: string;
    status?: string;

    instruments: string[];
    chemicals: string[];
    standards: string[];

    standardPreparations: StandardPreparationData[];
    samplePreparations: SamplePreparationData[];

    calculations: CalculationData[];
}
