export interface SamplePreparationSugarSaponinCatechinProfileStep {

    name: string;

    value1: string;

    unit1: string;

    value2?: string;

    unit2?: string;

    logBookID?: string;
}


export interface SamplePreparationSugarSaponinCatechinProfile {

    id: number;

    label: string;

    steps:
        SamplePreparationSugarSaponinCatechinProfileStep[];

}