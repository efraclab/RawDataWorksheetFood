import React from "react";
import { motion } from "framer-motion";
import type { BlankPreparation } from "../../preparation_models/BlankPreparation";

interface BlankPreparationDetailProps {
  blankPreparation: BlankPreparation;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

interface BlankPreparationData {
  method: string;
  calculationResult: string;
  calculationResultUnit: string;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
}

const parseContent = (content?: string): BlankPreparationData | null => {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && "method" in parsed) return parsed as BlankPreparationData;
  } catch {
    return { method: content, calculationResult: "", calculationResultUnit: "", acceptanceLimitMin: "", acceptanceLimitMax: "" };
  }
  return null;
};

const SectionCard: React.FC<{
  icon: string;
  title: string;
  borderColor: string;
  headerBg: string;
  filled: boolean;
  children: React.ReactNode;
}> = ({ icon, title, borderColor, headerBg, filled, children }) => (
  <div className={`rounded-xl border ${borderColor} overflow-hidden`}>
    <div className={`px-3 py-2 flex items-center justify-between ${headerBg} border-b ${borderColor}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</span>
      </div>
      <span className={`w-2 h-2 rounded-full ${filled ? "bg-emerald-500" : "bg-gray-300"}`} />
    </div>
    <div className="px-3 py-3 bg-white">{children}</div>
  </div>
);

const BlankPreparationDetail: React.FC<BlankPreparationDetailProps> = ({
  blankPreparation,
  onEdit,
  onRemove,
}) => {
  if (!blankPreparation) return null;

  const data = parseContent(blankPreparation.content);

  const hasMethod = !!data?.method?.replace(/<[^>]*>/g, "").trim();
  const hasResult = !!(data?.calculationResult?.trim() || data?.calculationResultUnit);
  const hasLimit  = !!(data?.acceptanceLimitMin?.trim() || data?.acceptanceLimitMax?.trim());
  const filledCount = [hasMethod, hasResult, hasLimit].filter(Boolean).length;

  const limitCriterion = (() => {
    if (!data) return null;
    const min = data.acceptanceLimitMin?.trim();
    const max = data.acceptanceLimitMax?.trim();
    const u   = data.calculationResultUnit;
    if (min && max) return `${min} – ${max}${u ? ` ${u}` : ""}`;
    if (min) return `NLT ${min}${u ? ` ${u}` : ""}`;
    if (max) return `NMT ${max}${u ? ` ${u}` : ""}`;
    return null;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 bg-white/80 backdrop-blur-sm border-2 border-emerald-300/50 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 px-4 py-3 border-b border-emerald-200/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-700">
              {blankPreparation.label || "Blank Preparation"}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${hasMethod ? "bg-emerald-500" : "bg-gray-300"}`} title="Method" />
              <span className={`w-2 h-2 rounded-full ${hasResult ? "bg-blue-500"    : "bg-gray-300"}`} title="Result" />
              <span className={`w-2 h-2 rounded-full ${hasLimit  ? "bg-amber-500"   : "bg-gray-300"}`} title="Limit"  />
              <span className="text-xs text-gray-400 ml-0.5">{filledCount}/3</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(blankPreparation.id)}
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onRemove(blankPreparation.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-300/50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-3">
        {data ? (
          <>
            {/* Method */}
            <SectionCard icon="🧪" title="Method / Preparation"
              borderColor="border-emerald-200" headerBg="bg-emerald-50/60" filled={hasMethod}
            >
              {hasMethod ? (
                <div
                  className="method-content"
                  dangerouslySetInnerHTML={{
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
                        .method-content h1 { font-size: 1.2rem !important; font-weight: 700 !important; margin: 8px 0 4px !important; }
                        .method-content h2 { font-size: 1rem !important; font-weight: 700 !important; margin: 6px 0 4px !important; }
                        .method-content h3 { font-size: 0.9rem !important; font-weight: 600 !important; margin: 4px 0 !important; }
                        .method-content hr { border: none !important; border-top: 1px solid #d1fae5 !important; margin: 10px 0 !important; }
                        .method-content p { margin: 4px 0 !important; }
                      </style>
                      ${data.method}
                    `,
                  }}
                />
              ) : (
                <p className="text-xs text-gray-400 italic">—</p>
              )}
            </SectionCard>

            {/* Result */}
            <SectionCard icon="📊" title="Result / Reported Value"
              borderColor="border-blue-200" headerBg="bg-blue-50/60" filled={hasResult}
            >
              {hasResult ? (
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-gray-900 font-mono">
                    {data.calculationResult || "—"}
                  </span>
                  {data.calculationResultUnit && (
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                      {data.calculationResultUnit}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">—</p>
              )}
            </SectionCard>

            {/* Acceptance Limit */}
            <SectionCard icon="✅" title="Acceptance Limit"
              borderColor="border-amber-200" headerBg="bg-amber-50/60" filled={hasLimit}
            >
              {limitCriterion ? (
                <div className="flex items-center gap-3 flex-wrap">
                  {data.acceptanceLimitMin && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-emerald-600">NLT</span>
                      <span className="px-2.5 py-1 bg-white text-gray-900 text-sm font-bold rounded-lg border border-emerald-200 font-mono">
                        {data.acceptanceLimitMin}
                      </span>
                    </div>
                  )}
                  {data.acceptanceLimitMin && data.acceptanceLimitMax && (
                    <span className="text-gray-300 font-bold">—</span>
                  )}
                  {data.acceptanceLimitMax && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-red-500">NMT</span>
                      <span className="px-2.5 py-1 bg-white text-gray-900 text-sm font-bold rounded-lg border border-red-200 font-mono">
                        {data.acceptanceLimitMax}
                      </span>
                    </div>
                  )}
                  {data.calculationResultUnit && (
                    <span className="text-xs font-semibold text-amber-600">{data.calculationResultUnit}</span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">—</p>
              )}
            </SectionCard>
          </>
        ) : (
          <p className="text-sm text-center text-gray-400 py-6">No content available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default BlankPreparationDetail;