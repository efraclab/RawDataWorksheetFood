import type { TVCWaterObservationRow } from "./TVCWaterObservationRow";

export interface TVCWaterPreparation {
    id: number;
    label: string;
    inoculationVolume: string;
    incubationTemp: string;
    incubationTempUnit: string;
    incubationTime: string;
    incubationTimeUnit: string;
    observationRows: TVCWaterObservationRow[];
    calculatedResult: string;
    result: string;
    calculatedResultUnit: string;
}

