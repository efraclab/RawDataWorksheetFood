import type { ParameterDetail } from "./ParameterDetail";
import type { SamplePreparationLod } from "../preparation_models/drugs/SamplePreparationLod";
import type { CalculationLod } from "../preparation_models/drugs/CalculationLod";

export interface FoodTemplateContext {

    parameter: ParameterDetail;

    role: string;

    samplePreparationLodPerParam: Record<number, SamplePreparationLod[]>;

    calculationLodPerParam: Record<number, CalculationLod[]>;

    handleSamplePreparationLodStepChange: (
        parameterId: number,
        samplePreparationLodId: number,
        stepName: string,
        field: string,
        value: string
    ) => void;

    handleRemoveSamplePreparationLod: (
        parameterId: number,
        samplePreparationLodId: number
    ) => void;

    handleCalculationLodFieldChange: (
        parameterId: number,
        calculationId: number,
        field: string,
        value: string
    ) => void;

    handleRemoveCalculationLod: (
        parameterId: number,
        calculationId: number
    ) => void;
}