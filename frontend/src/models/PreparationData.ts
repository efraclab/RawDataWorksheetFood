
export interface PreparationData {
    label: string;
    preparationCategory: "standard" |
    "sample" |
    "dissolution_media" |
    "mobile_phase";
    preparationType: "assay" |
    "residual_solvent" |
    "dissolution" |
    "lod" |
    "roi" |
    "sulphated_ash" |
    "titration" |
    null;
    assignedStandardId: string | null;
    steps: any;
}
