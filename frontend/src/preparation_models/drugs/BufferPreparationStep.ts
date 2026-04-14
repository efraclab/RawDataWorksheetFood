export interface BufferPreparationStep {
    name: "Weighing/Measuring" | "PH";
    value1: string;
    unit1: string;
    logBookID?: string;
    solventChemical?: string;
}
