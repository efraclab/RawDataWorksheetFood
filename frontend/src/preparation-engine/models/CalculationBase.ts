export interface CalculationBase {
    id: number;

    label: string;

    selectedSamplePreparationLabel: string | null;

    acceptanceLimitMin: string | null;
    acceptanceLimitMax: string | null;

    calculationResult: string | null;
    calculationResultUnit: string | null;
}