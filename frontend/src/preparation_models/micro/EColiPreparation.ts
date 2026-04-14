import type { EcoliObservationRow } from "./EColiObservationRow";

export type BiochemicalResult = "Positive" | "Negative" | "";

export interface EcoliPreparation {
    id: number;
    label: string;
    observationRows: EcoliObservationRow[];
    biochemicalRows: EcoliObservationRow[];
    result: string;
    remarks: string;
}