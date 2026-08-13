import type { FatDraft } from "./FatDraft";
import type { LodDraft } from "./LodDraft";
import type { ProteinDraft } from "./ProteinDraft";
import type { SugarDraft } from "./SugarDraft";
import type { EnergyDraft } from "./EnergyDraft";
import type { CarbohydrateDraft } from "./CarbohydrateDraft";

export interface PreparationDraft {

    activeGroup: string[];

    lod?: LodDraft;

    fat?: FatDraft;

    protein?: ProteinDraft;

    sugar?: SugarDraft;

    carbohydrate?: CarbohydrateDraft;

    energy?: EnergyDraft;
}