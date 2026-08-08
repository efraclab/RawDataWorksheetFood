export interface CalculationFat {

    id: number;
    label: string;

    selectedSamplePreparationLabel: string | null;

    acceptanceLimitMin: string | null;
    acceptanceLimitMax: string | null;

    calculationResult: string | null;
    calculationResultUnit: string | null;

    // Stored values used for calculation
    w1: string | null;      // Initial Empty Flask
    w2: string | null;      // Final Flask After Drying
    w3: string | null;      // Sample Weight
}