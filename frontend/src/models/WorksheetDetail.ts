import type { ParameterDetail } from "./ParameterDetail";
import type { WorksheetSummary } from "./WorksheetSummary";

export interface WorksheetDetail {
    sample: WorksheetSummary;
    parameters: ParameterDetail[];
}
