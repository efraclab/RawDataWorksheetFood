import type { PreparationDraft } from "./PreparationDraft";
import type { ParameterDetail } from "../../../models/ParameterDetail";

export interface PreparationEngineHandle {

    collectDraft(): PreparationDraft;

    loadDraft(draft: PreparationDraft): void;

    restoreFromWorksheet(parameter: ParameterDetail): void;
}