export interface PreparationModule {

    id: string;

    title: string;

    color: string;

    createSamplePreparation(index: number): unknown;

    createCalculation(index: number): unknown;

}