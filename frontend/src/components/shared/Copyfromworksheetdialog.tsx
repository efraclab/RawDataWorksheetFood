import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WorksheetInstrument } from "../../models/WorksheetInstrument";
import type { WorksheetChemical } from "../../models/WorksheetChemical";
import type { WorksheetStandard } from "../../models/WorksheetStandard";
import type { WorksheetDetail } from "../../models/WorksheetDetail";
import type { FetchWorksheetRequest } from "../../models/FetchWorksheetRequest";
import {
  fetchWorksheetById,
  fetchRelatedWorksheetsBySample,
  type RelatedWorksheetSuggestion,
} from "../../services/api";

export interface CopiedWorksheetData {
  instruments: WorksheetInstrument[];
  chemicals: WorksheetChemical[];
  standards: WorksheetStandard[];
}

interface CopyFromWorksheetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** Worksheet currently open — used to exclude itself from suggestions and to block self-copy */
  currentWorksheetId: string;
  /** Sample name of the current worksheet, used to find related worksheet ids */
  sampleName?: string;
  /** Parameter that copied data should be attached to */
  targetParameterId: number;
  /** Passed straight through to fetchWorksheetById (e.g. { employeeId, role }) */
  fetchRequest: FetchWorksheetRequest;
  /** Set to false for worksheets (e.g. Micro) that have no Standards section */
  includeStandards?: boolean;
  /** Ids already present on the current parameter, so we can skip duplicates and show a helpful count */
  existingInstrumentIds?: string[];
  existingChemicalIds?: string[];
  existingStandardIds?: string[];
  onImport: (data: CopiedWorksheetData) => void;
}

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={(className ?? "") + " animate-spin"}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/** Dedupe an array of objects on a key, keeping the first occurrence */
function dedupeBy<T>(items: T[], keyOf: (item: T) => string | number | null | undefined) {
  const seen = new Set<string | number>();
  const result: T[] = [];
  for (const item of items) {
    const key = keyOf(item);
    if (key === null || key === undefined) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

/**
 * Trigger button + modal dialog that lets an analyst pull Instruments,
 * Reagents/Chemicals, and Standards details from another worksheet
 * (typically one for the same sample) into the currently selected parameter.
 */
export const CopyFromWorksheetDialog: React.FC<CopyFromWorksheetDialogProps> = ({
  isOpen,
  onClose,
  currentWorksheetId,
  sampleName,
  targetParameterId,
  fetchRequest,
  includeStandards = true,
  existingInstrumentIds = [],
  existingChemicalIds = [],
  existingStandardIds = [],
  onImport,
}) => {
  const [worksheetIdInput, setWorksheetIdInput] = useState("");
  const [suggestions, setSuggestions] = useState<RelatedWorksheetSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CopiedWorksheetData | null>(null);
  const [previewWorksheetId, setPreviewWorksheetId] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setWorksheetIdInput("");
    setError(null);
    setPreview(null);
    setPreviewWorksheetId(null);
  }, []);

  // Load 2-3 related worksheet id suggestions for the same sample name
  useEffect(() => {
    if (!isOpen) return;
    resetState();

    if (!sampleName) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    setIsLoadingSuggestions(true);
    setSuggestionsError(null);

    fetchRelatedWorksheetsBySample(sampleName, currentWorksheetId, fetchRequest)
      .then((results) => {
        if (cancelled) return;
        setSuggestions((results || []).slice(0, 3));
      })
      .catch((err: any) => {
        if (cancelled) return;
        setSuggestionsError(err?.message || "Could not load related worksheets");
        setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSuggestions(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sampleName, currentWorksheetId]);

  const extractFromWorksheet = (worksheet: WorksheetDetail): CopiedWorksheetData => {
    const allInstruments: WorksheetInstrument[] = [];
    const allChemicals: WorksheetChemical[] = [];
    const allStandards: WorksheetStandard[] = [];

    (worksheet.parameters || []).forEach((param: any) => {
      if (Array.isArray(param.instruments)) allInstruments.push(...param.instruments);
      if (Array.isArray(param.chemicals)) allChemicals.push(...param.chemicals);
      if (Array.isArray(param.standards)) allStandards.push(...param.standards);
    });

    return {
      instruments: dedupeBy(allInstruments, (i) => i.instrumentId).map((i) => ({
        ...i,
        id: null,
        parameterId: targetParameterId,
      })),
      chemicals: dedupeBy(allChemicals, (c) => c.slno).map((c) => ({
        ...c,
        id: null,
        parameterId: targetParameterId,
      })),
      standards: includeStandards
        ? dedupeBy(allStandards, (s) => s.serialNo).map((s) => ({
            ...s,
            id: null,
            parameterId: targetParameterId,
          }))
        : [],
    };
  };

  const handleFetchPreview = async (idOverride?: string) => {
    const idToFetch = (idOverride ?? worksheetIdInput).trim();
    if (!idToFetch) {
      setError("Enter a worksheet ID to continue.");
      return;
    }
    if (idToFetch === currentWorksheetId) {
      setError("That's the worksheet you're already on — pick a different one.");
      return;
    }

    setIsFetchingDetail(true);
    setError(null);
    setPreview(null);
    try {
      const worksheet = await fetchWorksheetById(idToFetch, fetchRequest);
      if (!worksheet || !worksheet.parameters) {
        setError(`No data found for worksheet "${idToFetch}".`);
        return;
      }
      const data = extractFromWorksheet(worksheet);
      if (
        data.instruments.length === 0 &&
        data.chemicals.length === 0 &&
        data.standards.length === 0
      ) {
        setError(`Worksheet "${idToFetch}" has no instrument, chemical, or standard details to copy.`);
        return;
      }
      setPreview(data);
      setPreviewWorksheetId(idToFetch);
    } catch (err: any) {
      setError(err?.message || `Failed to fetch worksheet "${idToFetch}".`);
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleConfirmImport = () => {
    if (!preview) return;
    onImport(preview);
    resetState();
    onClose();
  };

  const newInstrumentCount = preview
    ? preview.instruments.filter(i => {
        const id = i.instrumentId;
        return id !== null && !existingInstrumentIds.includes(id);
      }).length
    : 0;
  const newChemicalCount = preview
    ? preview.chemicals.filter(c => {
        const id = c.slno;
        return id !== null && !existingChemicalIds.includes(id);
      }).length
    : 0;
 const newStandardCount = preview
    ? preview.standards.filter(s => {
        const id = s.serialNo;
        return id !== null && !existingStandardIds.includes(id);
      }).length
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <CopyIcon className="w-4 h-4" />
                Copy Details from Another Worksheet
              </h3>
              <button
                onClick={() => {
                  resetState();
                  onClose();
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600">
                Pulls Instruments{includeStandards ? ", Reagents/Chemicals, and Standards" : " and Reagents/Chemicals"} details
                from another worksheet into this parameter.
              </p>

              {/* Manual input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Worksheet ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={worksheetIdInput}
                    onChange={(e) => {
                      setWorksheetIdInput(e.target.value);
                      setPreview(null);
                      setError(null);
                    }}
                    placeholder="e.g. WS-2026-00123"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleFetchPreview()}
                    disabled={isFetchingDetail || !worksheetIdInput.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isFetchingDetail ? (
                      <LoaderIcon className="w-4 h-4" />
                    ) : (
                      "Fetch"
                    )}
                  </button>
                </div>
              </div>

              {/* Related worksheet suggestions (same sample name) */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">
                  {sampleName
                    ? `Related worksheets for this sample`
                    : "Related worksheets"}
                </p>
                {isLoadingSuggestions && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
                    <LoaderIcon className="w-4 h-4" />
                    Looking for related worksheets…
                  </div>
                )}
                {!isLoadingSuggestions && suggestionsError && (
                  <p className="text-xs text-amber-600">{suggestionsError}</p>
                )}
                {!isLoadingSuggestions && !suggestionsError && suggestions.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No other worksheets found for this sample yet.
                  </p>
                )}
                {!isLoadingSuggestions && suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s.worksheetId}
                        onClick={() => {
                          setWorksheetIdInput(s.worksheetId);
                          setPreview(null);
                          setError(null);
                          handleFetchPreview(s.worksheetId);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          previewWorksheetId === s.worksheetId
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        }`}
                        title={s.parameterName ? `Parameter: ${s.parameterName}` : undefined}
                      >
                        {s.worksheetId}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {error}
                </div>
              )}

              {preview && (
                <div className="px-3 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-900">
                  <p className="font-semibold mb-1">
                    Found in worksheet {previewWorksheetId}:
                  </p>
                  <ul className="text-xs space-y-0.5">
                    <li>
                      {preview.instruments.length} instrument(s)
                      {existingInstrumentIds.length > 0 &&
                        ` — ${newInstrumentCount} new`}
                    </li>
                    <li>
                      {preview.chemicals.length} chemical/reagent(s)
                      {existingChemicalIds.length > 0 && ` — ${newChemicalCount} new`}
                    </li>
                    {includeStandards && (
                      <li>
                        {preview.standards.length} standard(s)
                        {existingStandardIds.length > 0 && ` — ${newStandardCount} new`}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => {
                  resetState();
                  onClose();
                }}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={!preview}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Save &amp; Copy Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CopyFromWorksheetDialog;