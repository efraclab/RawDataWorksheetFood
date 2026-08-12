export interface PreparationData {
    label: string;

    preparationCategory:
        | "sample"
        | "standard"
        | "buffer"
        | "mobile_phase"
        | "diluent"
        | "system_suitability"
        | "parameter_file"
        | "dissolution_media"
        | "blank";

    preparationType:
        | "assay"
        | "fat"
        | "residual_solvent"
        | "dissolution"
        | "lod"
        | "protein"
        | "roi"
        | "sulphated_ash"
        | "titration"
        | null;

    assignedStandardId: string | null;

    steps: any;

    content: any;

    // NEW
    isPreparationCompleted?: boolean;

    completedAt?: string | null;
}