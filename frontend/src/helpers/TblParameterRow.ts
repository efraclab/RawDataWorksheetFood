export interface TblParameterRow {
  WorksheetId: string;
  ParameterCode: string;
  ParameterName: string;
  MethodCode: string;
  MethodName: string;
  ColumnId: string | null;
  OtherInfo: string | null;
  ParameterAnalyzedBy: string | null;
  ParameterStatus: string;
  AnalysisStartedAt?: string | null;
  AnalysisCompletedAt?: string | null;
  // Reviewer approval
  ApprovedByReviewer: string | null;
  ApprovedAtReviewer: string | null;
  // QA validation
  ApprovedByQA: string | null;
  ApprovedAtQA: string | null;
  // Remarks
  RemarksByQA: string | null;
  RemarksByReviewer: string | null;
}