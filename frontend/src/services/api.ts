import axios from 'axios';
import type { Chemical } from '../preparation_models/Chemical';
import type { Instrument } from '../preparation_models/Instrument';
import type { SampleData } from '../models/SampleData';
import type { Standard } from '../preparation_models/Standard';
import type { WorksheetDetail } from '../models/WorksheetDetail';
import type { WorksheetSummary } from '../models/WorksheetSummary';
import type { WorksheetRequest } from '../models/WorksheetRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { Analyst } from '../models/Analyst';
import type { FetchWorksheetRequest } from '../models/FetchWorksheetRequest';
import type { ParameterDetail } from '../models/ParameterDetail';
import type { WorksheetDbPayload } from '../helpers/WorksheetDbPayload';
import type { SmapleDetailsRequest } from '../models/SmapleDetailsRequest';
import type { WorksheetLogRequest } from '../models/WorksheetLogRequest';
import type { Media } from '../preparation_models/Media';


const API_BASE_URL = 'http://localhost:5162/api';

export async function login(
  payload: LoginRequest
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Login failed: ${error.message}`
      );
    }
    throw new Error("An unexpected error occurred during login.");
  }
}


export const fetchSample = async (request: SmapleDetailsRequest): Promise<SampleData[]> => {
  if (!request || !request.regNo) {
    throw new Error("Registration Number is required.");
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/sample-details`, request,
    { headers: { "Content-Type": "application/json" } });
    const data = response.data;
    if (Array.isArray(data)) return data as SampleData[];
    return [];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch samples for ${request.regNo}: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// export const fetchColumns = async (): Promise<Column[]> => {
//   try {
//     const response = await axios.get<Column[]>(`${API_BASE_URL}/columns`);
//     return response.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.error || `Failed to fetch columns: ${error.message}`);
//     } else {
//       throw new Error(`An unexpected error occurred: ${error.message}`);
//     }
//   }
// };


export const createWorksheet = async (
  worksheetData: WorksheetRequest
): Promise<{ worksheetId: string }> => {
  try {
    const response = await axios.post<{ worksheetId: string }>(
      `${API_BASE_URL}/worksheets`,
      worksheetData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to create worksheet: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const updateWorksheet = async (
  worksheetId: string,
  worksheetData: WorksheetRequest
): Promise<{ worksheetId: string }> => {
  if (!worksheetId) {
    throw new Error("Worksheet ID is required.");
  }

  try {
    const response = await axios.put<{ worksheetId: string }>(
      `${API_BASE_URL}/worksheets/${worksheetId}`,
      worksheetData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to update worksheet: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};


export const addParameter = async (
  worksheetId: string,
  parameterDetail: ParameterDetail
): Promise<{ parameterId: number }> => {
  if (!worksheetId) {
    throw new Error("Worksheet ID is required.");
  }

  try {
    const response = await axios.post<{ worksheetId: string }>(
      `${API_BASE_URL}/worksheets/parameters/${worksheetId}`,
      parameterDetail,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to add parameter: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const updateParameter = async (
  parameterId: number,
  parameterData: ParameterDetail
): Promise<{ parameterId: number }> => {
  if (!parameterId) {
    throw new Error("Parameter ID is required.");
  }

  try {
    const response = await axios.put<{ parameterId: number }>(
      `${API_BASE_URL}/worksheets/parameters/${parameterId}`,
      parameterData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to update parameter: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
  
};


export const fetchWorksheetById = async (
  worksheetId: string,
  request: FetchWorksheetRequest
): Promise<WorksheetDetail | null> => {
  if (!worksheetId) {
    throw new Error("Worksheet ID is required.");
  }

  try {
    const response = await axios.post<WorksheetDetail>(`${API_BASE_URL}/worksheets/get/${worksheetId}`, request);
    const data = response.data;
    if (!data) return null;
    if (data.sample || data.parameters) return data as WorksheetDetail;
    return null;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) return null;
      throw new Error(
        error.response?.data?.message ||
        `Failed to fetch worksheet: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};


export const fetchAllWorksheets = async (
  request: FetchWorksheetRequest
): Promise<WorksheetSummary[]> => {
  try {
    const url = `${API_BASE_URL}/worksheets/get-all`;

    const response = await axios.post<WorksheetSummary[]>(url, request);
    const data = response.data;

    if (Array.isArray(data)) return data as WorksheetSummary[];
  
    return [];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to fetch worksheets: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const deleteWorksheet = async (worksheetId: string): Promise<void> => {
  if (!worksheetId) {
    throw new Error("Worksheet ID is required.");
  }

  try {
    await axios.delete(`${API_BASE_URL}/worksheets/${worksheetId}`);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to delete worksheet: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const deleteParameter = async (parameterId: number): Promise<void> => {
  if (!parameterId) {
    throw new Error("Parameter ID is required.");
  }

  try {
    await axios.delete(`${API_BASE_URL}/worksheets/parameters/${parameterId}`);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to delete parameter: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const submitWorksheet = async (
  worksheet: WorksheetDbPayload
): Promise<{ success: boolean; message?: string }> => {
  if (!worksheet) throw new Error("Worksheet data is required.");

  try {
    const response = await axios.post<{ success: boolean; message?: string }>(
      `${API_BASE_URL}/raw-data/save`, worksheet,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Failed to submit worksheet: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const fetchAnalysts = async (
): Promise<Analyst[]> => {
  try {
    const url = `${API_BASE_URL}/worksheets/analysts`;

    const response = await axios.get(url);
    const data = response.data;

    if (Array.isArray(data)) return data as Analyst[];
    if (data && Array.isArray(data.data)) return data.data as Analyst[];

    return [];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to fetch analysts: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

// ========== WORKSHEET LOG API FUNCTIONS ==========

export const insertWorksheetLog = async (
  payload: WorksheetLogRequest
): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_BASE_URL}/logs`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to insert log: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};


// ========== CHEMICAL API FUNCTIONS ==========

export const addChemical = async (payload: Chemical): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/chemicals`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to add chemical: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const updateChemical = async (payload: Chemical): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/chemicals`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to update chemical: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const deleteChemical = async (slNo: string): Promise<void> => {
  if (!slNo) throw new Error("Chemical serial number is required.");

  try {
    await axios.delete(`${API_BASE_URL}/chemicals/${slNo}`);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to delete chemical: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};


// ========== INSTRUMENT API FUNCTIONS ==========

export const addInstrument = async (payload: Instrument): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/instruments`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to add instrument: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const updateInstrument = async (payload: Instrument): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/instruments`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to update instrument: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const deleteInstrument = async (id: string): Promise<void> => {
  if (!id) throw new Error("Instrument ID is required.");

  try {
    await axios.delete(`${API_BASE_URL}/instruments/${id}`);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to delete instrument: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};


// ========== STANDARD API FUNCTIONS ==========

export const addStandard = async (payload: Standard): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/standards`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to add standard: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const updateStandard = async (payload: Standard): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/standards`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to update standard: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const deleteStandard = async (serialNo: string): Promise<void> => {
  if (!serialNo) throw new Error("Standard serial number is required.");

  try {
    await axios.delete(`${API_BASE_URL}/standards/${serialNo}`);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        `Failed to delete standard: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};


export const getInstruments = async (): Promise<Instrument[]> => {
  try {
    const response = await axios.get<Instrument[]>(`${API_BASE_URL}/instruments`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch instruments: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const getChemicals = async (): Promise<Chemical[]> => {
  try {
    const response = await axios.get<Chemical[]>(`${API_BASE_URL}/chemicals`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch chemicals: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const getStandards = async (): Promise<Standard[]> => {
  try {
    const response = await axios.get<Standard[]>(`${API_BASE_URL}/standards`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch standards: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const getMedia = async (): Promise<Media[]> => {
  try {
    const response = await axios.get<Media[]>(`${API_BASE_URL}/media`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch media: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const addMedia = async (payload: Media): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/media`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Failed to add media: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const updateMedia = async (payload: Media): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/media`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Failed to update media: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};

export const deleteMedia = async (id: number): Promise<void> => {
  if (!id) throw new Error("Media ID is required.");
  try {
    await axios.delete(`${API_BASE_URL}/media/${id}`);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Failed to delete media: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};


// ========== AI REVIEW API ==========

const LIMS_AI_BASE_URL = 'https://localhost:7278/api';

export const AI_REVIEW_PROMPT =
`You are a GxP-compliant laboratory data integrity auditor operating within a regulated pharmaceutical LIMS (Laboratory Information Management System). Your role is to perform a structured data quality review of raw analytical worksheet records prior to QA submission, in accordance with ICH Q10, 21 CFR Part 11, and WHO GMP data integrity guidelines.

You will receive a JSON object representing a lab worksheet — including sample metadata, test parameters, preparation records, instruments, chemicals, standards, and media used.

Your task is to identify and classify data quality issues into:
- ERRORS: Definite data integrity violations — missing required values in completed records, logical impossibilities (e.g. createdAt after dueDate), organism/method/media mismatches, malformed identifiers.
- WARNINGS: Potential compliance concerns — non-specific analyst identifiers, inconsistent formatting, missing reference standards for identification tests, traceability gaps.

For each issue, report:
- field: the JSON path or descriptive location of the issue
- message: a clear, user-understandable explanation of the problem

Also provide:
- isValid: boolean (false if any ERRORs exist)
- summary: one concise sentence summarising the overall audit finding

Respond ONLY with a valid JSON object in this exact structure:
{
  "isValid": true|false,
  "errors": [{ "field": "...", "message": "..." }],
  "warnings": [{ "field": "...", "message": "..." }],
  "summary": "..."
}

Do not include any text outside the JSON object.`;

export interface AiReviewIssue {
  field: string;
  message: string;
}

export interface AiReviewResult {
  isValid: boolean;
  errors: AiReviewIssue[];
  warnings: AiReviewIssue[];
  summary: string;
}

export interface AiReviewPayload {
  source: string;
  operation: string;
  prompt: string;
  data: {
    sample: any;
    parameters: any[];
  };
}

export const reviewWorksheetWithAI = async (
  payload: AiReviewPayload
): Promise<AiReviewResult> => {
  try {
    console.log("[AI Review] Sending payload to", `${LIMS_AI_BASE_URL}/lims/process`, payload);
    const response = await axios.post<any>(
      `${LIMS_AI_BASE_URL}/lims/process`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    const result = response.data?.result;
    if (result && typeof result === "object" && "isValid" in result) {
      return {
        isValid: result.isValid ?? true,
        errors: Array.isArray(result.errors) ? result.errors : [],
        warnings: Array.isArray(result.warnings) ? result.warnings : [],
        summary: result.summary ?? "",
      };
    }
    throw new Error("Unexpected response format from AI service");
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || `AI review failed: ${error.message}`
      );
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }
};