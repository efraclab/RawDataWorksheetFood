import type { GrowthResult } from "./SterilityPreparation";


export interface SterilitySubCultureRow {
    date: string;

    ftmSampleResult: GrowthResult;
    ftmPositiveControlResult: GrowthResult;
    ftmBlankResult: GrowthResult;
    scdmSampleResult: GrowthResult;
    scdmPositiveControlResult: GrowthResult;
    scdmBlankResult: GrowthResult;
}
