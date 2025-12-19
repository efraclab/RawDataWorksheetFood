export interface SampleData {
  registrationNo: string;
  sampleName: string;
  lab: string;
  parameter: string;
  paraCode: string;
  methodName: string;
  methodCode: string;
  registrationDate: string;
  mailingDate: string | null;
  tatDate: string;
  analysisStartDate: string;
  analysisCompletionDate: string | null;
  distributedRegisVal: string | null;
  status: string;
}
