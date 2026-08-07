import type { ParameterDetail } from "../../../models/ParameterDetail";

export interface PreparationModuleHandle {

    getDraft(): any;

    loadDraft(draft: any): void;

    restoreFromWorksheet(parameter: ParameterDetail): void;

}