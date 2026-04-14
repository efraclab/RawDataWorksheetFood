import type { PseudomonasBiochemicalRow } from "./PseudomonasBiochemicalRow";
import type { PseudomonasInoculationRow } from "./PseudomonasInoculationRow";


export interface PseudomonasPreparation {
    id: number;
    label: string;
    inoculationRows: PseudomonasInoculationRow[];
    biochemicalRows: PseudomonasBiochemicalRow[];
    result: string;
}


