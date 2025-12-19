import type { WorksheetSummary } from "./WorksheetSummary";


export interface WorksheetListResponse {
    success: boolean;
    message: string;
    data: WorksheetSummary[] | null;
}
