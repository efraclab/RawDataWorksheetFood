export interface SamplePreparationUnsapMatterStep {

    name: string;

    value1: string;

    unit1: string;

    value2?: string;

    unit2?: string;

    logBookID?: string;
}


export interface SamplePreparationUnsapMatter {

    id: number;

    label: string;

    steps: SamplePreparationUnsapMatterStep[];
}