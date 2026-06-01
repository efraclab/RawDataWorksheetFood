import React from "react";
import { motion } from "framer-motion";
import type { BlankPreparation } from "../../../preparation_models/drugs/BlankPreparation";

interface ResultEntry { id: string; label: string; value: string; unit: string; }
interface LimitEntry  { id: string; label: string; min: string; max: string; unit: string; }

interface BlankPreparationDetailProps {
  blankPreparation: BlankPreparation;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

// ── Parse content — supports both new array format and legacy single-value ────
const parseContent = (content?: string): {
  method: string;
  results: ResultEntry[];
  limits: LimitEntry[];
} => {
  const fallback = { method: "", results: [], limits: [] };
  if (!content) return fallback;
  try {
    const p = JSON.parse(content);
    if (p && typeof p === "object") {
      // New format
      if (Array.isArray(p.results) && Array.isArray(p.limits)) {
        return { method: p.method || "", results: p.results, limits: p.limits };
      }
      // Legacy format
      if ("method" in p) {
        return {
          method: p.method || "",
          results: (p.calculationResult || p.calculationResultUnit)
            ? [{ id: "legacy_r", label: "Result", value: p.calculationResult || "", unit: p.calculationResultUnit || "" }]
            : [],
          limits: (p.acceptanceLimitMin || p.acceptanceLimitMax)
            ? [{ id: "legacy_l", label: "Limit", min: p.acceptanceLimitMin || "", max: p.acceptanceLimitMax || "", unit: p.calculationResultUnit || "" }]
            : [],
        };
      }
    }
  } catch {
    return { method: content, results: [], limits: [] };
  }
  return fallback;
};

// ── Section card wrapper ──────────────────────────────────────────────────────
const SectionCard: React.FC<{
  title: string; borderColor: string; headerBg: string; filled: boolean; children: React.ReactNode;
}> = ({ title, borderColor, headerBg, filled, children }) => (
  <div className={`rounded-xl border ${borderColor} overflow-hidden`}>
    <div className={`px-3 py-2 flex items-center justify-between ${headerBg} border-b ${borderColor}`}>
      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</span>
      <span className={`w-2 h-2 rounded-full ${filled ? "bg-emerald-500" : "bg-gray-300"}`} />
    </div>
    <div className="px-3 py-3 bg-white">{children}</div>
  </div>
);

const BlankPreparationDetail: React.FC<BlankPreparationDetailProps> = ({
  blankPreparation, onEdit, onRemove,
}) => {
  if (!blankPreparation) return null;

  const { method, results, limits } = parseContent(blankPreparation.content);

  const hasMethod  = !!method?.replace(/<[^>]*>/g, "").trim();
  const hasResults = results.some(r => r.value.trim() || r.unit);
  const hasLimits  = limits.some(l => l.min.trim() || l.max.trim());
  const filledCount = [hasMethod, hasResults, hasLimits].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="mb-4 bg-white/80 backdrop-blur-sm border-2 border-slate-700/40 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-4 py-3 border-b border-slate-700/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{blankPreparation.label || "Blank Preparation"}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${hasMethod  ? "bg-emerald-400" : "bg-gray-500"}`} title="Method"  />
              <span className={`w-2 h-2 rounded-full ${hasResults ? "bg-blue-400"    : "bg-gray-500"}`} title="Results" />
              <span className={`w-2 h-2 rounded-full ${hasLimits  ? "bg-amber-400"   : "bg-gray-500"}`} title="Limits"  />
              <span className="text-xs text-gray-400 ml-0.5">{filledCount}/3</span>
              {results.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold bg-blue-900/40 text-blue-200 rounded-full">
                  {results.length} result{results.length > 1 ? "s" : ""}
                </span>
              )}
              {limits.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-900/40 text-amber-200 rounded-full">
                  {limits.length} limit{limits.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(blankPreparation.id)}
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/50 rounded-lg transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button onClick={() => onRemove(blankPreparation.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-300/50 rounded-lg transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-3">
        {/* Method */}
        <SectionCard title="Method / Preparation" borderColor="border-emerald-200" headerBg="bg-emerald-50/60" filled={hasMethod}>
          {hasMethod ? (
            <div className="method-content" dangerouslySetInnerHTML={{
              __html: `
                <style>
                  .method-content { line-height: 1.65; font-size: 13px; color: #111827; }
                  .method-content table { border-collapse: collapse !important; width: 100% !important; margin: 8px 0 !important; display: table !important; }
                  .method-content thead { display: table-header-group !important; }
                  .method-content tbody { display: table-row-group !important; }
                  .method-content tr { display: table-row !important; }
                  .method-content td, .method-content th { display: table-cell !important; border: 1px solid #059669 !important; padding: 6px 10px !important; font-size: 13px !important; }
                  .method-content th { background: #ecfdf5 !important; font-weight: 600 !important; text-align: left !important; }
                  .method-content ul { list-style: disc !important; padding-left: 1.5rem !important; margin: 4px 0 !important; }
                  .method-content ol { list-style: decimal !important; padding-left: 1.5rem !important; margin: 4px 0 !important; }
                  .method-content li { display: list-item !important; }
                  .method-content p { margin: 4px 0 !important; }
                </style>
                ${method}
              `,
            }} />
          ) : <p className="text-xs text-gray-400 italic">—</p>}
        </SectionCard>

        {/* Results */}
        <SectionCard title={`Results / Reported Values (${results.length})`} borderColor="border-blue-200" headerBg="bg-blue-50/60" filled={hasResults}>
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((r, idx) => (
                <div key={r.id} className="flex items-center gap-3 py-2 border-b border-blue-50 last:border-0">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                  <span className="text-xs font-semibold text-gray-500 min-w-[80px]">{r.label}</span>
                  <span className="text-sm font-bold text-gray-900 font-mono">{r.value || "—"}</span>
                  {r.unit && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">{r.unit}</span>}
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400 italic">—</p>}
        </SectionCard>

        {/* Acceptance Limits */}
        <SectionCard title={`Acceptance Limits (${limits.length})`} borderColor="border-amber-200" headerBg="bg-amber-50/60" filled={hasLimits}>
          {limits.length > 0 ? (
            <div className="space-y-2">
              {limits.map((l, idx) => {
                const hasMin = !!l.min.trim(), hasMax = !!l.max.trim();
                if (!hasMin && !hasMax) return (
                  <div key={l.id} className="py-1.5 border-b border-amber-50 last:border-0">
                    <span className="text-xs text-gray-400 italic">No limit set</span>
                  </div>
                );
                return (
                  <div key={l.id} className="flex items-center gap-3 flex-wrap py-2 border-b border-amber-50 last:border-0">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                    <span className="text-xs font-semibold text-gray-500 min-w-[60px]">{l.label}</span>
                    {hasMin && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-600">NLT</span>
                        <span className="px-2.5 py-0.5 bg-white text-gray-900 text-sm font-bold rounded-lg border border-emerald-200 font-mono">{l.min}</span>
                      </div>
                    )}
                    {hasMin && hasMax && <span className="text-gray-300 font-bold">—</span>}
                    {hasMax && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-red-500">NMT</span>
                        <span className="px-2.5 py-0.5 bg-white text-gray-900 text-sm font-bold rounded-lg border border-red-200 font-mono">{l.max}</span>
                      </div>
                    )}
                    {l.unit && <span className="text-xs font-semibold text-amber-600">{l.unit}</span>}
                  </div>
                );
              })}
            </div>
          ) : <p className="text-xs text-gray-400 italic">—</p>}
        </SectionCard>
      </div>
    </motion.div>
  );
};

export default BlankPreparationDetail;