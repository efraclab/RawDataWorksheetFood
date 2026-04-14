import type { GrowthResult } from "./SterilityPreparation";


export interface SterilityObservationDay {
    day: number;
    date: string;

    sampleFTM: GrowthResult;
    sampleSCDM: GrowthResult;

    positiveControlFTM: GrowthResult;
    positiveControlSCDM: GrowthResult;

    blankFTM: GrowthResult;
    blankSCDM: GrowthResult;
}
