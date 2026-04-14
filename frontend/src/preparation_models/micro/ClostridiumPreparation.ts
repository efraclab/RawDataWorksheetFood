import type { ClostridiumBiochemicalRow } from "./ClostridiumBiochemicalRow";
import type { ClostridiumInoculationRow } from "./ClostridiumInoculationRow";

export interface ClostridiumPreparation {
    id: number;
    label: string;
    inoculationRows: ClostridiumInoculationRow[];
    biochemicalRows: ClostridiumBiochemicalRow[];
    result: string;
}


