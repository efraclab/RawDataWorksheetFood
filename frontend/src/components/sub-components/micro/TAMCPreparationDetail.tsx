import React, { useCallback, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TVCWaterPreparation } from "../../../preparation_models/micro/TVCWaterPreparation";
import type { TVCWaterObservationRow } from "../../../preparation_models/micro/TVCWaterObservationRow";

// ─── Re-export aliased types for TAMC ────────────────────────────────────────
export type TAMCPreparation = TVCWaterPreparation;
export type TAMCObservationRow = TVCWaterObservationRow;

// ─── Dilution options 10^0 … 10^(-10) ────────────────────────────────────────

const DILUTION_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
    exponent: -i,
    label: i === 0 ? "10⁰" : `10⁻${i}`,
}));

const formatExponent = (exp: number | null): string => {
    if (exp === null || exp === undefined) return "—";
    if (exp === 0) return "10⁰";
    const chars = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    const sup = String(Math.abs(exp)).split("").map((d) => chars[parseInt(d)]).join("");
    return `10⁻${sup}`;
};

const trimZeros = (n: number): string =>
  Number.isFinite(n) ? parseFloat(n.toFixed(4)).toString() : "—";

// ─── Calculation helper ───────────────────────────────────────────────────────

const TNTC_VALUES = ["TNTC", "> 300"] as const;
const LESS_THAN_ONE = "< 1";
const ALL_SPECIAL_VALUES = [...TNTC_VALUES, LESS_THAN_ONE] as const;

const getDilutionNumericValue = (dilutionCount: string): number => {
    if (dilutionCount === LESS_THAN_ONE) return 0;
    return parseFloat(dilutionCount);
};

const calculateResult = (rows: TAMCObservationRow[]): string => {
    if (rows.length < 2) return "";
    if (TNTC_VALUES.includes(rows[0].dilutionCount as typeof TNTC_VALUES[number]) || TNTC_VALUES.includes(rows[1].dilutionCount as typeof TNTC_VALUES[number])) return "TNTC";
    if (rows[0].dilutionCount === "" || rows[1].dilutionCount === "") return "";
    const v1 = getDilutionNumericValue(rows[0].dilutionCount);
    const v2 = getDilutionNumericValue(rows[1].dilutionCount);
    if (isNaN(v1) || isNaN(v2)) return "";
    // If both are < 1 (value 0), result is < 10 cfu/g
    if (v1 < 1 && v2 < 1) return "<10 cfu/g";
    const exp = rows[0].dilutionExponent;
    if (exp === null || exp === undefined) return "";
    const dilutionValue = Math.pow(10, exp);
    // One or both may be 0 (< 1 selected) — use 0 in formula for that cell
    const result = (v1 + v2) / (2 * dilutionValue);
    if (result < 1) return "<10 cfu/g";
    return trimZeros(parseFloat(result.toFixed(2)));
};

// ─── Default factories ────────────────────────────────────────────────────────

const UNSET_DILUTION = null as unknown as number;

const makeDefaultObservationRows = (): TAMCObservationRow[] => [
    { replicate: "", dilutionExponent: UNSET_DILUTION, dilutionCount: "", blank: "" },
    { replicate: "", dilutionExponent: UNSET_DILUTION, dilutionCount: "", blank: "" },
];

export const createDefaultTAMCPreparation = (index: number): TAMCPreparation => ({
    id: Date.now() + index,
    label: `TAMC Preparation ${index + 1}`,
    inoculationVolume: "",
    incubationTemp: "",
    incubationTempUnit: "℃",
    incubationTime: "",
    incubationTimeUnit: "Hr.",
    observationRows: makeDefaultObservationRows(),
    calculatedResult: "",
    result: "",
});

// ─── Icons ────────────────────────────────────────────────────────────────────

const MicroscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" />
        <path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
        <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
);

const FlaskIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M9 3v7L4.5 17A2 2 0 006 21h12a2 2 0 001.5-4L15 10V3" />
        <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
);

const CalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="16" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="12" y2="18" /><line x1="16" y1="18" x2="16" y2="18" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
);

// Aerobic/bacteria icon for TAMC
const ActivityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

// ─── Shared UI Primitives ─────────────────────────────────────────────────────

const SectionCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white border border-emerald-100 rounded-xl shadow-sm overflow-hidden ${className}`}>
        {children}
    </div>
);

const SectionHeader: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
}> = ({ icon, title, subtitle, badge }) => (
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

const CellInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    className?: string;
}> = ({ value, onChange, placeholder = "", type = "text", disabled, className = "" }) => (
    <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full text-xs text-gray-700 bg-white outline-none border border-emerald-200 rounded-lg px-2 py-1.5 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    />
);

// ─── Dilution Combo Input — numeric input + TNTC/> 300 dropdown ──────────────

const DilutionComboInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
}> = ({ value, onChange, placeholder = "Enter dil. value", disabled }) => {
    const [dropOpen, setDropOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const isSpecial = ALL_SPECIAL_VALUES.includes(value as typeof ALL_SPECIAL_VALUES[number]);

    useEffect(() => {
        if (!dropOpen) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setDropOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [dropOpen]);

    return (
        <div ref={ref} className="relative flex items-center gap-1.5 w-full">
            <input
                type={isSpecial ? "text" : "number"}
                value={isSpecial ? "" : value}
                onChange={e => !disabled && onChange(e.target.value)}
                placeholder={isSpecial ? value : placeholder}
                disabled={disabled || isSpecial}
                className={[
                    "flex-1 min-w-0 text-xs text-gray-700 bg-white outline-none border border-emerald-200 rounded-lg px-2 py-1.5",
                    "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all",
                    isSpecial
                        ? "placeholder-emerald-600 font-semibold border-emerald-400 bg-emerald-50 cursor-not-allowed"
                        : "placeholder-gray-300",
                    disabled ? "opacity-60 cursor-not-allowed" : "",
                ].join(" ")}
            />
            <div className="relative flex-shrink-0">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setDropOpen(v => !v)}
                    className={[
                        "flex items-center gap-0.5 px-1.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all select-none",
                        dropOpen
                            ? "bg-emerald-700 border-emerald-700 text-white shadow"
                            : isSpecial
                                ? "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500"
                                : "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400",
                        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                    ].join(" ")}
                    title="Select special value"
                >
                    <ChevronDownIcon className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                    {dropOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.12 }}
                            style={{ position: "fixed", zIndex: 9999 }}
                            className="min-w-[100px] bg-white border border-emerald-200 rounded-xl shadow-2xl overflow-hidden"
                            ref={(el) => {
                                if (el && ref.current) {
                                    const btn = ref.current.querySelector("button");
                                    if (btn) {
                                        const r = btn.getBoundingClientRect();
                                        el.style.top = `${r.bottom + 4}px`;
                                        el.style.left = `${r.left}px`;
                                    }
                                }
                            }}
                        >
                            <div className="py-1">
                                {isSpecial && (
                                    <button
                                        type="button"
                                        onClick={() => { onChange(""); setDropOpen(false); }}
                                        className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                                    >
                                        <span className="text-[10px]">✕</span> Clear
                                    </button>
                                )}
                                {/* < 1 option */}
                                {(() => {
                                    const isSel = value === LESS_THAN_ONE;
                                    return (
                                        <button
                                            key={LESS_THAN_ONE}
                                            type="button"
                                            onClick={() => { onChange(LESS_THAN_ONE); setDropOpen(false); }}
                                            className={[
                                                "w-full text-left px-3 py-1.5 text-xs font-semibold tracking-wide",
                                                "flex items-center justify-between transition-colors duration-100",
                                                isSel
                                                    ? "bg-emerald-500 text-white"
                                                    : "text-emerald-900 hover:bg-emerald-50",
                                            ].join(" ")}
                                        >
                                            <span>{LESS_THAN_ONE}</span>
                                            {isSel && <span className="text-emerald-200 text-[10px]">✓</span>}
                                        </button>
                                    );
                                })()}
                                {/* TNTC / > 300 options */}
                                {TNTC_VALUES.map(opt => {
                                    const isSel = value === opt;
                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => { onChange(opt); setDropOpen(false); }}
                                            className={[
                                                "w-full text-left px-3 py-1.5 text-xs font-semibold tracking-wide",
                                                "flex items-center justify-between transition-colors duration-100",
                                                isSel
                                                    ? "bg-emerald-700 text-white"
                                                    : "text-emerald-900 hover:bg-emerald-50",
                                            ].join(" ")}
                                        >
                                            <span>{opt}</span>
                                            {isSel && <span className="text-emerald-200 text-[10px]">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ─── Custom Dilution Dropdown ─────────────────────────────────────────────────

const CustomDilutionDropdown: React.FC<{
    value: number | null;
    onChange: (exp: number) => void;
    disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const hasValue = value !== null && value !== undefined;
    const selectedLabel = hasValue ? (DILUTION_OPTIONS.find(o => o.exponent === value)?.label ?? "") : "";

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(v => !v)}
                className={[
                    "flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold min-w-[90px]",
                    "transition-all select-none",
                    open
                        ? "bg-white border-white text-emerald-800 shadow"
                        : hasValue
                            ? "bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-500"
                            : "bg-emerald-600/70 border-emerald-400/60 text-emerald-100 hover:bg-emerald-500",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
            >
                <span className="tracking-wide">
                    {hasValue ? selectedLabel : "Select…"}
                </span>
                <ChevronDownIcon
                    className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-emerald-700" : "text-current"}`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                        style={{ position: "fixed", zIndex: 9999 }}
                        className="mt-1 min-w-[110px] bg-white border border-emerald-200 rounded-xl shadow-2xl overflow-hidden"
                        ref={(el) => {
                            if (el && ref.current) {
                                const btn = ref.current.querySelector("button");
                                if (btn) {
                                    const r = btn.getBoundingClientRect();
                                    el.style.top = `${r.bottom + 4}px`;
                                    el.style.left = `${r.left}px`;
                                }
                            }
                        }}
                    >
                        <div className="py-1 max-h-52 overflow-y-auto">
                            {DILUTION_OPTIONS.map(opt => {
                                const isSelected = opt.exponent === value;
                                return (
                                    <button
                                        key={opt.exponent}
                                        type="button"
                                        onClick={() => { onChange(opt.exponent); setOpen(false); }}
                                        className={[
                                            "w-full text-left px-3 py-1.5 text-xs font-semibold tracking-wide",
                                            "flex items-center justify-between transition-colors duration-100",
                                            isSelected
                                                ? "bg-emerald-700 text-white"
                                                : "text-emerald-900 hover:bg-emerald-50",
                                        ].join(" ")}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && <span className="text-emerald-200 text-[10px]">✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface TAMCPreparationDetailProps {
    preparation: TAMCPreparation;
    onChange: (updated: TAMCPreparation) => void;
    onRemove?: () => void;
    isLocked?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TAMCPreparationDetail: React.FC<TAMCPreparationDetailProps> = ({
    preparation,
    onChange,
    onRemove,
    isLocked = false,
}) => {
    const update = useCallback(
        <K extends keyof TAMCPreparation>(key: K, value: TAMCPreparation[K]) => {
            onChange({ ...preparation, [key]: value });
        },
        [preparation, onChange],
    );

    const rows: TAMCObservationRow[] =
        preparation.observationRows.length >= 2
            ? preparation.observationRows.slice(0, 2)
            : [
                preparation.observationRows[0] ?? { replicate: "", dilutionExponent: UNSET_DILUTION, dilutionCount: "", blank: "" },
                { replicate: "", dilutionExponent: UNSET_DILUTION, dilutionCount: "", blank: "" },
            ];

    const updateDilution = (exp: number) => {
        const updated = rows.map(r => ({ ...r, dilutionExponent: exp }));
        onChange({ ...preparation, observationRows: updated, calculatedResult: calculateResult(updated) });
    };

    const updateRow = (idx: number, field: keyof TAMCObservationRow, value: string | number) => {
        const updated = rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r));
        onChange({ ...preparation, observationRows: updated, calculatedResult: calculateResult(updated) });
    };

    const isLessThan10 = preparation.calculatedResult === "<10 cfu/g";
    const sharedDilutionExponent: number | null =
        (rows[0]?.dilutionExponent !== null && rows[0]?.dilutionExponent !== undefined)
            ? rows[0].dilutionExponent
            : null;

    const wrapperClass = isLocked
        ? "opacity-75 select-none [&_input]:pointer-events-none [&_input]:cursor-not-allowed [&_button]:pointer-events-none [&_textarea]:pointer-events-none [&_textarea]:cursor-not-allowed"
        : "";

    const thBase = "px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap border-r border-emerald-600 last:border-r-0";
    const tdBase = "px-3 py-2.5 border-r border-emerald-100 last:border-r-0 align-middle";

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
                        <ActivityIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-emerald-900">{preparation.label}</p>
                        <p className="text-xs text-emerald-600 font-medium">Total Aerobic Microbial Count</p>
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
                SECTION 1 — Plating Setup
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<FlaskIcon className="w-4 h-4 text-white" />}
                    title="Plating Setup"
                    subtitle="Pour plate method — specify inoculation volume"
                />
                <div className="p-5">
                    <div className="flex items-center gap-3 w-fit">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider whitespace-nowrap">
                            Inoculation Volume for Pour Plate
                        </span>
                        <CellInput
                            type="number"
                            value={preparation.inoculationVolume}
                            onChange={v => update("inoculationVolume", v)}
                            placeholder="Enter Value"
                            disabled={isLocked}
                            className="w-20"
                        />
                        <span className="text-xs font-semibold text-emerald-700">mL</span>
                    </div>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 2 — Observation Table
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<MicroscopeIcon className="w-4 h-4 text-white" />}
                    title="Observation"
                    subtitle="Colony count per replicate — select dilution factor from dropdown"
                />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[640px]">
                        <thead>
                            <tr className="bg-emerald-700 text-white">
                                <th
                                    rowSpan={1}
                                    className={thBase + " w-[15%] text-center"}
                                    style={{ verticalAlign: "middle" }}
                                >
                                    Incubation<br />Temp ({preparation.incubationTempUnit})
                                </th>
                                <th
                                    className={thBase + " w-[15%] text-center"}
                                    style={{ verticalAlign: "middle" }}
                                >
                                    Time<br />({preparation.incubationTimeUnit})
                                </th>
                                <th
                                    className={thBase + " w-[15%] text-center"}
                                    style={{ verticalAlign: "middle" }}
                                >
                                    Replicate
                                </th>
                                <th
                                    className={thBase + " text-center"}
                                    style={{ verticalAlign: "middle", width: "20%" }}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Dilution</span>
                                        <CustomDilutionDropdown
                                            value={sharedDilutionExponent}
                                            onChange={updateDilution}
                                            disabled={isLocked}
                                        />
                                    </div>
                                </th>
                                <th
                                    className={thBase + " text-center"}
                                    style={{ verticalAlign: "middle", width: "30%" }}
                                >
                                    Blank
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* ── R1 row ── */}
                            <tr className="border-b border-emerald-100 bg-white hover:bg-emerald-50/40 transition-colors">
                                <td rowSpan={2} className="px-3 py-2.5 border-r border-emerald-100 align-middle">
                                    <CellInput
                                        value={preparation.incubationTemp}
                                        onChange={v => update("incubationTemp", v)}
                                        placeholder="Enter Value"
                                        disabled={isLocked}
                                        className="text-center"
                                    />
                                </td>
                                <td rowSpan={2} className="px-3 py-2.5 border-r border-emerald-100 align-middle">
                                    <CellInput
                                        value={preparation.incubationTime}
                                        onChange={v => update("incubationTime", v)}
                                        placeholder="Enter Value"
                                        disabled={isLocked}
                                        className="text-center"
                                    />
                                </td>
                                <td className="px-3 py-2.5 border-r border-emerald-100 align-middle">
                                    <CellInput
                                        value={rows[0].replicate}
                                        onChange={v => updateRow(0, "replicate", v)}
                                        placeholder="Enter Value"
                                        disabled={isLocked}
                                        className="text-center"
                                    />
                                </td>
                                <td rowSpan={2} className="border-r border-emerald-100 align-top p-0">
                                    <div className="flex flex-col divide-y divide-emerald-50">
                                        <div className="px-3 py-2.5">
                                            <DilutionComboInput
                                                value={rows[0].dilutionCount}
                                                onChange={v => updateRow(0, "dilutionCount", v)}
                                                placeholder="Enter dil. value"
                                                disabled={isLocked}
                                            />
                                        </div>
                                        <div className="px-3 py-2.5">
                                            <DilutionComboInput
                                                value={rows[1].dilutionCount}
                                                onChange={v => updateRow(1, "dilutionCount", v)}
                                                placeholder="Enter dil. value"
                                                disabled={isLocked}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className={tdBase}>
                                    <CellInput
                                        type="text"
                                        value={rows[0].blank}
                                        onChange={v => updateRow(0, "blank", v)}
                                        placeholder="Blank"
                                        disabled={isLocked}
                                    />
                                </td>
                            </tr>

                            {/* ── R2 row ── */}
                            <tr className="border-b border-emerald-50 bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors">
                                <td className="px-3 py-2.5 border-r border-emerald-100 align-middle">
                                    <CellInput
                                        value={rows[1].replicate}
                                        onChange={v => updateRow(1, "replicate", v)}
                                        placeholder="Enter Value"
                                        disabled={isLocked}
                                        className="text-center"
                                    />
                                </td>
                                <td className={tdBase}>
                                    <CellInput
                                        type="text"
                                        value={rows[1].blank}
                                        onChange={v => updateRow(1, "blank", v)}
                                        placeholder="Blank"
                                        disabled={isLocked}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 3 — Result Calculation
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<CalculatorIcon className="w-4 h-4 text-white" />}
                    title="Result Calculation"
                />
                <div className="p-5">
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-mono">
                        <div className="flex-1 leading-relaxed">
                            <span className="text-emerald-500 font-bold mr-2">Formula:</span>
                            ({rows[0].dilutionCount || "R1"} + {rows[1].dilutionCount || "R2"})
                            {" ÷ "}
                            (2 × {formatExponent(sharedDilutionExponent)})
                        </div>
                        <div className="w-px self-stretch bg-emerald-200" />
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold whitespace-nowrap ${
                            preparation.calculatedResult === "TNTC"
                                ? "bg-red-50 border-red-300 text-red-700"
                                : isLessThan10
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                : preparation.calculatedResult
                                    ? "bg-white border-emerald-300 text-emerald-800"
                                    : "bg-white border-emerald-200 text-gray-400"
                        }`}>
                            <span className="text-[10px] font-semibold text-emerald-400 mr-1">=</span>
                            {preparation.calculatedResult
                                ? <>{preparation.calculatedResult}{!isLessThan10 && preparation.calculatedResult !== "TNTC" && !preparation.calculatedResult.includes("cfu/g") && <span className="ml-1 text-xs font-medium opacity-60">cfu/g</span>}</>
                                : <span className="italic text-xs font-normal">—</span>
                            }
                        </div>
                    </div>
                </div>
            </SectionCard>

        </motion.div>
        
    );
};

export default TAMCPreparationDetail;