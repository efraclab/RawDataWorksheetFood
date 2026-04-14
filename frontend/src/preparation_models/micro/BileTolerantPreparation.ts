import type { BileTolerantInoculationRow } from "./BileTolerantInoculationRow";

export interface BileTolerantPreparation {
    id: number;
    label: string;
    inoculationRows: BileTolerantInoculationRow[];
    result: string;
}