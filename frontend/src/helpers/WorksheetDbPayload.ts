import type { TblCalculationRow } from "./TblCalculationRow";
import type { TblPreparationRow } from "./TblPreparationRow";
import type { TblReferenceRow } from "./TblReferenceRow";
import type { TblParameterRow } from "./TblParameterRow";
import type { TblWorksheetRow } from "./TblWorksheetRow";



export interface WorksheetDbPayload {
  worksheet: TblWorksheetRow;
  parameters: TblParameterRow[];
  references: TblReferenceRow[];
  preparations: TblPreparationRow[];
  calculations: TblCalculationRow[];
}
