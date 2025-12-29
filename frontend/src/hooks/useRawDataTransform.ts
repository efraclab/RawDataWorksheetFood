// hooks/useRawDataTransform.ts
// React hook for managing raw data transformation

import { useState, useCallback } from 'react';
import { rawDataApi } from '../services/rawDataApi';

interface UseRawDataTransformResult {
  isTransforming: boolean;
  transformError: string | null;
  transformSuccess: boolean;
  transformAndSave: (worksheetId: string, plantCode?: string) => Promise<void>;
  previewTransform: (worksheetId: string) => Promise<{ trnRows: any[]; trn2Rows: any[] } | null>;
  checkStatus: (worksheetId: string) => Promise<any>;
  resetState: () => void;
}

export const useRawDataTransform = (): UseRawDataTransformResult => {
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformError, setTransformError] = useState<string | null>(null);
  const [transformSuccess, setTransformSuccess] = useState(false);

  /**
   * Transform and save worksheet data to master database
   */
  const transformAndSave = useCallback(async (worksheetId: string, plantCode?: string) => {
    setIsTransforming(true);
    setTransformError(null);
    setTransformSuccess(false);

    try {
      const result = await rawDataApi.transformAndSaveApprovedWorksheet(
        worksheetId,
        plantCode
      );

      if (result.success) {
        setTransformSuccess(true);
        console.log(
          `Successfully transformed: ${result.trnRowsInserted} TRN rows, ${result.trn2RowsInserted} TRN2 rows`
        );
      } else {
        setTransformError(result.message || 'Transformation failed');
      }
    } catch (error: any) {
      setTransformError(error.message || 'Failed to transform data');
      console.error('Transform error:', error);
    } finally {
      setIsTransforming(false);
    }
  }, []);

  /**
   * Preview transformation without saving
   */
  const previewTransform = useCallback(async (worksheetId: string) => {
    try {
      return await rawDataApi.previewTransformation(worksheetId);
    } catch (error: any) {
      console.error('Preview error:', error);
      return null;
    }
  }, []);

  /**
   * Check transformation status
   */
  const checkStatus = useCallback(async (worksheetId: string) => {
    try {
      return await rawDataApi.checkTransformationStatus(worksheetId);
    } catch (error: any) {
      console.error('Status check error:', error);
      return null;
    }
  }, []);

  /**
   * Reset state
   */
  const resetState = useCallback(() => {
    setIsTransforming(false);
    setTransformError(null);
    setTransformSuccess(false);
  }, []);

  return {
    isTransforming,
    transformError,
    transformSuccess,
    transformAndSave,
    previewTransform,
    checkStatus,
    resetState,
  };
};