import type { BCepaciaIdentificationRow } from "./BCepaciaIdentificationRow";
import type { BCepaciaInoculationRow } from "./BCepaciaInoculationRow";

export interface BCepaciaPreparation {
    id: number;
    label: string;
    inoculationRows: BCepaciaInoculationRow[];
    identificationRows: BCepaciaIdentificationRow[];
    result: string;
}