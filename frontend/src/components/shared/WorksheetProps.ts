import type { Instrument } from "../../preparation_models/Instrument";
import type { Standard } from "../../preparation_models/Standard";
import type { Chemical } from "../../preparation_models/Chemical";

import type { WorksheetDetail } from "../../models/WorksheetDetail";
import type { Analyst } from "../../models/Analyst";
import type { SampleData } from "../../models/SampleData";

import type {
    WorksheetSidebarState,
    WorksheetSidebarActions,
} from "./WorksheetSidebar";

export interface WorksheetProps {
    worksheetId: string;
    instruments: Instrument[];
    standards: Standard[];
    chemicals: Chemical[];
    isReferenceDataLoading: boolean;
    referenceDataError: string | null;
    employeeId: string;
    role: string;
    department: string;
    onPrint?: (
        info: WorksheetDetail,
        analysts: Analyst[],
        sampleData: SampleData,
    ) => void;
    onSidebarStateChange?: (state: WorksheetSidebarState) => void;
    onSidebarActionsReady?: (actions: WorksheetSidebarActions) => void;
}