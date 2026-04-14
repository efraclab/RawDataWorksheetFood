import type { StaphylococcusBiochemicalRow } from "./StaphylococcusBiochemicalRow";
import type { StaphylococcusInoculationRow } from "./StaphylococcusInoculationRow";

export interface StaphylococcusPreparation {
    id: number;
    label: string;
    inoculationRows: StaphylococcusInoculationRow[];
    biochemicalRows: StaphylococcusBiochemicalRow[];
    result: string;
}
