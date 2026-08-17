export interface SamplePreparationPreservativeStep {

    name: string;

    value1: string;

    unit1: string;

    value2?: string;

    unit2?: string;

    logBookID?: string;
}


export interface SamplePreparationPreservative {

    id: number;

    label: string;

    steps: SamplePreparationPreservativeStep[];
}