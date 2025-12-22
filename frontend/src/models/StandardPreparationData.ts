
export interface StandardPreparationData {
    label: string;
    preparationType: "assay" | "lod" | "roi" | "sulphated_ash" | "residual_solvent" | "dissolution";
    assignedStandardId: string | null;
    steps: any;
}
