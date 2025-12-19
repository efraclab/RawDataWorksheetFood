import type { WorksheetDetail } from "./requests/WorksheetDetail";


export interface WorksheetResponse {
    success: boolean;
    message: string;
    data: WorksheetDetail | null;
}
