import type { ParameterDetail } from "./ParameterDetail";
import type { WorksheetLog } from "./WorksheetLog";
import type { WorksheetSummary } from "./WorksheetSummary";

export interface WorksheetDetail {
    sample: WorksheetSummary;
    parameters: ParameterDetail[];
    logs: WorksheetLog[];
}
