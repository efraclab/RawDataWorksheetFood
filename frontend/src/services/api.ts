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
import type { ParameterDetail } from '../models/ParameterDetail';
import type { WorksheetDbPayload } from '../helpers/WorksheetDbPayload';


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
    console.log(data)
    if (Array.isArray(data)) return data as SampleData[];
    return [];
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch samples for ${regNo}: ${error.message}`);
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

  console.log("Updating worksheet with ID:", worksheetData);

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
    //console.log("instruments", response.data);
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
    //console.log("chemicals", response.data);
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
    //console.log("standards", response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch standards: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};
