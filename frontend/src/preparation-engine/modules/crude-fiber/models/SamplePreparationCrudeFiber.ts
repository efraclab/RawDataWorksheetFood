export interface SamplePreparationCrudeFiberStep {

    name: string;

    value1: string;

    unit1: string;

    value2?: string;

    unit2?: string;

    logBookID?: string;
}


export interface SamplePreparationCrudeFiber {

    id: number;

    label: string;

    steps: SamplePreparationCrudeFiberStep[];
}