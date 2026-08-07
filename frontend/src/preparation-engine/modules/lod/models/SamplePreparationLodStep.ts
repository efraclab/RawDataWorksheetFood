export type SamplePreparationLodStep = {
    name:
        | "Weight of Empty Dish"
        | "Weight of Sample + Dish"
        | "Drying"
        | "Weight of Sample + Dish after Drying";

    value1?: string;
    unit1?: string;

    value2?: string;
    unit2?: string;

    logBookID?: string;
};