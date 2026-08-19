export interface SamplePreparationDietaryFiberStep {

    name: string;

    value1: string;

    unit1: string;

    value2?: string;

    unit2?: string;

    logBookID?: string;
}


export interface SamplePreparationDietaryFiber {

    id: number;

    label: string;

    steps:
        SamplePreparationDietaryFiberStep[];
}
