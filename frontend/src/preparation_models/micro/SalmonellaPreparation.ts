import type { SalmonellaBiochemicalRow } from "./SalmonellaBiochemicalRow";
import type { SalmonellaInoculationRow } from "./SalmonellaInoculationRow";

export interface SalmonellaPreparation {
    id: number;
    label: string;
    inoculationRows: SalmonellaInoculationRow[];
    biochemicalRows: SalmonellaBiochemicalRow[];
    result: string;
}

