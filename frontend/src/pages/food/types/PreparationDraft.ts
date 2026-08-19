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
import type { NotsDraft } from "./NotsDraft";
import type { ArtificialColourDraft } from "./ArtificialColourDraft";
import type { UricAcidDraft } from "./UricAcidDraft";
import type { FSVDraft } from "./FSVDraft";
import type { FattyAcidProfileDraft } from "./FattyAcidProfileDraft";
import type { SulphurDioxideDraft } from "./SulphurDioxideDraft";
import type { CholesterolDraft } from "./CholesterolDraft";
import type { WsvDraft } from "./WsvDraft";
import type { AminoAcidDraft } from "./AminoAcidDraft";
import type { MoistureDraft } from "./MoistureDraft";
import type { AcidityDraft } from "./AcidityDraft";
import type { SugarSaponinCatechinProfileDraft } from "./SugarSaponinCatechinProfileDraft";
import type { DietaryFiberDraft } from "./DietaryFiberDraft";

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

    nots?: NotsDraft;

    artificialColour?: ArtificialColourDraft;
    
    uricAcid?: UricAcidDraft;

    fsv?: FSVDraft;

    fattyAcidProfile?: FattyAcidProfileDraft;

    sulphurDioxide?: SulphurDioxideDraft;

    cholesterol?: CholesterolDraft;

    wsv?: WsvDraft;

    aminoAcid?: AminoAcidDraft;

    moisture?: MoistureDraft;

    acidity?: AcidityDraft;

    sugarSaponinCatechinProfile?: SugarSaponinCatechinProfileDraft;

    dietaryFiber?: DietaryFiberDraft;
}