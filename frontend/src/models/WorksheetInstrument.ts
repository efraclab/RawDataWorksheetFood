
export interface WorksheetInstrument {
    id: number | null;
    parameterId: number;
    instrumentId: string | null;
    name: string | null;
    make: string | null;
    instrumentTag: string | null;
    calibrationDoneDate: string | null;
    calibrationDueDate: string | null;
}
