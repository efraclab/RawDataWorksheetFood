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
    testSolutionPreparation: string;

    instrumentIds: string[];
    chemicalIds: string[];
    standardIds: string[];

    standardPreparations: StandardPreparationData[];
    samplePreparations: SamplePreparationData[];
    calculations: CalculationData[];
}
