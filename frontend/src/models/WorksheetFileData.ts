export interface WorksheetFileData {
  id: number;
  parameterId?: number;
  preparationType: string | null;
  label: string | null;
  fileName: string;
  fileDataBase64?: string | null;
  uploadedAt?: string;
}
