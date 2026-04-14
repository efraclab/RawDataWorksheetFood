import type { ShigellaBiochemicalRow } from "./ShigellaBiochemicalRow";
import type { ShigellaInoculationRow } from "./ShigellaInoculationRow";
 
export type ObservationResult = "+ve" | "-ve" | "";
 
export interface ShigellaPreparation {
    id: number;
    label: string;
    inoculationRows: ShigellaInoculationRow[];
    biochemicalRows: ShigellaBiochemicalRow[];
    result: string;
}