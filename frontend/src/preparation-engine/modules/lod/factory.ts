import type { SamplePreparationLod } from "./models/SamplePreparationLod";
import type { CalculationLod } from "./models/CalculationLod";

export const createNewSamplePreparationLod = (
  index: number,
): SamplePreparationLod => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Weight of Empty Dish", value1: "", unit1: "g", logBookID: "" },
    { name: "Weight of Sample + Dish", value1: "", unit1: "g", logBookID: "" },
    {
      name: "Drying",
      value1: "",
      unit1: "°C",
      value2: "",
      unit2: "min",
      logBookID: "",
    },
    { name: "Weight of Sample + Dish after Drying", value1: "", unit1: "g", logBookID: "" },
  ],
});

export const createNewCalculationLod = (index: number): CalculationLod => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  w1_emptyDish: "",
  w2_dishWithSample: "",
  w3_dishAfterIgnition: "",
  calculationResult: null,
  calculationResultUnit: null,
  w1: null,
  w2: null,
  w3: null,
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});