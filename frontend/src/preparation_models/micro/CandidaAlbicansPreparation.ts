import type { CandidaIdentificationRow } from "./CandidaIdentificationRow";
import type { CandidaInoculationRow } from "./CandidaInoculationRow";

export interface CandidaAlbicansPreparation {
    id: number;
    label: string;
    inoculationRows: CandidaInoculationRow[];
    identificationRows: CandidaIdentificationRow[];
    result: string;
}