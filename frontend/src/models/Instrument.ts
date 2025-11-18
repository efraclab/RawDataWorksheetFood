export interface Instrument {
  id: string;
  name: string;
  tag: string;
  calibrationDoneDate: string;
  calibrationDueDate?: string;
}