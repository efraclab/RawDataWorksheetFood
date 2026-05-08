import type { SamplePreparationMetal } from "./SamplePreparationMetal";

const DILUTION_STEPS_WITH_TWO_VALUES = ["2nd Dilution", "3rd Dilution", "4th Dilution"];

/** Returns an array of error messages for incomplete dilution steps (empty = valid). */
export function getMetalPrepDilutionErrors(prep: SamplePreparationMetal): string[] {
  const errors: string[] = [];
  const steps = Array.isArray(prep.steps) ? prep.steps : [];
  for (const step of steps) {
    if (!DILUTION_STEPS_WITH_TWO_VALUES.includes(step.name)) continue;
    const hasV1 = !!(step.value1 && step.value1.trim() !== "");
    const hasV2 = !!(step.value2 && step.value2.trim() !== "");
    if (hasV1 && !hasV2) errors.push(`${step.name}: "dilute to" volume is missing`);
    if (!hasV1 && hasV2) errors.push(`${step.name}: "take" volume is missing`);
  }
  return errors;
}

/** True when every dilution step with two values is either fully filled or fully empty. */
export function isMetalPrepDilutionValid(prep: SamplePreparationMetal): boolean {
  return getMetalPrepDilutionErrors(prep).length === 0;
}

/** True if ALL preps in the array are valid. */
export function areAllMetalPrepsDilutionValid(preps: SamplePreparationMetal[]): boolean {
  return preps.every(isMetalPrepDilutionValid);
}
