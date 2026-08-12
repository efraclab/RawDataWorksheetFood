export interface CalculationProtein {

    id: number;

    label: string;

    selectedSamplePreparationLabel:
        string | null;

    // Protein calculation inputs

    sampleWeight: string | null;

    sampleTitreValue: string | null;

    blankTitreValue: string | null;

    normality: string | null;

    proteinFactor: string | null;

    // Constants

    factor14: number;

    multiplier100: number;

    denominator1000: number;

    // Result

    acceptanceLimitMin: string;

    acceptanceLimitMax: string;

    calculationResult: number | null;

    calculationResultUnit: string;
}