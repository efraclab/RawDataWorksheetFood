import type { RawDataTrn2Record } from "./RawDataTrn2Record";
import type { RawDataTrnRecord } from "./RawDataTrnRecord";

interface ExtractedWorksheetData {
  tblRawdataTrn: RawDataTrnRecord[];
  tblRawdataTrn2: RawDataTrn2Record[];
}
