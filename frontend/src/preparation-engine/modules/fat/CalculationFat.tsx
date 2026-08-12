import type { CalculationBase } from "../../models/CalculationBase";

export interface CalculationFat extends CalculationBase {

    w1: string | null;
    w2: string | null;
    w3: string | null;
}