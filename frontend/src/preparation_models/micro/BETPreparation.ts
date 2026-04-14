import type { BETObservationTube } from "./BETObservationTube";


export interface BETPreparation {
    id: number;
    label: string;
    dilutionProcedure: string;
    endotoxinLimit: string;
    concentrationOfSample: string;
    lysateSensitivity: string;
    mvd: string;
    observationTubes: BETObservationTube[];
    finalResult: "Complies" | "Does Not Comply" | "";
}