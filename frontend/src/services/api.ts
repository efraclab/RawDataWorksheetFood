import axios from 'axios';
import type { Chemical } from '../preparation_models/Chemical';
import type { Column } from '../preparation_models/Column';
import type { Instrument } from '../preparation_models/Instrument';
import type { SampleData } from '../preparation_models/SampleData';
import type { Standard } from '../preparation_models/Standard';
import type { WorksheetDetail } from '../models/WorksheetDetail';
import type { WorksheetSummary } from '../models/WorksheetSummary';
import type { WorksheetRequest } from '../models/WorksheetRequest';
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { Analyst } from '../models/Analyst';
import type { FetchWorksheetRequest } from '../models/FetchWorksheetRequest';
import type { WorksheetParameter } from '../models/WorksheetParameter';
import type { ParameterDetail } from '../models/ParameterDetail';


const API_BASE_URL = 'http://192.168.3.116:5076/api';

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

    console.log("Login response:", response.data);
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


export const fetchSample = async (regNo: string): Promise<SampleData[]> => {
  if (!regNo) {
    throw new Error("Registration Number is required.");
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/sample-details`, regNo,
    { headers: { "Content-Type": "application/json" } });
    const data = response.data;
    if (Array.isArray(data)) return data as SampleData[];
    if (data && Array.isArray(data.data)) return data.data as SampleData[];
    return [];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch samples for ${regNo}: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const fetchInstruments = async (): Promise<Instrument[]> => {
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

export const fetchChemicals = async (): Promise<Chemical[]> => {
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

export const fetchStandards = async (): Promise<Standard[]> => {
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

export const fetchColumns = async (): Promise<Column[]> => {
  try {
    const response = await axios.get<Column[]>(`${API_BASE_URL}/columns`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch columns: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

// ========== WORKSHEET API FUNCTIONS ==========

// ========== WORKSHEET API FUNCTIONS (UPDATED) ==========

/**
 * Create a new worksheet
 * POST /api/worksheets
 * returns: { worksheetId }
 */
export const createWorksheet = async (
  worksheetData: WorksheetRequest
): Promise<{ worksheetId: string }> => {
  try {
    console.log("Creating worksheet with data:", worksheetData);
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
    console.log("Updating worksheet with ID:", worksheetId, "and data:", worksheetData);
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

export const updateParameter = async (
  parameterId: number,
  parameterData: ParameterDetail
): Promise<{ parameterId: number }> => {
  if (!parameterId) {
    throw new Error("Parameter ID is required.");
  }

  try {
    console.log("Updating parameter with ID:", parameterId, "and data:", parameterData);
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
    console.log("Fetched worksheet detail (raw):", data);
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
    console.log("Fetched worksheets:", data);

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
    console.log("Deleting parameter with ID:", parameterId);
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
  registrationNo: string
): Promise<{ success: boolean; message?: string }> => {
  if (!registrationNo) throw new Error("Registration number is required.");

  try {
    const response = await axios.post<{ success: boolean; message?: string }>(
      `${API_BASE_URL}/worksheets/submit/${registrationNo}`
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
    console.log("Fetched analysts:", data);

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
