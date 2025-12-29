export interface CalculationData {
    label: string;
    calculationType: "assay" | "lod" | "roi" | "sulphated_ash" | "residual_solvent" | "dissolution";
    data: any;
}
