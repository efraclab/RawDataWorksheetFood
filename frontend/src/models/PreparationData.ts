
export interface PreparationData {
    label: string;
    preparationCategory: "standard" |
    "sample" |
    "dissolution_media" |
    "mobile_phase" | "blank";
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
    content: any;
}
