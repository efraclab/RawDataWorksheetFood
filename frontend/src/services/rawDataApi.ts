// services/rawDataApi.ts
// API service for handling raw data transformation and submission

import { RawDataTransformer } from './RawDataTransformer';

const API_BASE_URL = 'http://localhost:5000/api';

interface TransformAndSaveRequest {
  worksheetId: string;
  plantCode?: string; // Optional plant code if not in worksheet data
}

interface TransformAndSaveResponse {
  success: boolean;
  message: string;
  trnRowsInserted: number;
  trn2RowsInserted: number;
  errors?: string[];
}

/**
 * API Service for Raw Data Operations
 */
export const rawDataApi = {
  /**
   * Transform and save approved worksheet data to master database
   * This should be called after HOD approves the worksheet
   */
  transformAndSaveApprovedWorksheet: async (
    worksheetId: string,
    plantCode?: string
  ): Promise<TransformAndSaveResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/worksheets/${worksheetId}/transform-to-raw-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plantCode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to transform and save data');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error transforming worksheet to raw data:', error);
      throw new Error(error.message || 'Failed to transform and save worksheet data');
    }
  },

  /**
   * Preview transformation without saving (useful for validation)
   */
  previewTransformation: async (worksheetId: string): Promise<{
    trnRows: any[];
    trn2Rows: any[];
  }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/worksheets/${worksheetId}/preview-raw-data`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to preview transformation');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error previewing transformation:', error);
      throw new Error(error.message || 'Failed to preview transformation');
    }
  },

  /**
   * Check if worksheet data has already been transformed
   */
  checkTransformationStatus: async (worksheetId: string): Promise<{
    isTransformed: boolean;
    transformedAt?: string;
    trnRowCount: number;
    trn2RowCount: number;
  }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/worksheets/${worksheetId}/raw-data-status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check transformation status');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error checking transformation status:', error);
      throw new Error(error.message || 'Failed to check transformation status');
    }
  },
};

/**
 * Client-side transformation function (for preview/validation)
 */
export const transformWorksheetClientSide = (
  worksheetData: any,
  instruments: any[],
  chemicals: any[],
  standards: any[]
) => {
  return RawDataTransformer.transformWorksheetToRawData(
    worksheetData,
    instruments,
    chemicals,
    standards
  );
};