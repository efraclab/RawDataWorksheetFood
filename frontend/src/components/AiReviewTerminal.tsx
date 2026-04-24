import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AiReviewResult } from "../services/api";

// ─── Field humanizer ──────────────────────────────────────────────────────────
function humanizeField(raw: string): string {
  return raw
    .replace(/parameters\[(\d+)\]/gi, (_, n) => `Parameter ${+n + 1}`)
    .replace(/preparations\[(\d+)\]/gi, (_, n) => `Preparation ${+n + 1}`)
    .replace(/\.content\./g, ".")
    .replace(/inoculationRows\s*\(\s*all\s*\)/gi, "All Inoculation Rows")
    .replace(/biochemicalRows\s*\(\s*all\s*\)/gi, "All Biochemical Rows")
    .replace(/inoculationRows\[\*\]/gi, "All Inoculation Rows")
    .replace(/biochemicalRows\[\*\]/gi, "All Biochemical Rows")
    .replace(/inoculationRows\[(\d+)\]/gi, (_, n) => `Inoculation Row ${+n + 1}`)
    .replace(/biochemicalRows\[(\d+)\]/gi, (_, n) => `Biochemical Row ${+n + 1}`)
    .replace(/\[(\d+)\]/g, (_, n) => ` ${+n + 1}`)
    .replace(/\./g, " › ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

interface AiReviewTerminalProps {
  visible: boolean;
  onReview: () => Promise<AiReviewResult>;
}

const DEFAULT_HEIGHT = 420;
const MIN_HEIGHT = 180;
const MAX_HEIGHT_RATIO = 0.9;

// ─── Tiny reusable icons ──────────────────────────────────────────────────────
const IconCheck = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polyline points="13 4 6 11 3 8" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-full h-full">
    <line x1="12" y1="4" x2="4" y2="12" /><line x1="4" y1="4" x2="12" y2="12" />
  </svg>
);
const IconWarn = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M8 2L14 13H2L8 2z" /><line x1="8" y1="6" x2="8" y2="9" /><circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M13.5 2.5v4h-4" /><path d="M2 8a6 6 0 0110.8-3.6L13.5 6.5" /><path d="M2.5 13.5v-4h4" /><path d="M14 8a6 6 0 01-10.8 3.6L2.5 9.5" />
  </svg>
);
const IconAI = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <circle cx="8" cy="8" r="2" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42" />
  </svg>
);

const AiReviewTerminal: React.FC<AiReviewTerminalProps> = ({ visible, onReview }) => {
  const [isOpen, setIsOpen]     = useState(false);
  const [height, setHeight]     = useState(DEFAULT_HEIGHT);
  const [isLoading, setLoading] = useState(false);
  const [result, setResult]     = useState<AiReviewResult | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const isDragging      = useRef(false);
  const dragStartY      = useRef(0);
  const dragStartHeight = useRef(DEFAULT_HEIGHT);
  const contentRef      = useRef<HTMLDivElement>(null);

  // ── Drag resize ─────────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const delta = dragStartY.current - e.clientY;
    const max   = window.innerHeight * MAX_HEIGHT_RATIO;
    setHeight(Math.max(MIN_HEIGHT, Math.min(max, dragStartHeight.current + delta)));
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current         = false;
    document.body.style.cursor    = "";
    document.body.style.userSelect = "";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup",   onMouseUp);
  }, [onMouseMove]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current         = true;
    dragStartY.current         = e.clientY;
    dragStartHeight.current    = height;
    document.body.style.cursor    = "ns-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
  };

  useEffect(() => () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup",   onMouseUp);
  }, [onMouseMove, onMouseUp]);

  // ── Run review ──────────────────────────────────────────────────────────────
  const runReview = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await onReview();
      setResult(res);
      setTimeout(() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 60);
    } catch (err: any) {
      setError(err.message ?? "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [onReview]);

  const handleOpen  = () => { setIsOpen(true); runReview(); };
  const handleClose = () => { setIsOpen(false); setResult(null); setError(null); setLoading(false); };

  if (!visible) return null;

  return (
    <>
      {/* ════════════════════════════════════════════════
          FLOATING ACTION BUTTON
          ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 pl-4 pr-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-2xl"
            style={{ background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", boxShadow: "0 8px 32px rgba(245,158,11,0.45)" }}
            initial={{ opacity: 0, scale: 0.75, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.75, y: 16 }}
            whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(245,158,11,0.55)" }}
            whileTap={{   scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
          >
            {/* live dot */}
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="w-4 h-4 flex-shrink-0"><IconAI /></span>
            AI Review
          </motion.button>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════
          TERMINAL PANEL
          ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="terminal"
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col select-none"
            style={{ height, background: "#0d1117" }}
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0,       opacity: 1   }}
            exit={{    y: "100%", opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* ── Resize grip ── */}
            <div
              onMouseDown={handleDragStart}
              className="h-[5px] flex-shrink-0 cursor-ns-resize group flex items-center justify-center"
              style={{ background: "#21262d", borderTop: "1px solid #30363d" }}
              title="Drag to resize"
            >
              <div className="flex gap-[3px] opacity-40 group-hover:opacity-80 transition-opacity">
                {[0,1,2,3,4].map(i => <span key={i} className="w-1 h-1 rounded-full bg-slate-400" />)}
              </div>
            </div>

            {/* ── Title bar ── */}
            <div
              className="flex-shrink-0 flex items-center gap-3 px-4 py-2"
              style={{ background: "#161b22", borderBottom: "1px solid #21262d" }}
            >
              {/* macOS traffic lights */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClose}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
                  title="Close"
                >
                  <span className="w-2 h-2 text-[#4d0000] opacity-0 group-hover:opacity-100 transition-opacity"><IconX /></span>
                </button>
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>

              {/* Tab / title */}
              <div className="flex-1 flex justify-center">
                <div
                  className="flex items-center gap-2 px-4 py-1 rounded-md text-xs font-medium"
                  style={{ background: "#0d1117", color: "#c9d1d9", border: "1px solid #30363d" }}
                >
                  <span className="w-3.5 h-3.5 text-amber-400"><IconAI /></span>
                  <span className="font-mono">AI Audit Terminal</span>
                  {isLoading && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"
                    />
                  )}
                  {!isLoading && result && (
                    <span
                      className="px-1.5 py-px rounded text-[10px] font-mono font-bold"
                      style={result.isValid
                        ? { background: "#0f2d1f", color: "#3fb950", border: "1px solid #238636" }
                        : { background: "#2d0f0f", color: "#f85149", border: "1px solid #6e2020" }}
                    >
                      {result.isValid ? "PASS" : "FAIL"}
                    </span>
                  )}
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-0.5">
                {!isLoading && (
                  <button
                    onClick={runReview}
                    title="Re-run review"
                    className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                    style={{ color: "#8b949e" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#21262d")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span className="w-3.5 h-3.5"><IconRefresh /></span>
                  </button>
                )}
                <button
                  onClick={handleClose}
                  title="Close"
                  className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                  style={{ color: "#8b949e" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#21262d")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span className="w-3.5 h-3.5"><IconX /></span>
                </button>
              </div>
            </div>

            {/* ── Scrollable content ── */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto select-text"
              style={{ background: "#0d1117", color: "#c9d1d9" }}
            >

              {/* ── LOADING ── */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-5">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-11 h-11 rounded-full"
                      style={{ border: "2px solid #21262d", borderTopColor: "#f59e0b" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: "#e6edf3" }}>Running data integrity audit…</p>
                    <p className="text-xs mt-1" style={{ color: "#6e7681" }}>GxP compliance checks in progress</p>
                  </div>
                  <div className="font-mono text-xs space-y-1 mt-1" style={{ color: "#484f58" }}>
                    {["$ Fetching worksheet records…", "$ Mapping reference data…", "$ Sending to AI model…"].map((line, i) => (
                      <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.55 }}>
                        <span style={{ color: "#3fb950" }}>›</span> {line.slice(2)}
                      </motion.p>
                    ))}
                  </div>
                </div>
              )}

              {/* ── FETCH ERROR ── */}
              {!isLoading && error && (
                <div className="p-6">
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg"
                    style={{ background: "#160b0b", border: "1px solid #6e2020" }}
                  >
                    <div className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"><IconX /></div>
                    <div>
                      <p className="text-xs font-mono font-bold mb-1" style={{ color: "#f85149" }}>REQUEST FAILED</p>
                      <p className="text-sm leading-relaxed" style={{ color: "#ffa198" }}>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── RESULTS ── */}
              {!isLoading && result && (
                <div className="p-5 space-y-5">

                  {/* ── Status banner ── */}
                  <div
                    className="rounded-lg p-4"
                    style={result.isValid
                      ? { background: "#0a1f12", border: "1px solid #238636" }
                      : { background: "#160b0b", border: "1px solid #6e2020" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={result.isValid ? { background: "#196c2e" } : { background: "#6e2020" }}
                      >
                        <span className="w-5 h-5" style={result.isValid ? { color: "#3fb950" } : { color: "#f85149" }}>
                          {result.isValid ? <IconCheck /> : <IconX />}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold" style={result.isValid ? { color: "#3fb950" } : { color: "#f85149" }}>
                          {result.isValid ? "Audit Passed — No Critical Issues" : "Audit Failed — Issues Require Attention"}
                        </p>
                        {!result.isValid && (
                          <div className="flex items-center gap-3 mt-1">
                            {result.errors.length > 0 && (
                              <span className="text-xs font-mono" style={{ color: "#f85149" }}>
                                {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}
                              </span>
                            )}
                            {result.warnings.length > 0 && (
                              <span className="text-xs font-mono" style={{ color: "#d29922" }}>
                                {result.warnings.length} warning{result.warnings.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {result.summary && (
                      <p
                        className="text-sm leading-relaxed pt-3"
                        style={{ color: "#c9d1d9", borderTop: "1px solid #21262d" }}
                      >
                        {result.summary}
                      </p>
                    )}
                  </div>

                  {/* ── ERRORS ── */}
                  {result.errors.length > 0 && (
                    <div>
                      {/* Section label */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5" style={{ color: "#f85149" }}><IconX /></span>
                          <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: "#f85149" }}>
                            Errors
                          </span>
                          <span
                            className="text-[10px] font-mono px-1.5 py-px rounded-full"
                            style={{ background: "#6e2020", color: "#ffa198" }}
                          >
                            {result.errors.length}
                          </span>
                        </div>
                        <div className="flex-1 h-px" style={{ background: "#21262d" }} />
                      </div>

                      <div className="space-y-2">
                        {result.errors.map((err, i) => (
                          <div
                            key={i}
                            className="flex gap-0 rounded-lg overflow-hidden transition-all duration-150 hover:brightness-110"
                            style={{ border: "1px solid #30363d" }}
                          >
                            {/* Left stripe + number */}
                            <div
                              className="flex items-start justify-center pt-3.5 w-10 flex-shrink-0"
                              style={{ background: "#1a0d0d", borderRight: "1px solid #30363d" }}
                            >
                              <span className="text-[10px] font-mono font-bold" style={{ color: "#f85149" }}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-4 py-3 min-w-0" style={{ background: "#0d1117" }}>
                              {/* Location breadcrumb */}
                              <p
                                className="text-[10px] font-mono mb-1.5 uppercase tracking-wide"
                                style={{ color: "#f85149" }}
                              >
                                {humanizeField(err.field)}
                              </p>
                              {/* Message */}
                              <p className="text-sm leading-relaxed" style={{ color: "#e6edf3" }}>
                                {err.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── WARNINGS ── */}
                  {result.warnings.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5" style={{ color: "#d29922" }}><IconWarn /></span>
                          <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: "#d29922" }}>
                            Warnings
                          </span>
                          <span
                            className="text-[10px] font-mono px-1.5 py-px rounded-full"
                            style={{ background: "#2d1f00", color: "#e3b341" }}
                          >
                            {result.warnings.length}
                          </span>
                        </div>
                        <div className="flex-1 h-px" style={{ background: "#21262d" }} />
                      </div>

                      <div className="space-y-2">
                        {result.warnings.map((warn, i) => (
                          <div
                            key={i}
                            className="flex gap-0 rounded-lg overflow-hidden transition-all duration-150 hover:brightness-110"
                            style={{ border: "1px solid #30363d" }}
                          >
                            {/* Left stripe + number */}
                            <div
                              className="flex items-start justify-center pt-3.5 w-10 flex-shrink-0"
                              style={{ background: "#1a1200", borderRight: "1px solid #30363d" }}
                            >
                              <span className="text-[10px] font-mono font-bold" style={{ color: "#d29922" }}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-4 py-3 min-w-0" style={{ background: "#0d1117" }}>
                              <p
                                className="text-[10px] font-mono mb-1.5 uppercase tracking-wide"
                                style={{ color: "#d29922" }}
                              >
                                {humanizeField(warn.field)}
                              </p>
                              <p className="text-sm leading-relaxed" style={{ color: "#e6edf3" }}>
                                {warn.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── ALL CLEAR ── */}
                  {result.isValid && result.errors.length === 0 && result.warnings.length === 0 && (
                    <div
                      className="flex items-center gap-4 p-4 rounded-lg"
                      style={{ background: "#0a1f12", border: "1px solid #238636" }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "#196c2e" }}
                      >
                        <span className="w-5 h-5" style={{ color: "#3fb950" }}><IconCheck /></span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#3fb950" }}>All checks passed</p>
                        <p className="text-xs mt-0.5" style={{ color: "#56d364" }}>
                          No data integrity issues found in this worksheet
                        </p>
                      </div>
                    </div>
                  )}

                  {/* bottom padding for scroll comfort */}
                  <div className="h-4" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiReviewTerminal;
