import React, { useCallback, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { BETPreparation } from "../../../preparation_models/micro/BETPreparation";
import type { BETObservationTube } from "../../../preparation_models/micro/BETObservationTube";
import { CalculatorIcon } from "lucide-react";

// ─── Icons ───────────────────────────────────────────────────────────────────

const FlaskIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M9 3v7L4.5 17A2 2 0 006 21h12a2 2 0 001.5-4L15 10V3" />
        <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
);

const TestTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
        <path d="M8.5 2h7" />
        <path d="M14.5 16h-5" />
    </svg>
);

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);


const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);


// ─── Custom Tube Type Dropdown ────────────────────────────────────────────────

interface TubeTypeDropdownProps {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
}

const TubeTypeDropdown: React.FC<TubeTypeDropdownProps> = ({ value, onChange, disabled = false }) => {
    const [open, setOpen] = useState(false);
    const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const isPositive = value.startsWith("P");

    // Position the portal panel relative to the trigger button
    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const panelHeight = 280; // approximate max height of the dropdown
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < panelHeight && rect.top > panelHeight;

        setPanelStyle({
            position: "fixed",
            left: rect.left,
            width: 192, // w-48
            zIndex: 9999,
            ...(openUpward
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        });
    }, []);

    const handleOpen = () => {
        if (disabled) return;
        updatePosition();
        setOpen(o => !o);
    };

    // Close on outside click (both trigger and panel)
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
                panelRef.current && !panelRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Reposition on scroll / resize
    useEffect(() => {
        if (!open) return;
        const reposition = () => updatePosition();
        window.addEventListener("scroll", reposition, true);
        window.addEventListener("resize", reposition);
        return () => {
            window.removeEventListener("scroll", reposition, true);
            window.removeEventListener("resize", reposition);
        };
    }, [open, updatePosition]);

    const panelContent = (
        <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            style={panelStyle}
            className="bg-white rounded-lg shadow-xl border border-gray-200 py-1 overflow-hidden"
        >
            {Object.entries(TUBE_TYPE_CONFIG).map(([t, c], i, arr) => {
                const isSelected = value === t;
                const isPos = t.startsWith("P");
                const prevIsPos = i > 0 && arr[i - 1][0].startsWith("P");
                const showDivider = i > 0 && isPos !== prevIsPos;
                return (
                    <React.Fragment key={t}>
                        {showDivider && <div className="my-1 mx-3 border-t border-gray-100" />}
                        <button
                            type="button"
                            onMouseDown={e => e.preventDefault()} // prevent blur before click
                            onClick={() => { onChange(t); setOpen(false); }}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left transition-colors duration-100 ${isSelected
                                    ? isPos ? "bg-emerald-50 text-emerald-800" : "bg-sky-50 text-sky-800"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${isPos ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
                                    }`}>{t}</span>
                                <span className="text-[11px] text-gray-500 truncate">{c.label}</span>
                            </div>
                            {isSelected && (
                                <svg className={`w-3.5 h-3.5 flex-shrink-0 ${isPos ? "text-emerald-600" : "text-sky-600"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    </React.Fragment>
                );
            })}
        </motion.div>
    );

    return (
        <div className="inline-block">
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                onClick={handleOpen}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${disabled ? "cursor-not-allowed" : ""} ${isPositive
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100"
                        : "bg-sky-50 text-sky-800 border-sky-200 hover:border-sky-400 hover:bg-sky-100"
                    }`}
            >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPositive ? "bg-emerald-500" : "bg-sky-500"}`} />
                {value}
                <svg
                    className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Portal panel — rendered at document.body so it escapes overflow:hidden */}
            {typeof document !== "undefined" &&
                ReactDOM.createPortal(
                    <AnimatePresence>{open && panelContent}</AnimatePresence>,
                    document.body,
                )
            }
        </div>
    );
};

// ─── Shared styled sub-components ────────────────────────────────────────────

const SectionCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white border border-emerald-100 rounded-xl shadow-sm overflow-hidden ${className}`}>
        {children}
    </div>
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; badge?: React.ReactNode }> = ({ icon, title, subtitle, badge }) => (
    <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100/60 border-b border-emerald-100">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-bold text-emerald-900 tracking-tight">{title}</h4>
                {subtitle && <p className="text-xs text-emerald-600 mt-0.5">{subtitle}</p>}
            </div>
        </div>
        {badge}
    </div>
);

interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    unit?: string;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, placeholder = "", type = "text", unit, readOnly = false, disabled = false, className = "" }) => {
    const effectiveReadOnly = readOnly || disabled;
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">{label}</label>
            <div className={`flex items-center gap-1.5 ${effectiveReadOnly ? "bg-emerald-50" : "bg-white"} border ${effectiveReadOnly ? "border-emerald-200" : "border-gray-200"} rounded-lg px-3 py-2 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all`}>
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    readOnly={effectiveReadOnly}
                    className={`flex-1 text-sm ${effectiveReadOnly ? "text-emerald-700 font-semibold" : "text-gray-800"} bg-transparent outline-none placeholder-gray-300 min-w-0 ${disabled ? "cursor-not-allowed" : ""}`}
                />
                {unit && <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{unit}</span>}
            </div>
        </div>
    );
};

const TextAreaField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; disabled?: boolean }> = ({ label, value, onChange, placeholder = "", rows = 3, disabled = false }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">{label}</label>
        <textarea
            rows={rows}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={disabled}
            className={`w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none placeholder-gray-300 ${disabled ? "cursor-not-allowed bg-gray-50" : ""}`}
        />
    </div>
);

// ─── Tube type config ─────────────────────────────────────────────────────────

const TUBE_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; expectedResult: string }> = {
    NWC: { label: "Negative Water Control", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", expectedResult: "−ve" },
    PWC: { label: "Positive Water Control", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", expectedResult: "+ve" },
    PPC: { label: "Positive Product Control", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", expectedResult: "+ve" },
    NPC: { label: "Negative Product Control", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", expectedResult: "−ve" },
    PSC: { label: "Positive Sample Control", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", expectedResult: "+ve" },
    NSC: { label: "Negative Sample Control", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", expectedResult: "−ve" },
};


// ─── Default factory ──────────────────────────────────────────────────────────

export const createDefaultBETPreparation = (index: number): BETPreparation => ({
    id: Date.now() + index,
    label: `BET Preparation ${index + 1}`,
    dilutionProcedure: "",
    endotoxinLimit: "",
    concentrationOfSample: "",
    lysateSensitivity: "",
    mvd: "",
    observationTubes: [
        { tubeNo: "Tube 1", tubeType: "NWC", waterForBET: "100", endotoxinCSE: "Nil", sample: "Nil", lysate: "100", gelClotFormation: "−ve", result: "" },
        { tubeNo: "Tube 2", tubeType: "PWC", waterForBET: "50", endotoxinCSE: "50", sample: "Nil", lysate: "100", gelClotFormation: "+ve", result: "" },
        { tubeNo: "Tube 3", tubeType: "PPC", waterForBET: "Nil", endotoxinCSE: "50", sample: "50", lysate: "100", gelClotFormation: "+ve", result: "" },
        { tubeNo: "Tube 4", tubeType: "NPC", waterForBET: "50", endotoxinCSE: "Nil", sample: "50", lysate: "100", gelClotFormation: "−ve", result: "" },
        { tubeNo: "Tube 5", tubeType: "NPC", waterForBET: "50", endotoxinCSE: "Nil", sample: "50", lysate: "100", gelClotFormation: "−ve", result: "" },
    ],
    finalResult: "",
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface BETPreparationDetailProps {
    preparation: BETPreparation;
    onChange: (updated: BETPreparation) => void;
    onRemove?: () => void;
    isLocked?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const BETPreparationDetail: React.FC<BETPreparationDetailProps> = ({
    preparation,
    onChange,
    onRemove,
    isLocked = false,
}) => {
    const update = useCallback(<K extends keyof BETPreparation>(key: K, value: BETPreparation[K]) => {
        onChange({ ...preparation, [key]: value });
    }, [preparation, onChange]);

    // ── Tube helpers ──
    const updateTube = (idx: number, field: keyof BETObservationTube, value: string) => {
        const tubes = preparation.observationTubes.map((t, i) => {
            if (i !== idx) return t;
            const updated = { ...t, [field]: value };
            // Auto-set gel clot formation when tube type changes:
            // types starting with "P" → +ve (Positive), "N" → −ve (Negative)
            if (field === "tubeType") {
                updated.gelClotFormation = value.startsWith("P") ? "+ve" : "−ve";
            }
            return updated;
        });
        onChange({ ...preparation, observationTubes: tubes });
    };

    const addTube = () => {
        const nextNo = preparation.observationTubes.length + 1;
        const newTube: BETObservationTube = {
            tubeNo: `Tube ${nextNo}`,
            tubeType: "NPC",
            waterForBET: "",
            endotoxinCSE: "",
            sample: "",
            lysate: "100",
            gelClotFormation: "−ve", // NPC starts with N → negative
            result: "",
        };
        onChange({ ...preparation, observationTubes: [...preparation.observationTubes, newTube] });
    };

    const removeTube = (idx: number) => {
        onChange({
            ...preparation,
            observationTubes: preparation.observationTubes.filter((_, i) => i !== idx),
        });
    };

    // ── Auto-compute MVD ──
    const computedMVD = (() => {
        const el = parseFloat(preparation.endotoxinLimit);
        const cs = parseFloat(preparation.concentrationOfSample);
        const ls = parseFloat(preparation.lysateSensitivity);
        if (!isNaN(el) && !isNaN(cs) && !isNaN(ls) && ls !== 0) {
            return ((el * cs) / ls).toFixed(4);
        }
        return "";
    })();

    const wrapperClass = isLocked ? "opacity-75 select-none" : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className={`space-y-5 ${wrapperClass}`}
        >
            {/* ── Card Header ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-xl flex items-center justify-center shadow-md">
                        <FlaskIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p
                            className="text-base font-bold text-emerald-900 bg-transparent outline-none border-b-2 border-transparent focus:border-emerald-400 transition-colors w-56"
                        >{preparation.label}</p>
                        <p className="text-xs text-emerald-600 font-medium">Bacterial Endotoxin Test — Gel-Clot Method</p>
                    </div>
                </div>
                {onRemove && !isLocked && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRemove}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all"
                    >
                        <TrashIcon className="w-3.5 h-3.5" />
                        Remove
                    </motion.button>
                )}
            </div>

            {/* ══════════════════════════════════════════════
                SECTION 3 — Dilution & MVD Calculation
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<ChevronIcon className="w-4.5 h-4.5 text-white" />}
                    title="Dilution Procedure & MVD Calculation"
                    subtitle="MVD = (Endotoxin Limit × Concentration of Sample) / Lysate Sensitivity"
                />
                <div className="p-5 space-y-4">
                    <TextAreaField
                        label="Dilution Procedure"
                        value={preparation.dilutionProcedure}
                        onChange={v => update("dilutionProcedure", v)}
                        placeholder="Describe the dilution steps performed..."
                        rows={3}
                        disabled={isLocked}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Field
                            label="Endotoxin Limit"
                            type="number"
                            value={preparation.endotoxinLimit}
                            onChange={v => update("endotoxinLimit", v)}
                            placeholder="e.g. 0.25"
                            unit="EU/mL"
                            disabled={isLocked}
                        />
                        <Field
                            label="Concentration of Sample"
                            type="number"
                            value={preparation.concentrationOfSample}
                            onChange={v => update("concentrationOfSample", v)}
                            placeholder="e.g. 10"
                            unit="mg/mL"
                            disabled={isLocked}
                        />
                        <Field
                            label="Lysate Sensitivity (λ)"
                            type="number"
                            value={preparation.lysateSensitivity}
                            onChange={v => update("lysateSensitivity", v)}
                            placeholder="e.g. 0.125"
                            unit="EU/mL"
                            disabled={isLocked}
                        />
                        <Field
                            label="MVD (Computed)"
                            type="number"
                            value={computedMVD || preparation.mvd}
                            onChange={v => update("mvd", v)}
                            readOnly={!!computedMVD}
                            placeholder="Auto-calculated"
                            disabled={isLocked}
                        />
                    </div>

                    {/* MVD Formula Display */}
                    <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CalculatorIcon className="text-white w-4 h-4" />
                        </div>
                        <p className="text-xs text-emerald-800 font-medium">
                            <strong>MVD</strong> = Endotoxin Limit × Concentration of Sample ÷ Lysate Sensitivity
                            {computedMVD && (
                                <span className="ml-2 text-emerald-600 font-bold">= {computedMVD}</span>
                            )}
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 4 — Observations Table
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<TestTubeIcon className="w-4.5 h-4.5 text-white" />}
                    title="Observations"
                    subtitle="Record gel-clot formation results for each tube"
                    badge={
                        !isLocked && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={addTube}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-all shadow-sm"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                Add Tube
                            </motion.button>
                        )
                    }
                />
                <div className="p-5 space-y-4">
                    {/* Volume legend */}
                    <div className="flex flex-wrap gap-2 text-xs">
                        {[
                            { type: "NWC", label: "Negative Water Control" },
                            { type: "PWC", label: "Positive Water Control" },
                            { type: "PPC", label: "Positive Product Control" },
                            { type: "NPC", label: "Negative Product Control" },
                            { type: "PSC", label: "Positive Sample Control" },
                            { type: "NSC", label: "Negative Sample Control" },
                        ].map(({ type, label }) => {
                            const cfg = TUBE_TYPE_CONFIG[type];
                            return (
                                <span key={type} className={`px-2 py-1 ${cfg.bg} ${cfg.border} border ${cfg.color} rounded-md font-semibold`}>
                                    <strong>{type}</strong> | {label}
                                </span>
                            );
                        })}
                    </div>

                    {/* Observations table */}
                    <div className="overflow-x-auto rounded-xl border-2 border-emerald-100">
                        <table className="w-full text-sm border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
                                    <th className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600">Tube No.</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600">Type</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600">Water for BET (µL)</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600">Endotoxin / CSE (µL)</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600">Sample (µL)</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600">Lysate (µL)</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600">Gel Clot Formation</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold">Result</th>
                                    {!isLocked && <th className="px-3 py-3 w-10"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {preparation.observationTubes.map((tube, idx) => {
                                        const gelIsPositive = tube.gelClotFormation === "+ve";

                                        // Shared class for editable input cells:
                                        // transparent border at rest, emerald border + ring on focus, always rounded
                                        const cellInputCls =
                                            "w-full text-sm text-center text-gray-700 bg-transparent outline-none " +
                                            "border border-transparent rounded-md px-1.5 py-1 " +
                                            "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all";

                                        return (
                                            <motion.tr
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className={`border-b border-emerald-50 hover:bg-emerald-50/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                                            >
                                                {/* Tube No — serial label, not editable */}
                                                <td className="px-3 py-2.5 border-r border-emerald-100 text-center">
                                                    <span className="text-xs font-semibold text-gray-600">
                                                        Tube {idx + 1}
                                                    </span>
                                                </td>

                                                {/* Type — custom dropdown */}
                                                <td className="px-3 py-2.5 border-r border-emerald-100 text-center">
                                                    <TubeTypeDropdown
                                                        value={tube.tubeType}
                                                        onChange={v => updateTube(idx, "tubeType", v)}
                                                        disabled={isLocked}
                                                    />
                                                </td>

                                                {/* Water for BET */}
                                                <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                    <input
                                                        value={tube.waterForBET}
                                                        onChange={e => updateTube(idx, "waterForBET", e.target.value)}
                                                        readOnly={isLocked}
                                                        className={`${cellInputCls} ${isLocked ? "cursor-not-allowed" : ""}`}
                                                        placeholder="—"
                                                    />
                                                </td>

                                                {/* Endotoxin CSE */}
                                                <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                    <input
                                                        value={tube.endotoxinCSE}
                                                        onChange={e => updateTube(idx, "endotoxinCSE", e.target.value)}
                                                        readOnly={isLocked}
                                                        className={`${cellInputCls} ${isLocked ? "cursor-not-allowed" : ""}`}
                                                        placeholder="—"
                                                    />
                                                </td>

                                                {/* Sample */}
                                                <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                    <input
                                                        value={tube.sample}
                                                        onChange={e => updateTube(idx, "sample", e.target.value)}
                                                        readOnly={isLocked}
                                                        className={`${cellInputCls} ${isLocked ? "cursor-not-allowed" : ""}`}
                                                        placeholder="—"
                                                    />
                                                </td>

                                                {/* Lysate */}
                                                <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                    <input
                                                        value={tube.lysate}
                                                        onChange={e => updateTube(idx, "lysate", e.target.value)}
                                                        readOnly={isLocked}
                                                        className={`${cellInputCls} ${isLocked ? "cursor-not-allowed" : ""}`}
                                                        placeholder="—"
                                                    />
                                                </td>

                                                {/* Gel Clot Formation — auto-derived badge, read-only */}
                                                <td className="px-3 py-2.5 border-r border-emerald-100 text-center">
                                                    {tube.gelClotFormation ? (
                                                        <span
                                                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${gelIsPositive
                                                                    ? "bg-green-50 text-green-700 border-green-300"
                                                                    : "bg-blue-50 text-blue-700 border-blue-300"
                                                                }`}
                                                        >
                                                            {tube.gelClotFormation}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-300">—</span>
                                                    )}
                                                </td>

                                                {/* Result */}
                                                <td className="px-2 py-2.5 text-center">
                                                    <input
                                                        value={tube.result}
                                                        onChange={e => updateTube(idx, "result", e.target.value)}
                                                        readOnly={isLocked}
                                                        className={`${cellInputCls} ${isLocked ? "cursor-not-allowed" : ""}`}
                                                        placeholder="—"
                                                    />
                                                </td>

                                                {/* Remove tube */}
                                                {!isLocked && (
                                                    <td className="px-2 py-2.5 text-center">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeTube(idx)}
                                                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </motion.button>
                                                    </td>
                                                )}
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Legend note */}
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
                        <strong>Validity Criteria: </strong>
                        Positive Water Control (PWC) and Positive Product/Sample Control (PPC / PSC) must be <strong>+ve</strong>. Negative Water Control (NWC) and Negative Sample Control (NSC / NPC) must be <strong>−ve</strong>.
                        The test is <strong>invalid</strong> if the Positive Control is −ve or the Negative Control is +ve.
                    </div>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 5 — Final Result
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<FlaskIcon className="w-4.5 h-4.5 text-white" />}
                    title="Final Result"
                    subtitle="Overall compliance determination for this BET run"
                />
                <div className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <p className="text-sm text-gray-600 font-medium flex-1">
                            The product under examination
                            <strong className="text-gray-800"> complies / does not comply </strong>
                            with the Bacterial Endotoxin Test:
                        </p>
                        <div className="flex gap-3">
                            {(["Complies", "Does Not Comply"] as const).map(opt => {
                                const isSelected = preparation.finalResult === opt;
                                const isComplies = opt === "Complies";
                                return (
                                    <motion.button
                                        key={opt}
                                        whileHover={isLocked ? undefined : { scale: 1.03 }}
                                        whileTap={isLocked ? undefined : { scale: 0.97 }}
                                        onClick={() => {
                                            if (isLocked) return;
                                            update("finalResult", isSelected ? "" : opt);
                                        }}
                                        disabled={isLocked}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all shadow-sm ${isLocked ? "cursor-not-allowed" : ""} ${isSelected
                                                ? isComplies
                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200"
                                                    : "bg-red-500 text-white border-red-500 shadow-red-200"
                                                : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        {opt}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Result banner */}
                    <AnimatePresence>
                        {preparation.finalResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mt-4 p-4 rounded-xl border-2 ${preparation.finalResult === "Complies"
                                        ? "bg-emerald-50 border-emerald-300"
                                        : "bg-red-50 border-red-300"
                                    }`}
                            >
                                <p className={`text-sm font-bold text-center ${preparation.finalResult === "Complies" ? "text-emerald-800" : "text-red-700"
                                    }`}>
                                    {preparation.finalResult === "Complies"
                                        ? "✓ The product COMPLIES with the Bacterial Endotoxin Test by Gel-Clot Method."
                                        : "✕ The product DOES NOT COMPLY with the Bacterial Endotoxin Test by Gel-Clot Method."}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </SectionCard>
        </motion.div>
    );
};

export default BETPreparationDetail;