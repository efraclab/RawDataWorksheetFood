import type { FatDraft } from "./FatDraft";
import type { LodDraft } from "./LodDraft";
import type { ProteinDraft } from "./ProteinDraft";
import type { SugarDraft } from "./SugarDraft";
import type { EnergyDraft } from "./EnergyDraft";
import type { CarbohydrateDraft } from "./CarbohydrateDraft";
import type { CrudeFiberDraft } from "./CrudeFiberDraft";
import type { PeroxideValueDraft } from "./PeroxideValueDraft";
import type { AcidValueDraft } from "./AcidValueDraft";
import type { SaponificationValueDraft } from "./SaponificationValueDraft";
import type { FreeFattyAcidDraft } from "./FreeFattyAcidDraft";
import type { UnsapMatterDraft } from "./UnsapMatterDraft";
import type { ArtificialSweetnerDraft } from "./ArtificialSweetnerDraft";
import type { PreservativeDraft } from "./PreservativeDraft";


export interface PreparationDraft {

    activeGroup: string[];

    lod?: LodDraft;

    fat?: FatDraft;

    protein?: ProteinDraft;

    sugar?: SugarDraft;

    carbohydrate?: CarbohydrateDraft;

    energy?: EnergyDraft;
    
    crudeFiber?: CrudeFiberDraft;

    peroxideValue?: PeroxideValueDraft;

    acidValue?: AcidValueDraft;

    saponificationValue?:SaponificationValueDraft;

    freeFattyAcid?:FreeFattyAcidDraft;
    
    unsapMatter?:UnsapMatterDraft;

    artificialSweetner?: ArtificialSweetnerDraft;

    preservative?: PreservativeDraft;
}