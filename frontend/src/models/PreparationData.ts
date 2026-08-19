export interface PreparationData {

    label: string;

    // ============================================================
    // PREPARATION CATEGORY
    // ============================================================

    preparationCategory:
    | "blank"
    | "buffer"
    | "diluent"
    | "dissolution_media"
    | "mobile_phase"
    | "parameter_file"
    | "sample"
    | "standard"
    | "system_suitability";


    // ============================================================
    // PREPARATION TYPE
    // ============================================================

    preparationType:
    | "acidity"
    | "acidValue"
    | "aminoAcid"
    | "artificialColour"
    | "artificialSweetner"
    | "assay"
    | "carbohydrate"
    | "cholesterol"
    | "crudeFiber"
    | "dietaryFiber"
    | "dissolution"
    | "energy"
    | "fat"
    | "fattyAcidProfile"
    | "freeFattyAcid"
    | "fsv"
    | "lod"
    | "moisture"
    | "nots"
    | "peroxideValue"
    | "preservative"
    | "protein"
    | "residual_solvent"
    | "roi"
    | "saponificationValue"
    | "sugar"
    | "sugarSaponinCatechinProfile"
    | "sulphated_ash"
    | "sulphurDioxide"
    | "titration"
    | "unsapMatter"
    | "uricAcid"
    | "wsv"
    | null;


    // ============================================================
    // STANDARD
    // ============================================================

    assignedStandardId: string | null;


    // ============================================================
    // PREPARATION STEPS
    // ============================================================

    steps: any;


    // ============================================================
    // CONTENT
    // ============================================================

    content: any;


    // ============================================================
    // PREPARATION COMPLETION
    // ============================================================

    isPreparationCompleted?: boolean;

    completedAt?: string | null;
}