import type { BufferPreparationStep } from "./BufferPreparationStep";

export interface BufferPreparation {
  id: number;
  label: string;
  steps: BufferPreparationStep[];
}