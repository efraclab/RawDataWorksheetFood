import type { CalculationBase } from "../../../models/CalculationBase";

export interface CalculationLod extends CalculationBase {

    w1_emptyDish: string;
    w2_dishWithSample: string;
    w3_dishAfterIgnition: string;

    w1: string | null;
    w2: string | null;
    w3: string | null;
}