import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Inline SVG icons ────────────────────────────────────────────────────────
const Check: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WorksheetSidebarState {
  worksheetId: string;
  displayStatus: string;
  sampleName: string;
  registrationNo: string;
  worksheetStatus: string | null;
  role: string;
  isSaving: boolean;
  saveSuccess: boolean;
  isSubmitting: boolean;
  isSubmittingForQA: boolean;
  isApprovingWorksheet: boolean;
  showSaveDraft: boolean;
  showSubmitForAnalysis: boolean;
  showSubmitForQA: boolean;
  showApproveWorksheet: boolean;
  showPrintReport: boolean;
  isContentLoading: boolean;
  includeAuditTrail: boolean;
}

export interface WorksheetSidebarActions {
  onBack: () => void;
  onSaveDraft: () => void;
  onSubmitForAnalysis: () => void;
  onSubmitForQA: () => void;
  onApproveWorksheet: () => void;
  onPrintReport: () => void;
  onContentReady: () => void;
  onToggleAuditTrail: () => void;
}

interface WorksheetSidebarProps {
  state: WorksheetSidebarState;
  actions: WorksheetSidebarActions;
  mode?: "worksheet" | "print";
  onClosePrint?: () => void;
}

// ─── Status colour map ────────────────────────────────────────────────────────
function statusConfig(status: string): { dot: string; badge: string } {
  const s = status.toLowerCase();
  if (s.includes("approved"))  return { dot: "bg-emerald-400", badge: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40" };
  if (s.includes("qa"))        return { dot: "bg-violet-400",  badge: "bg-violet-500/20  text-violet-200  border-violet-400/40"  };
  if (s.includes("analysis"))  return { dot: "bg-sky-400",     badge: "bg-sky-500/20     text-sky-200     border-sky-400/40"     };
  if (s.includes("review"))    return { dot: "bg-amber-400",   badge: "bg-amber-500/20   text-amber-200   border-amber-400/40"   };
  if (s.includes("draft"))     return { dot: "bg-slate-400",   badge: "bg-slate-500/20   text-slate-200   border-slate-400/40"   };
  return                              { dot: "bg-slate-400",   badge: "bg-white/10       text-white/80    border-white/20"       };
}

// ─── Role pill config ─────────────────────────────────────────────────────────
function roleConfig(role: string): { color: string; bg: string } {
  const r = role.toLowerCase();
  if (r === "qa")       return { color: "text-violet-700", bg: "bg-violet-50 border-violet-200" };
  if (r === "reviewer") return { color: "text-amber-700",  bg: "bg-amber-50  border-amber-200"  };
  if (r === "analyst")  return { color: "text-sky-700",    bg: "bg-sky-50    border-sky-200"    };
  return                       { color: "text-slate-600",  bg: "bg-slate-50  border-slate-200"  };
}

// ─── Reusable action button ───────────────────────────────────────────────────
interface ActionBtnProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  gradient: string;
  hoverGradient: string;
  shadow: string;
  disabledBg: string;
  icon: React.ReactNode;
  label: string;
  loadingLabel?: string;
  badge?: React.ReactNode;
}

const ActionBtn: React.FC<ActionBtnProps> = ({
  onClick, disabled, loading, gradient, hoverGradient, shadow, disabledBg,
  icon, label, loadingLabel, badge,
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { y: -1, scale: 1.01 } : {}}
    whileTap={!disabled ? { y: 0, scale: 0.99 } : {}}
    className={`relative w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 overflow-hidden group ${
      loading || disabled
        ? `${disabledBg} cursor-not-allowed text-white/60`
        : `bg-gradient-to-r ${gradient} ${hoverGradient} text-white shadow-md ${shadow} hover:shadow-lg`
    }`}
  >
    {/* shimmer sweep */}
    {!disabled && (
      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
    )}
    {/* left accent pip */}
    {!disabled && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white/50 group-hover:h-7 transition-all duration-200" />
    )}
    {loading ? (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full flex-shrink-0"
      />
    ) : (
      <span className="flex-shrink-0 w-4 h-4 ml-1">{icon}</span>
    )}
    <span className="leading-tight flex-1 text-left">{loading ? (loadingLabel ?? label) : label}</span>
    {badge}
  </motion.button>
);

// ─── Info card ────────────────────────────────────────────────────────────────
const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string; multiline?: boolean }> = ({
  icon, label, value, multiline,
}) => (
  <div className="mx-2 sm:mx-3 mb-2 rounded-xl bg-white border border-slate-100 shadow-sm px-3 sm:px-4 py-2.5 sm:py-3 flex gap-2 sm:gap-3 items-start hover:border-emerald-200 hover:shadow-md transition-all duration-200 group">
    <div className="mt-0.5 w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors duration-200">
      <span className="text-emerald-500 w-3 sm:w-3.5 h-3 sm:h-3.5">{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-slate-400 mb-0.5">{label}</p>
      <p className={`text-[10px] sm:text-xs font-semibold text-slate-800 leading-snug ${multiline ? "line-clamp-3" : "truncate"}`}>
        {value || "—"}
      </p>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const WorksheetSidebar: React.FC<WorksheetSidebarProps> = ({
  state, actions, mode = "worksheet", onClosePrint,
}) => {
  const {
    worksheetId, displayStatus, sampleName, registrationNo,
    role,
    isSaving, saveSuccess, isSubmitting, isSubmittingForQA, isApprovingWorksheet,
    showSaveDraft, showSubmitForAnalysis, showSubmitForQA, showApproveWorksheet, showPrintReport,
    isContentLoading, includeAuditTrail,
  } = state;

  const sc = displayStatus ? statusConfig(displayStatus) : null;
  const rc = role ? roleConfig(role) : null;

  return (
    <div className="no-print sticky top-0 h-screen w-52 sm:w-60 lg:w-72 flex-shrink-0 flex flex-col bg-slate-50 border-r border-slate-200/60 shadow-[4px_0_32px_-4px_rgba(0,0,0,0.10)] z-30">

      {/* ═══════════════════════════════════════════════════════════
           HEADER  — dark gradient, always at top, never scrolls
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 flex-shrink-0">

        {/* Decorative glows */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-14 -left-8   w-32 h-32 rounded-full bg-teal-300/10   blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-emerald-300/8  blur-xl  pointer-events-none" />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Back button */}
        <div className="relative px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3">
          <button
            onClick={mode === "print" ? onClosePrint : actions.onBack}
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-emerald-300/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <svg
              className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase">
              {mode === "print" ? "Back to Worksheet" : "Back"}
            </span>
          </button>
        </div>

        <div className="mx-3 sm:mx-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-3 sm:mb-4" />

        {/* Worksheet ID + status */}
        <div className="relative px-3 sm:px-5 pb-4 sm:pb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] text-emerald-400/80">Worksheet</span>
          </div>

          <p className="text-white font-black text-base sm:text-lg lg:text-xl leading-tight tracking-tight break-all mb-2 sm:mb-3">
            {worksheetId || "—"}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {sc && displayStatus && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] border backdrop-blur-sm ${sc.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0 ${sc.dot}`} />
                {displayStatus}
              </motion.span>
            )}

            {rc && role && (
              <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.12em] border ${rc.bg} ${rc.color}`}>
                {role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
           SCROLLABLE MIDDLE  — info cards + action buttons
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* Info cards */}
        <div className="pt-4 pb-1">
          <InfoCard
            label="Reg No"
            value={registrationNo}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            }
          />
          <InfoCard
            label="Sample"
            value={sampleName}
            multiline
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
        </div>

        {/* Loading state */}
        {isContentLoading && (
          <div className="px-3 py-3">
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full flex-shrink-0"
              />
              <span className="text-[11px] font-semibold text-slate-500">
                {mode === "print" ? "Loading report…" : "Loading worksheet…"}
              </span>
            </div>
          </div>
        )}

        {/* Actions panel — fades in once content is ready */}
        <AnimatePresence>
          {!isContentLoading && (
            <motion.div
              key="actions-panel"
              className="flex flex-col pb-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Divider */}
              <div className="px-3 sm:px-5 py-2 sm:py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-slate-400">
                    {mode === "print" ? "Print Options" : "Actions"}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
                </div>
              </div>

              <div className="px-2 sm:px-3 flex flex-col gap-2 sm:gap-2.5">

                {/* Print mode */}
                <AnimatePresence>
                  {mode === "print" && (
                    <motion.div
                      key="print-actions"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-2.5"
                    >
                      {/* ── Audit Trail checkbox ────────────────────────── */}
                      
                      {/* <button
                        type="button"
                        onClick={actions.onToggleAuditTrail}
                        className={`group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left ${
                          includeAuditTrail
                            ? "bg-emerald-50 border-emerald-300 shadow-sm"
                            : "bg-white border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/40"
                        }`}
                      >
                        <div className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          includeAuditTrail
                            ? "bg-emerald-600 border-emerald-600"
                            : "bg-white border-slate-300 group-hover:border-emerald-400"
                        }`}>
                          {includeAuditTrail && (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[10px] sm:text-xs font-bold leading-tight transition-colors ${
                            includeAuditTrail ? "text-emerald-800" : "text-slate-700 group-hover:text-emerald-700"
                          }`}>
                            Include Audit Trail
                          </p>
                          <p className={`text-[8px] sm:text-[9px] leading-tight mt-0.5 transition-colors ${
                            includeAuditTrail ? "text-emerald-600/80" : "text-slate-400"
                          }`}>
                            {includeAuditTrail ? "Will print on new page" : "Omit from printed report"}
                          </p>
                        </div>
                        <span className={`ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          includeAuditTrail ? "bg-emerald-500 shadow-sm shadow-emerald-400/50" : "bg-slate-300"
                        }`} />
                      </button> */}

                      {/* ── Print button ────────────────────────────────── */}
                      <ActionBtn
                        onClick={() => setTimeout(() => window.print(), 100)}
                        gradient="from-emerald-500 to-emerald-700"
                        hoverGradient="hover:from-emerald-400 hover:to-emerald-600"
                        shadow="shadow-emerald-500/30"
                        disabledBg="bg-emerald-500/50"
                        label="Print Report"
                        icon={
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Worksheet mode */}
                <AnimatePresence>
                  {mode === "worksheet" && (
                    <motion.div
                      key="worksheet-actions"
                      className="flex flex-col gap-2.5"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                    >
                      {showSaveDraft && (
                        <div className="relative">
                          <ActionBtn
                            onClick={actions.onSaveDraft}
                            disabled={isSaving}
                            loading={isSaving}
                            loadingLabel="Saving…"
                            gradient="from-emerald-500 to-emerald-700"
                            hoverGradient="hover:from-emerald-400 hover:to-emerald-600"
                            shadow="shadow-emerald-500/30"
                            disabledBg="bg-emerald-500/50"
                            label="Save Draft"
                            icon={
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                              </svg>
                            }
                          />
                          <AnimatePresence>
                            {saveSuccess && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-400/50 z-10"
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {showSubmitForAnalysis && (
                        <ActionBtn
                          onClick={actions.onSubmitForAnalysis}
                          disabled={isSubmitting}
                          loading={isSubmitting}
                          loadingLabel="Submitting…"
                          gradient="from-sky-500 to-blue-700"
                          hoverGradient="hover:from-sky-400 hover:to-blue-600"
                          shadow="shadow-blue-500/30"
                          disabledBg="bg-blue-500/50"
                          label="Submit for Analysis"
                          icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          }
                        />
                      )}

                      {showSubmitForQA && (
                        <ActionBtn
                          onClick={actions.onSubmitForQA}
                          disabled={isSubmittingForQA}
                          loading={isSubmittingForQA}
                          loadingLabel="Submitting…"
                          gradient="from-violet-500 to-purple-700"
                          hoverGradient="hover:from-violet-400 hover:to-purple-600"
                          shadow="shadow-purple-500/30"
                          disabledBg="bg-purple-500/50"
                          label="Submit for QA Review"
                          icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                          }
                        />
                      )}

                      {showApproveWorksheet && (
                        <ActionBtn
                          onClick={actions.onApproveWorksheet}
                          disabled={isApprovingWorksheet}
                          loading={isApprovingWorksheet}
                          loadingLabel="Approving…"
                          gradient="from-green-500 to-green-700"
                          hoverGradient="hover:from-green-400 hover:to-green-600"
                          shadow="shadow-green-500/30"
                          disabledBg="bg-green-500/50"
                          label="Approve Worksheet"
                          icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          }
                        />
                      )}

                      {showPrintReport && (
                        <ActionBtn
                          onClick={actions.onPrintReport}
                          gradient="from-slate-600 to-slate-800"
                          hoverGradient="hover:from-slate-500 hover:to-slate-700"
                          shadow="shadow-slate-500/25"
                          disabledBg="bg-slate-500/50"
                          label="Print Report"
                          icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          }
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════
           FOOTER — flex-shrink-0 pins it permanently to the bottom
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 border-t border-slate-200/80 bg-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        <img
          src="/ic_efrac.png"
          alt="EFRAC"
          className="h-5 sm:h-7 opacity-50 hover:opacity-75 transition-opacity duration-300 object-contain"
        />
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-slate-400">
            System Active
          </span>
        </div>
      </div>

    </div>
  );
};

export default WorksheetSidebar;