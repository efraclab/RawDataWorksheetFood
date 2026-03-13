import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Data shape ────────────────────────────────────────────────────────────────
export interface BlankPreparationData {
  method: string;
  calculationResult: string;
  calculationResultUnit: string;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
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

const defaultData: BlankPreparationData = {
  method: "",
  calculationResult: "",
  calculationResultUnit: "",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
};

const parseContent = (content?: string): BlankPreparationData => {
  if (!content) return defaultData;
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && "method" in parsed)
      return { ...defaultData, ...parsed };
  } catch {
    return { ...defaultData, method: content };
  }
  return defaultData;
};

// ── Rich Text Editor ──────────────────────────────────────────────────────────
const RichTextEditor: React.FC<{ value: string; onChange: (html: string) => void }> = ({
  value,
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [showFontSize, setShowFontSize] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");

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
      </tr></thead>
      <tbody>
        <tr>
          <td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 1</td>
          <td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 2</td>
          <td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 3</td>
        </tr>
        <tr>
          <td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 4</td>
          <td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 5</td>
          <td style="border:1px solid #059669;padding:6px 10px;font-size:13px;">Cell 6</td>
        </tr>
      </tbody>
    </table><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertHR = () => {
    document.execCommand("insertHTML", false, "<hr style='border:none;border-top:1px solid #d1fae5;margin:12px 0;'/><p><br></p>");
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const fontSizes = [
    { label: "Small", val: "2" }, { label: "Normal", val: "3" },
    { label: "Medium", val: "4" }, { label: "Large", val: "5" },
    { label: "X-Large", val: "6" },
  ];

  const SWATCH_COLORS = [
    "#000000","#374151","#dc2626","#d97706",
    "#16a34a","#2563eb","#7c3aed","#db2777",
    "#059669","#0891b2","#65a30d","#ffffff",
  ];

  const Btn: React.FC<{
    onClick: () => void; title: string; active?: boolean; danger?: boolean;
    children: React.ReactNode;
  }> = ({ onClick, title, active, danger, children }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`px-2 py-1.5 text-xs rounded border flex items-center justify-center transition-colors ${
        active  ? "bg-emerald-600 text-white border-emerald-600" :
        danger  ? "bg-white text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-300" :
                  "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  const Sep = () => <div className="w-px h-5 bg-gray-200 mx-0.5 self-center" />;

  return (
    <div className="border border-gray-200 rounded-xl overflow-visible shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap p-2 bg-gray-50 border-b border-gray-200 rounded-t-xl">

        <Btn onClick={() => exec("bold")} title="Bold" active={activeFormats.has("bold")}>
          <span className="font-bold text-sm w-4 text-center">B</span>
        </Btn>
        <Btn onClick={() => exec("italic")} title="Italic" active={activeFormats.has("italic")}>
          <span className="italic text-sm w-4 text-center">I</span>
        </Btn>
        <Btn onClick={() => exec("underline")} title="Underline" active={activeFormats.has("underline")}>
          <span className="underline text-sm w-4 text-center">U</span>
        </Btn>
        <Btn onClick={() => exec("strikeThrough")} title="Strikethrough" active={activeFormats.has("strikeThrough")}>
          <span className="line-through text-sm w-4 text-center">S</span>
        </Btn>
        <Sep />

        <Btn onClick={() => exec("superscript")} title="Superscript">
          <span className="text-xs font-semibold">x²</span>
        </Btn>
        <Btn onClick={() => exec("subscript")} title="Subscript">
          <span className="text-xs font-semibold">x₂</span>
        </Btn>
        <Sep />

        <Btn onClick={() => exec("insertUnorderedList")} title="Bullet List" active={activeFormats.has("insertUnorderedList")}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered List" active={activeFormats.has("insertOrderedList")}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17v1h1.5l-1.5 1.5V21h3v-1H4.5l1.5-1.5V17H3zm1-6.5V13H3v-2H2v-1h2v3H3v-.5H4zM2 5v1h2V8H2v1h3V5H2zm6 1h14V5H8v1zm0 6h14v-1H8v1zm0 6h14v-1H8v1z" />
          </svg>
        </Btn>
        <Btn onClick={() => exec("indent")} title="Indent">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h18M9 9l3 3-3 3" />
          </svg>
        </Btn>
        <Btn onClick={() => exec("outdent")} title="Outdent">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M9 12h12M3 18h18M9 9l-3 3 3 3" />
          </svg>
        </Btn>
        <Sep />

        <Btn onClick={() => exec("justifyLeft")} title="Align Left" active={activeFormats.has("justifyLeft")}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </Btn>
        <Btn onClick={() => exec("justifyCenter")} title="Align Center" active={activeFormats.has("justifyCenter")}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </Btn>
        <Btn onClick={() => exec("justifyRight")} title="Align Right" active={activeFormats.has("justifyRight")}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm-4 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </Btn>
        <Sep />

        {(["H1","H2","H3"] as const).map(h => (
          <Btn key={h} onClick={() => exec("formatBlock", `<${h.toLowerCase()}>`)} title={`Heading ${h[1]}`}>
            <span className="text-xs font-bold">{h}</span>
          </Btn>
        ))}
        <Btn onClick={() => exec("formatBlock", "<p>")} title="Paragraph">
          <span className="text-xs">¶</span>
        </Btn>
        <Sep />

        {/* Font size */}
        <div className="relative">
          <Btn onClick={() => { setShowFontSize(p => !p); setShowColor(false); }} title="Font Size">
            <span className="text-xs font-medium flex items-center gap-1">
              Aa
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </span>
          </Btn>
          <AnimatePresence>
            {showFontSize && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 min-w-[130px]"
              >
                {fontSizes.map(fs => (
                  <button key={fs.val} type="button"
                    onMouseDown={e => { e.preventDefault(); exec("fontSize", fs.val); setShowFontSize(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-gray-700"
                  >
                    {fs.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text colour */}
        <div className="relative">
          <Btn onClick={() => { setShowColor(p => !p); setShowFontSize(false); }} title="Text Color">
            <span className="flex items-center gap-1">
              <span className="text-xs font-bold" style={{ color: currentColor }}>A</span>
              <span className="w-3 h-1.5 rounded-sm border border-gray-200" style={{ background: currentColor }} />
            </span>
          </Btn>
          <AnimatePresence>
            {showColor && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3"
              >
                <div className="grid grid-cols-6 gap-1.5">
                  {SWATCH_COLORS.map(c => (
                    <button key={c} type="button"
                      onMouseDown={e => { e.preventDefault(); setCurrentColor(c); exec("foreColor", c); setShowColor(false); }}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform shadow-sm"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Custom</span>
                  <input type="color" value={currentColor}
                    onChange={e => { setCurrentColor(e.target.value); exec("foreColor", e.target.value); }}
                    className="w-8 h-6 border border-gray-200 rounded cursor-pointer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Sep />

        <Btn onClick={insertTable} title="Insert Table">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" />
          </svg>
        </Btn>
        <Btn onClick={insertHR} title="Insert Divider">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        </Btn>
        <Sep />

        <Btn onClick={() => exec("undo")} title="Undo">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v1M3 10l4-4M3 10l4 4" />
          </svg>
        </Btn>
        <Btn onClick={() => exec("redo")} title="Redo">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v1M21 10l-4-4M21 10l-4 4" />
          </svg>
        </Btn>
        <Btn onClick={() => exec("removeFormat")} title="Clear Formatting" danger>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Btn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        onFocus={() => { setShowFontSize(false); setShowColor(false); }}
        className="p-4 text-sm focus:outline-none min-h-[480px] overflow-y-auto"
        style={{ lineHeight: "1.7" }}
        data-placeholder="Enter preparation method..."
      />

      <style>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
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

// ── Unit chip picker ──────────────────────────────────────────────────────────
const UnitPicker: React.FC<{ value: string; onChange: (u: string) => void }> = ({ value, onChange }) => {
  const isCustom = value !== "" && !RESULT_UNITS.includes(value);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {RESULT_UNITS.map(u => (
          <button key={u} type="button" onClick={() => onChange(u)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              value === u
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-700"
            }`}
          >
            {u}
          </button>
        ))}
        <button type="button" onClick={() => onChange("")}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
            value === "" ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
          }`}
        >
          None
        </button>
      </div>
      <input
        type="text"
        value={isCustom ? value : ""}
        onChange={e => onChange(e.target.value)}
        placeholder="Custom unit"
        className="w-40 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const BlankPreparation: React.FC<BlankPreparationProps> = ({
  onClose, onSave, existingContent, existingLabel, isEditing,
}) => {
  const [label, setLabel] = useState(existingLabel || "");
  const [data, setData] = useState<BlankPreparationData>(() => parseContent(existingContent));
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setLabel(existingLabel || "");
    setData(parseContent(existingContent));
    setActiveSection(0);
  }, [existingContent, existingLabel, isEditing]);

  const update = (field: keyof BlankPreparationData, value: string) =>
    setData(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!label.trim()) return;
    setIsSaving(true);
    onSave?.(label.trim(), JSON.stringify(data));
    setTimeout(() => { setIsSaving(false); onClose(); }, 400);
  };

  const sections = [
    { title: "Method / Preparation", icon: "🧪" },
    { title: "Result / Reported Value", icon: "📊" },
    { title: "Acceptance Limit", icon: "✅" },
  ] as const;

  const sectionFilled = [
    !!data.method.replace(/<[^>]*>/g, "").trim(),
    !!(data.calculationResult.trim() || data.calculationResultUnit),
    !!(data.acceptanceLimitMin.trim() || data.acceptanceLimitMax.trim()),
  ];

  const filledCount = sectionFilled.filter(Boolean).length;

  const limitPreview = (() => {
    const min = data.acceptanceLimitMin.trim();
    const max = data.acceptanceLimitMax.trim();
    const u = data.calculationResultUnit;
    if (min && max) return `${min} – ${max}${u ? ` ${u}` : ""}`;
    if (min) return `NLT ${min}${u ? ` ${u}` : ""}`;
    if (max) return `NMT ${max}${u ? ` ${u}` : ""}`;
    return null;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      className="flex flex-col bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden"
      style={{ height: "96vh", minWidth: "min(860px, 96vw)" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {isEditing ? "Edit Blank Preparation" : "New Blank Preparation"}
            </h2>
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
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Label <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Preparation label"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50 shrink-0">
        {sections.map((sec, idx) => (
          <button key={idx} type="button" onClick={() => setActiveSection(idx as 0|1|2)}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
              activeSection === idx
                ? "border-emerald-600 text-emerald-700 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>{sec.icon}</span>
            <span>{sec.title}</span>
            {sectionFilled[idx] && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* Section 1 — Method */}
        {activeSection === 0 && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Preparation Procedure
            </label>
            <RichTextEditor value={data.method} onChange={html => update("method", html)} />
          </div>
        )}

        {/* Section 2 — Result */}
        {activeSection === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Calculation Result
              </label>
              <input
                type="text"
                value={data.calculationResult}
                onChange={e => update("calculationResult", e.target.value)}
                placeholder="Enter result value"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Result Unit
              </label>
              <UnitPicker value={data.calculationResultUnit} onChange={v => update("calculationResultUnit", v)} />
            </div>
          </div>
        )}

        {/* Section 3 — Acceptance Limit */}
        {activeSection === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Acceptance Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Minimum (NLT)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-500 pointer-events-none select-none">≥</span>
                    <input
                      type="text"
                      value={data.acceptanceLimitMin}
                      onChange={e => update("acceptanceLimitMin", e.target.value)}
                      placeholder="Min value"
                      className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Maximum (NMT)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-red-400 pointer-events-none select-none">≤</span>
                    <input
                      type="text"
                      value={data.acceptanceLimitMax}
                      onChange={e => update("acceptanceLimitMax", e.target.value)}
                      placeholder="Max value"
                      className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Range preview */}
            {limitPreview && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                {data.acceptanceLimitMin && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-emerald-600">NLT</span>
                    <span className="px-2.5 py-1 bg-white text-gray-900 text-sm font-bold rounded-lg border border-amber-200 font-mono">
                      {data.acceptanceLimitMin}
                    </span>
                  </div>
                )}
                {data.acceptanceLimitMin && data.acceptanceLimitMax && (
                  <div className="flex-1 h-1.5 bg-gradient-to-r from-emerald-400 to-red-400 rounded-full opacity-50" />
                )}
                {data.acceptanceLimitMax && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-red-500">NMT</span>
                    <span className="px-2.5 py-1 bg-white text-gray-900 text-sm font-bold rounded-lg border border-amber-200 font-mono">
                      {data.acceptanceLimitMax}
                    </span>
                  </div>
                )}
                {data.calculationResultUnit && (
                  <span className="text-xs font-semibold text-amber-600">{data.calculationResultUnit}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {sections.map((_, idx) => (
            <button key={idx} type="button" onClick={() => setActiveSection(idx as 0|1|2)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                activeSection === idx ? "text-emerald-700 font-semibold" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                sectionFilled[idx]
                  ? idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-blue-500" : "bg-amber-500"
                  : "bg-gray-300"
              }`} />
              <span className="hidden sm:inline">{["Method","Result","Limit"][idx]}</span>
            </button>
          ))}
          <span className="text-xs text-gray-400">{filledCount}/3</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving || !label.trim()}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2 ${
              isSaving || !label.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlankPreparation;