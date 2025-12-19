import type { WorksheetDetail } from "./WorksheetDetail";


export interface WorksheetResponse {
    success: boolean;
    message: string;
    data: WorksheetDetail | null;
}
