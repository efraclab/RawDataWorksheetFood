import axios from 'axios';
import type { SampleData } from '../models/SampleData';
import type { Instrument } from '../models/Instrument';
import type { Chemical } from '../models/Chemical';
import type { Standard } from '../models/Standard';
import type { Column } from '../models/Column';

const API_BASE_URL = 'https://192.168.3.116:7078/api';


export const fetchSamples = async (regNo: string): Promise<SampleData[]> => {
  if (!regNo) {
    throw new Error("Registration Number is required.");
  }
  
  try {
    const response = await axios.post<SampleData[]>(`${API_BASE_URL}/sample-details`, regNo,
    { headers: { "Content-Type": "application/json" } });
    return response.data;
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
      throw new Error(error.response?.data?.error || `Failed to fetch samples instruments: ${error.message}`);
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
      throw new Error(error.response?.data?.error || `Failed to fetch chemicals instruments: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const fetchStandards= async (): Promise<Standard[]> => {
  
  try {
    const response = await axios.get<Standard[]>(`${API_BASE_URL}/standards`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch standards instruments: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

export const fetchColumns= async (): Promise<Column[]> => {
  
  try {
    const response = await axios.get<Column[]>(`${API_BASE_URL}/columns`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Failed to fetch columns instruments: ${error.message}`);
    } else {
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};