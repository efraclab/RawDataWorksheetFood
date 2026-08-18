export interface PreparationData {

    label: string;

    // ============================================================
    // PREPARATION CATEGORY
    // ============================================================

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


    // ============================================================
    // PREPARATION TYPE
    // ============================================================

    preparationType:
        | "assay"
        | "fat"
        | "fattyAcidProfile"
        | "residual_solvent"
        | "dissolution"
        | "lod"
        | "protein"
        | "sugar"
        | "energy"
        | "carbohydrate"
        | "crudeFiber"
        | "peroxideValue"
        | "acidValue"
        | "saponificationValue"
        | "freeFattyAcid"
        | "unsapMatter"
        | "artificialSweetner"
        | "preservative"
        | "nots"
        | "artificialColour"
        | "uricAcid"
        | "fsv"
        | "roi"
        | "sulphated_ash"
        | "sulphurDioxide"
        | "titration"
        | null;


    // ============================================================
    // STANDARD
    // ============================================================

    assignedStandardId:
        string | null;


    // ============================================================
    // PREPARATION STEPS
    // ============================================================

    steps:
        any;


    // ============================================================
    // CONTENT
    // ============================================================

    content:
        any;


    // ============================================================
    // PREPARATION COMPLETION
    // ============================================================

    isPreparationCompleted?:
        boolean;

    completedAt?:
        string | null;
}