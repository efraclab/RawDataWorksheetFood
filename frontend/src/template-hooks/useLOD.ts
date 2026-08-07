import { useState } from "react";

import type { SamplePreparationLod } from "../preparation_models/drugs/SamplePreparationLod";
import type { CalculationLod } from "../preparation_models/drugs/CalculationLod";

export default function useLOD() {

    const [samplePreparations, setSamplePreparations] =
        useState<SamplePreparationLod[]>([]);

    const [calculations, setCalculations] =
        useState<CalculationLod[]>([]);

    return {

        samplePreparations,

        setSamplePreparations,

        calculations,

        setCalculations

    };

}