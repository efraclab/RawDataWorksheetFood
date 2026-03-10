export interface AttachedFile {
  id: number;
  fileName: string;
  fileDataBase64?: string | null;
  preparationType: string | null;
  label: string | null;
}