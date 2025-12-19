import type { CalculationData } from "./CalculationData";
import type { SamplePreparationData } from "./SamplePreparationData";
import type { StandardPreparationData } from "./StandardPreparationData";


export interface WorksheetParameter {
    paraCode: string;
    parameterName: string;
    methodCode: string;
    methodName: string;
    columnId: string;
    diluentPreparation: string;
    testSolutionPreparation: string;

    // Only IDs for reference tables
    instruments: string[];
    chemicals: string[];
    standards: string[];

    standardPreparations?: StandardPreparationData[];
    samplePreparations?: SamplePreparationData[];

    calculations?: CalculationData[];
}
