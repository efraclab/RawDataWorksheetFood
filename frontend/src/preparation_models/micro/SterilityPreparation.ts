import type { SterilityObservationDay } from "./SterilityObservationDay";
import type { SterilitySubCultureRow } from "./SterilitySubCultureRow";

export type SterilityTestType = "Direct Inoculation" | "Membrane Filtration";
export type FilterPaperUsage = "Cut in half" | "Used whole";
export type GrowthResult = "+ve" | "-ve" | "";

export interface SterilityPreparation {
    id: number;
    label: string;
    testType: SterilityTestType;
    filterPaperName: string;
    filterPaperDiameter: string;
    filterPaperPoreSize: string;
    filterPaperUsage: FilterPaperUsage;
    observationDays: SterilityObservationDay[];
    subCultureRows: SterilitySubCultureRow[];
    finalResult: "Complies" | "Does Not Comply" | "";
}