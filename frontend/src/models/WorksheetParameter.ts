import type { CalculationData } from "./requests/CalculationData";
import type { SamplePreparationData } from "./requests/SamplePreparationData";
import type { StandardPreparationData } from "./requests/StandardPreparationData";


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

    // JSON data for preparations and calculations
    standardPreparation?: StandardPreparationData[];
    samplePreparation?: SamplePreparationData[];
    samplePreparationTitration?: SamplePreparationData[];
    samplePreparationLod?: SamplePreparationData[];
    samplePreparationROI?: SamplePreparationData[];
    samplePreparationSulphatedAsh?: SamplePreparationData[];
    standardPreparationRS?: StandardPreparationData[];
    samplePreparationRS?: SamplePreparationData[];
    standardPreparationDisso?: StandardPreparationData[];
    samplePreparationDisso?: SamplePreparationData[];

    calculationsAssay?: CalculationData[];
    calculationsLod?: CalculationData[];
    calculationsROI?: CalculationData[];
    calculationsSulphatedAsh?: CalculationData[];
    calculationsRS?: CalculationData[];
    calculationsDisso?: CalculationData[];
}
