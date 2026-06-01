import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Data shape ────────────────────────────────────────────────────────────────
export interface ResultEntry {
  id: string;
  label: string;
  value: string;
  unit: string;
}

export interface LimitEntry {
  id: string;
  label: string;
  min: string;
  max: string;
  unit: string;
}

export interface BlankPreparationData {
  method: string;
  // New multi-entry arrays
  results: ResultEntry[];
  limits: LimitEntry[];
  // Legacy single-value fields (kept for backward compat parsing)
  calculationResult?: string;
  calculationResultUnit?: string;
  acceptanceLimitMin?: string;
  acceptanceLimitMax?: string;
}

interface BlankPreparationProps {
  onClose: () => void;
  onSave?: (label: string, content: string) => void;
  existingContent?: string;
  existingLabel?: string;
  isEditing?: boolean;
}

const RESULT_UNITS = [
  "%", "ppm", "ppb", "mg/mL", "µg/mL", "ng/mL", "mg/L", "µg/L",
  "mg/kg", "µg/g", "IU/mL", "mEq/L", "mmol/L", "g/L", "NTU", "CFU/mL",
];

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const defaultResult = (): ResultEntry => ({ id: genId(), label: "Result 1", value: "", unit: "" });
const defaultLimit  = (): LimitEntry  => ({ id: genId(), label: "Limit 1",  min: "",  max: "", unit: "" });

const defaultData = (): BlankPreparationData => ({
  method: "",
  results: [defaultResult()],
  limits:  [defaultLimit()],
});

/** Parse content string — migrates legacy single-value format to new array format */
const parseContent = (content?: string): BlankPreparationData => {
  if (!content) return defaultData();
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object") {
      // New format — has results/limits arrays
      if (Array.isArray(parsed.results) && Array.isArray(parsed.limits)) {
        return {
          method:  parsed.method  || "",
          results: parsed.results.length > 0 ? parsed.results : [defaultResult()],
          limits:  parsed.limits.length  > 0 ? parsed.limits  : [defaultLimit()],
        };
      }
      // Legacy format — single result/limit fields
      if ("method" in parsed) {
        const legacyResult: ResultEntry = {
          id:    genId(),
          label: "Result 1",
          value: parsed.calculationResult     || "",
          unit:  parsed.calculationResultUnit || "",
        };
        const legacyLimit: LimitEntry = {
          id:    genId(),
          label: "Limit 1",
          min:   parsed.acceptanceLimitMin || "",
          max:   parsed.acceptanceLimitMax || "",
          unit:  parsed.calculationResultUnit || "",
        };
        return { method: parsed.method || "", results: [legacyResult], limits: [legacyLimit] };
      }
    }
  } catch {
    return { ...defaultData(), method: content };
  }
  return defaultData();
};

// ── Rich Text Editor (unchanged from original) ────────────────────────────────
const RichTextEditor: React.FC<{ value: string; onChange: (html: string) => void }> = ({ value, onChange }) => {
  const editorRef  = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [showFontSize, setShowFontSize]   = useState(false);
  const [showColor,    setShowColor]      = useState(false);
  const [currentColor, setCurrentColor]  = useState("#000000");

  useEffect(() => {
    if (editorRef.current && !initialised.current) {
      editorRef.current.innerHTML = value;
      initialised.current = true;
    }
  }, [value]);

  const syncFormats = useCallback(() => {
    const formats = new Set<string>();
    ["bold","italic","underline","strikeThrough","insertUnorderedList","insertOrderedList",
     "justifyLeft","justifyCenter","justifyRight"].forEach(c => {
      try { if (document.queryCommandState(c)) formats.add(c); } catch {}
    });
    setActiveFormats(formats);
  }, []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.addEventListener("mouseup", syncFormats);
    el.addEventListener("keyup", syncFormats);
    return () => { el.removeEventListener("mouseup", syncFormats); el.removeEventListener("keyup", syncFormats); };
  }, [syncFormats]);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    syncFormats();
  };

  const insertTable = () => {
    const html = `<table style="border-collapse:collapse;width:100%;margin:8px 0;">
      <thead><tr>
        <th style="border:1px solid #059669;padding:6px 10px;background:#ecfdf5;text-align:left;font-size:13px;">Parameter</th>
        <th style="border:1px solid #059669;padding:6px 10px;background:#ecfdf5;text-align:left;font-size:13px;">Value</th>
        <th style="border:1px solid #059669;padding:6px 10px;background:#ecfdf5;text-align:left;font-size:13px;">Unit</th>
      </tr></thead><tbody>
        <tr><td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 1</td><td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 2</td><td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 3</td></tr>
        <tr><td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 4</td><td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 5</td><td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 6</td></tr>
      </tbody></table><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertHR = () => {
    document.execCommand("insertHTML", false, "<hr style='border:none;border-top:1px solid #d1fae5;margin:12px 0;'/><p><br></p>");
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const fontSizes = [
    { label: "Small", val: "2" }, { label: "Normal", val: "3" },
    { label: "Medium", val: "4" }, { label: "Large", val: "5" }, { label: "X-Large", val: "6" },
  ];
  const SWATCH_COLORS = ["#000000","#374151","#dc2626","#d97706","#16a34a","#2563eb","#7c3aed","#db2777","#059669","#0891b2","#65a30d","#ffffff"];

  const Btn: React.FC<{ onClick: () => void; title: string; active?: boolean; danger?: boolean; children: React.ReactNode }> = ({ onClick, title, active, danger, children }) => (
    <button type="button" onMouseDown={e => { e.preventDefault(); onClick(); }} title={title}
      className={`px-2 py-1.5 text-xs rounded border flex items-center justify-center transition-colors ${active ? "bg-emerald-600 text-white border-emerald-600" : danger ? "bg-white text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-300" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"}`}>
      {children}
    </button>
  );
  const Sep = () => <div className="w-px h-5 bg-gray-200 mx-0.5 self-center" />;

  return (
    <div className="border border-gray-200 rounded-xl overflow-visible shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
      <div className="flex items-center gap-1 flex-wrap p-2 bg-gray-50 border-b border-gray-200 rounded-t-xl">
        <Btn onClick={() => exec("bold")} title="Bold" active={activeFormats.has("bold")}><span className="font-bold text-sm w-4 text-center">B</span></Btn>
        <Btn onClick={() => exec("italic")} title="Italic" active={activeFormats.has("italic")}><span className="italic text-sm w-4 text-center">I</span></Btn>
        <Btn onClick={() => exec("underline")} title="Underline" active={activeFormats.has("underline")}><span className="underline text-sm w-4 text-center">U</span></Btn>
        <Btn onClick={() => exec("strikeThrough")} title="Strikethrough" active={activeFormats.has("strikeThrough")}><span className="line-through text-sm w-4 text-center">S</span></Btn>
        <Sep />
        <Btn onClick={() => exec("superscript")} title="Superscript"><span className="text-xs font-semibold">x²</span></Btn>
        <Btn onClick={() => exec("subscript")} title="Subscript"><span className="text-xs font-semibold">x₂</span></Btn>
        <Sep />
        <Btn onClick={() => exec("insertUnorderedList")} title="Bullet List" active={activeFormats.has("insertUnorderedList")}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
        </Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered List" active={activeFormats.has("insertOrderedList")}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17v1h1.5l-1.5 1.5V21h3v-1H4.5l1.5-1.5V17H3zm1-6.5V13H3v-2H2v-1h2v3H3v-.5H4zM2 5v1h2V8H2v1h3V5H2zm6 1h14V5H8v1zm0 6h14v-1H8v1zm0 6h14v-1H8v1z" /></svg>
        </Btn>
        <Sep />
        <Btn onClick={() => exec("justifyLeft")} title="Align Left" active={activeFormats.has("justifyLeft")}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
        </Btn>
        <Btn onClick={() => exec("justifyCenter")} title="Align Center" active={activeFormats.has("justifyCenter")}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
        </Btn>
        <Btn onClick={() => exec("justifyRight")} title="Align Right" active={activeFormats.has("justifyRight")}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm-4 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
        </Btn>
        <Sep />
        {(["H1","H2","H3"] as const).map(h => (
          <Btn key={h} onClick={() => exec("formatBlock", `<${h.toLowerCase()}>`)} title={`Heading ${h[1]}`}><span className="text-xs font-bold">{h}</span></Btn>
        ))}
        <Btn onClick={() => exec("formatBlock", "<p>")} title="Paragraph"><span className="text-xs">¶</span></Btn>
        <Sep />
        <div className="relative">
          <Btn onClick={() => { setShowFontSize(p => !p); setShowColor(false); }} title="Font Size">
            <span className="text-xs font-medium flex items-center gap-1">Aa<svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg></span>
          </Btn>
          <AnimatePresence>
            {showFontSize && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 min-w-[130px]">
                {fontSizes.map(fs => (
                  <button key={fs.val} type="button" onMouseDown={e => { e.preventDefault(); exec("fontSize", fs.val); setShowFontSize(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-gray-700">{fs.label}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative">
          <Btn onClick={() => { setShowColor(p => !p); setShowFontSize(false); }} title="Text Color">
            <span className="flex items-center gap-1"><span className="text-xs font-bold" style={{ color: currentColor }}>A</span><span className="w-3 h-1.5 rounded-sm border border-gray-200" style={{ background: currentColor }} /></span>
          </Btn>
          <AnimatePresence>
            {showColor && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3">
                <div className="grid grid-cols-6 gap-1.5">
                  {SWATCH_COLORS.map(c => (
                    <button key={c} type="button" onMouseDown={e => { e.preventDefault(); setCurrentColor(c); exec("foreColor", c); setShowColor(false); }}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform shadow-sm" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Custom</span>
                  <input type="color" value={currentColor} onChange={e => { setCurrentColor(e.target.value); exec("foreColor", e.target.value); }} className="w-8 h-6 border border-gray-200 rounded cursor-pointer" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Sep />
        <Btn onClick={insertTable} title="Insert Table">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" /></svg>
        </Btn>
        <Btn onClick={insertHR} title="Insert Divider">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>
        </Btn>
        <Sep />
        <Btn onClick={() => exec("undo")} title="Undo">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v1M3 10l4-4M3 10l4 4" /></svg>
        </Btn>
        <Btn onClick={() => exec("redo")} title="Redo">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v1M21 10l-4-4M21 10l-4 4" /></svg>
        </Btn>
        <Btn onClick={() => exec("removeFormat")} title="Clear Formatting" danger>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </Btn>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        onFocus={() => { setShowFontSize(false); setShowColor(false); }}
        className="p-4 text-sm focus:outline-none min-h-[400px] overflow-y-auto"
        style={{ lineHeight: "1.7" }} data-placeholder="Enter preparation method..." />
      <style>{`
        [data-placeholder]:empty:before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; }
        [contenteditable] table { border-collapse: collapse; width: 100%; margin: 8px 0; }
        [contenteditable] td, [contenteditable] th { border: 1px solid #059669; padding: 6px 10px; }
        [contenteditable] th { background: #ecfdf5; font-weight: 600; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; margin: 4px 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5rem; margin: 4px 0; }
        [contenteditable] h1 { font-size: 1.35rem; font-weight: 700; margin: 10px 0 4px; }
        [contenteditable] h2 { font-size: 1.1rem; font-weight: 700; margin: 8px 0 4px; }
        [contenteditable] h3 { font-size: 0.95rem; font-weight: 600; margin: 6px 0 4px; }
        [contenteditable] hr { border: none; border-top: 1px solid #d1fae5; margin: 12px 0; }
      `}</style>
    </div>
  );
};

// ── Inline Unit Picker ─────────────────────────────────────────────────────────
const InlineUnitPicker: React.FC<{ value: string; onChange: (u: string) => void }> = ({ value, onChange }) => {
  const [showCustom, setShowCustom] = useState(false);
  const isCustom = value !== "" && !RESULT_UNITS.includes(value);

  useEffect(() => { if (isCustom) setShowCustom(true); }, [isCustom]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {RESULT_UNITS.map(u => (
          <button key={u} type="button" onClick={() => { onChange(u); setShowCustom(false); }}
            className={`px-2 py-0.5 text-xs font-medium rounded-md border transition-colors ${value === u ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700"}`}>
            {u}
          </button>
        ))}
        <button type="button" onClick={() => { onChange(""); setShowCustom(false); }}
          className={`px-2 py-0.5 text-xs font-medium rounded-md border transition-colors ${value === "" ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}`}>
          None
        </button>
        <button type="button" onClick={() => setShowCustom(s => !s)}
          className={`px-2 py-0.5 text-xs font-medium rounded-md border transition-colors ${isCustom ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-400 border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}>
          Custom
        </button>
      </div>
      <AnimatePresence>
        {(showCustom || isCustom) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <input type="text" value={isCustom ? value : ""} onChange={e => onChange(e.target.value)}
              placeholder="Type custom unit..."
              className="w-40 px-2.5 py-1.5 text-xs border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Small icon button helper ───────────────────────────────────────────────────
const IconBtn: React.FC<{
  onClick: () => void; title?: string; variant?: "danger" | "ghost" | "primary";
  children: React.ReactNode; className?: string;
}> = ({ onClick, title, variant = "ghost", children, className = "" }) => {
  const cls = variant === "danger"
    ? "text-red-500 hover:bg-red-50 border-red-200 hover:border-red-300"
    : variant === "primary"
    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300"
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-gray-200";
  return (
    <button type="button" onClick={onClick} title={title}
      className={`p-1.5 rounded-lg border transition-all ${cls} ${className}`}>
      {children}
    </button>
  );
};

// ── Results Section Editor ─────────────────────────────────────────────────────
const ResultsEditor: React.FC<{
  results: ResultEntry[];
  onChange: (results: ResultEntry[]) => void;
}> = ({ results, onChange }) => {
  const addResult = () => {
    const n = results.length + 1;
    onChange([...results, { id: genId(), label: `Result ${n}`, value: "", unit: "" }]);
  };

  const updateResult = (id: string, field: keyof ResultEntry, val: string) =>
    onChange(results.map(r => r.id === id ? { ...r, [field]: val } : r));

  const removeResult = (id: string) => {
    const updated = results.filter(r => r.id !== id)
      .map((r, i) => ({ ...r, label: `Result ${i + 1}` }));
    onChange(updated.length > 0 ? updated : [defaultResult()]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Reported Results ({results.length})
        </span>
        <button type="button" onClick={addResult}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Result
        </button>
      </div>

      <AnimatePresence initial={false}>
        {results.map((r, idx) => (
          <motion.div key={r.id}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
            className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm">
            {/* Row header */}
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={r.label}
                  onChange={e => updateResult(r.id, "label", e.target.value)}
                  className="text-xs font-semibold text-blue-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1 w-32"
                />
              </div>
              <IconBtn onClick={() => removeResult(r.id)} variant="danger" title="Remove result">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </IconBtn>
            </div>

            <div className="px-3 py-3 space-y-3">
              {/* Value row */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Value</label>
                <input type="text" value={r.value} onChange={e => updateResult(r.id, "value", e.target.value)}
                  placeholder="Enter result value..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono" />
              </div>
              {/* Unit row */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Unit</label>
                <InlineUnitPicker value={r.unit} onChange={u => updateResult(r.id, "unit", u)} />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── Limits Section Editor ─────────────────────────────────────────────────────
const LimitsEditor: React.FC<{
  limits: LimitEntry[];
  onChange: (limits: LimitEntry[]) => void;
}> = ({ limits, onChange }) => {
  const addLimit = () => {
    const n = limits.length + 1;
    onChange([...limits, { id: genId(), label: `Limit ${n}`, min: "", max: "", unit: "" }]);
  };

  const updateLimit = (id: string, field: keyof LimitEntry, val: string) =>
    onChange(limits.map(l => l.id === id ? { ...l, [field]: val } : l));

  const removeLimit = (id: string) => {
    const updated = limits.filter(l => l.id !== id)
      .map((l, i) => ({ ...l, label: `Limit ${i + 1}` }));
    onChange(updated.length > 0 ? updated : [defaultLimit()]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Acceptance Criteria ({limits.length})
        </span>
        <button type="button" onClick={addLimit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Limit
        </button>
      </div>

      <AnimatePresence initial={false}>
        {limits.map((l, idx) => {
          const preview = (() => {
            const min = l.min.trim(), max = l.max.trim(), u = l.unit;
            if (min && max) return `${min} ≤ Result ≤ ${max}${u ? ` ${u}` : ""}`;
            if (min)        return `Result ≥ ${min}${u ? ` ${u}` : ""}`;
            if (max)        return `Result ≤ ${max}${u ? ` ${u}` : ""}`;
            return null;
          })();

          return (
            <motion.div key={l.id}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
              className="bg-white border border-amber-100 rounded-xl overflow-hidden shadow-sm">
              {/* Row header */}
              <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-amber-50 to-slate-50 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input type="text" value={l.label} onChange={e => updateLimit(l.id, "label", e.target.value)}
                    className="text-xs font-semibold text-amber-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-amber-300 rounded px-1 w-32" />
                </div>
                <IconBtn onClick={() => removeLimit(l.id)} variant="danger" title="Remove limit">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </IconBtn>
              </div>

              <div className="px-3 py-3 space-y-3">
                {/* Min/Max row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1">Min (NLT ≥)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-500 pointer-events-none">≥</span>
                      <input type="text" value={l.min} onChange={e => updateLimit(l.id, "min", e.target.value)}
                        placeholder="Min value"
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-red-500 uppercase tracking-wide mb-1">Max (NMT ≤)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-red-400 pointer-events-none">≤</span>
                      <input type="text" value={l.max} onChange={e => updateLimit(l.id, "max", e.target.value)}
                        placeholder="Max value"
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 font-mono" />
                    </div>
                  </div>
                </div>

                {/* Unit for limit */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Unit</label>
                  <InlineUnitPicker value={l.unit} onChange={u => updateLimit(l.id, "unit", u)} />
                </div>

                {/* Preview */}
                {preview && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-mono font-semibold text-amber-800">{preview}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const BlankPreparation: React.FC<BlankPreparationProps> = ({
  onClose, onSave, existingContent, existingLabel, isEditing,
}) => {
  const [label,         setLabel]         = useState(existingLabel || "");
  const [data,          setData]          = useState<BlankPreparationData>(() => parseContent(existingContent));
  const [isSaving,      setIsSaving]      = useState(false);
  const [activeSection, setActiveSection] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setLabel(existingLabel || "");
    setData(parseContent(existingContent));
    setActiveSection(0);
  }, [existingContent, existingLabel, isEditing]);

  const handleSave = () => {
    if (!label.trim()) return;
    setIsSaving(true);
    onSave?.(label.trim(), JSON.stringify(data));
    setTimeout(() => { setIsSaving(false); onClose(); }, 400);
  };

  const methodFilled  = !!data.method.replace(/<[^>]*>/g, "").trim();
  const resultsFilled = data.results.some(r => r.value.trim() || r.unit);
  const limitsFilled  = data.limits.some(l => l.min.trim() || l.max.trim());
  const filledCount   = [methodFilled, resultsFilled, limitsFilled].filter(Boolean).length;

  const sections = [
    { title: "Method / Preparation", icon: "🧪", filled: methodFilled,  color: "emerald" },
    { title: "Results",              icon: "📊", filled: resultsFilled, color: "blue"    },
    { title: "Acceptance Limits",    icon: "✅", filled: limitsFilled,  color: "amber"   },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      className="flex flex-col bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden"
      style={{ height: "96vh", minWidth: "min(860px, 96vw)" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{isEditing ? "Edit Blank Preparation" : "New Blank Preparation"}</h2>
            <p className="text-xs text-emerald-100">{filledCount}/3 sections completed</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Label */}
      <div className="px-6 pt-4 pb-3 border-b border-gray-100 shrink-0">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Label <span className="text-red-500">*</span></label>
        <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="Preparation label"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50 shrink-0">
        {sections.map((sec, idx) => (
          <button key={idx} type="button" onClick={() => setActiveSection(idx as 0 | 1 | 2)}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${activeSection === idx ? "border-emerald-600 text-emerald-700 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>
            <span>{sec.icon}</span>
            <span>{sec.title}</span>
            {sec.filled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {activeSection === 0 && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Preparation Procedure</label>
            <RichTextEditor value={data.method} onChange={html => setData(prev => ({ ...prev, method: html }))} />
          </div>
        )}

        {activeSection === 1 && (
          <ResultsEditor
            results={data.results}
            onChange={results => setData(prev => ({ ...prev, results }))}
          />
        )}

        {activeSection === 2 && (
          <LimitsEditor
            limits={data.limits}
            onChange={limits => setData(prev => ({ ...prev, limits }))}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {sections.map((sec, idx) => (
            <button key={idx} type="button" onClick={() => setActiveSection(idx as 0 | 1 | 2)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${activeSection === idx ? "text-emerald-700 font-semibold" : "text-gray-400 hover:text-gray-600"}`}>
              <span className={`w-2 h-2 rounded-full ${sec.filled ? (idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-blue-500" : "bg-amber-500") : "bg-gray-300"}`} />
              <span className="hidden sm:inline">{["Method", "Results", "Limits"][idx]}</span>
            </button>
          ))}
          <span className="text-xs text-gray-400">{filledCount}/3</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={isSaving || !label.trim()}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2 ${isSaving || !label.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}>
            {isSaving ? (
              <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
            ) : (
              <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" /></svg>Save</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlankPreparation;