export interface Instrument {
  id: string;
  name: string;
  sl_No?: string | null;
  make?: string | null;
  instrumentTag?: string | null;
  purchaseDate?: string | null;
  labName?: string | null;
  warrenty_UOTO?: string | null;
  amc_UPTO?: string | null;
  cmc_UPTO?: string | null;
  calibrationDoneDate?: string | null;
  calibrationDueDate?: string | null;
  calibrationAgency?: string | null;
}
