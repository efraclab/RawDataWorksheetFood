import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BileTolerantPreparation } from "../../../preparation_models/micro/BileTolerantPreparation";
import type { BileTolerantInoculationRow } from "../../../preparation_models/micro/BileTolerantInoculationRow";

const makeDefaultInoculationRows = (): BileTolerantInoculationRow[] => [
    {
        medium: "Soya bean Casein Digest Medium",
        colonyCharacteristics: "",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "20-25",
        incubationTime: "2-5",
        sample: "",
        reference: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Enterobacteria Enrichment Broth-Mossel",
        colonyCharacteristics: "Turbidity",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "24-48",
        sample: "",
        reference: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Violet Red Bile Glucose Agar",
        colonyCharacteristics: "Pink to red or purple colonies",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "24",
        sample: "",
        reference: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
];

// Helper functions to create empty rows
const makeEmptyInoculationRow = (): BileTolerantInoculationRow => ({
    medium: "",
    colonyCharacteristics: "",
    analysisStarted: "",
    analysisCompleted: "",
    incubationTemp: "",
    incubationTime: "",
    sample: "",
    reference: "",
    blank: "",
    incubationTempUnit: "℃",
    incubationTimeUnit: "Hr."
});

export const createDefaultBileTolerantPreparation = (index: number): BileTolerantPreparation => ({
    id: Date.now() + index,
    label: `Bile-Tolerant Preparation ${index + 1}`,
    inoculationRows: makeDefaultInoculationRows(),
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

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const DropletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
);

// ─── Shared UI primitives ─────────────────────────────────────────────────────

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

// ─── Inline text input for table cells ───────────────────────────────────────

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
        className={`w-full text-xs text-gray-700 bg-transparent outline-none border border-gray-200 rounded-lg px-2 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300 ${className}`}
    />
);

// ─── Date Input with emerald focus styling ───────────────────────────────────

const DateInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
    className?: string;
}> = ({ value, onChange, disabled, className = "" }) => (
    <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full text-xs text-gray-700 bg-transparent outline-none border border-gray-200 rounded-lg px-2 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all ${className}`}
    />
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface BileTolerantPreparationDetailProps {
    preparation: BileTolerantPreparation;
    onChange: (updated: BileTolerantPreparation) => void;
    onRemove?: () => void;
    isLocked?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const BileTolerantPreparationDetail: React.FC<BileTolerantPreparationDetailProps> = ({
    preparation,
    onChange,
    onRemove,
    isLocked = false,
}) => {
    const update = useCallback(
        <K extends keyof BileTolerantPreparation>(key: K, value: BileTolerantPreparation[K]) => {
            onChange({ ...preparation, [key]: value });
        },
        [preparation, onChange],
    );

    // ── Inoculation row helpers ──
    const updateInoculationRow = (idx: number, field: keyof BileTolerantInoculationRow, value: string) => {
        onChange({
            ...preparation,
            inoculationRows: preparation.inoculationRows.map((r: any, i: any) =>
                i === idx ? { ...r, [field]: value } : r
            ),
        });
    };

    const addInoculationRow = () => {
        onChange({
            ...preparation,
            inoculationRows: [...preparation.inoculationRows, makeEmptyInoculationRow()],
        });
    };

    const removeInoculationRow = (idx: number) => {
        onChange({
            ...preparation,
            inoculationRows: preparation.inoculationRows.filter((_: any, i: any) => i !== idx),
        });
    };

    const wrapperClass = isLocked
        ? "opacity-75 select-none [&_input]:pointer-events-none [&_input]:cursor-not-allowed [&_select]:pointer-events-none [&_select]:cursor-not-allowed [&_textarea]:pointer-events-none [&_textarea]:cursor-not-allowed"
        : "";

    const thClass = "px-3 py-2.5 text-[11px] font-bold text-emerald-900 uppercase tracking-wider whitespace-nowrap border-r border-emerald-200 last:border-r-0";
    const tdClass = "px-3 py-2.5 border-r border-emerald-100 last:border-r-0 align-top";

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
                        <MicroscopeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p
                            className="text-base font-bold text-emerald-900 bg-transparent outline-none border-2 border-transparent focus:border-emerald-500 focus:bg-emerald-50/50 rounded-lg transition-all w-72"
                            >{preparation.label}</p>
                        <p className="text-xs text-emerald-600 font-medium">Isolation and Detection of Bile-Tolerant Gram-Negative Bacteria</p>
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
                SECTION 2 — Enrichment Protocol
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<DropletIcon className="w-4 h-4 text-white" />}
                    title="Bile-Tolerant Enrichment Protocol"
                    subtitle="Selective enrichment for bile-tolerant gram-negative bacteria"
                />
                <div className="p-5">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span className="text-emerald-500 text-base leading-none mt-0.5">🧪</span>
                        <div className="text-xs text-emerald-800 leading-relaxed">
                            <strong>Initial Enrichment:</strong> Inoculate in Soya bean Casein Digest Medium at 20-25°C for 2-5 hours.
                            <br />
                            <strong>Selective Enrichment:</strong> Transfer to Enterobacteria Enrichment Broth-Mossel at 30-35°C for 24-48 hours.
                            <br />
                            <strong>Selective Plating:</strong> Plate on Violet Red Bile Glucose Agar for pink to red/purple colonies.
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 3 — Inoculation Observations
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<FlaskIcon className="w-4 h-4 text-white" />}
                    title="Inoculation Observations"
                    subtitle="Sequential enrichment and selective isolation steps"
                    badge={
                        !isLocked && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={addInoculationRow}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-all shadow-sm"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                Add Row
                            </motion.button>
                        )
                    }
                />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[1800px]">
                        <thead>
                            <tr className="bg-emerald-700 text-white">
                                <th className={thClass + " text-white border-emerald-600 w-[22%]"}>Medium</th>
                                <th className={thClass + " text-white border-emerald-600 w-[12%]"}>Colony / Growth Characteristics</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Analysis Started</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Analysis Completed</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Incubation Temp. (℃)</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Incubation Time (Hr.)</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[12%]">Sample</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[12%]">Reference</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[12%]">Blank</th>
                                {!isLocked && <th className="px-2 py-3 w-10 border-l border-emerald-600"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {preparation.inoculationRows.map((row: any, idx: any) => (
                                    <motion.tr
                                        key={idx}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        className={`border-b border-emerald-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-emerald-50/20"} hover:bg-emerald-50/50`}
                                    >
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.medium}
                                                onChange={v => updateInoculationRow(idx, "medium", v)}
                                                placeholder="Medium name"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.colonyCharacteristics}
                                                onChange={v => updateInoculationRow(idx, "colonyCharacteristics", v)}
                                                placeholder="Colony characteristics"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <DateInput
                                                value={row.analysisStarted}
                                                onChange={v => updateInoculationRow(idx, "analysisStarted", v)}
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <DateInput
                                                value={row.analysisCompleted}
                                                onChange={v => updateInoculationRow(idx, "analysisCompleted", v)}
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                type="number"
                                                value={row.incubationTemp}
                                                onChange={v => updateInoculationRow(idx, "incubationTemp", v)}
                                                placeholder="e.g. 30-35°C"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                type="number"
                                                value={row.incubationTime}
                                                onChange={v => updateInoculationRow(idx, "incubationTime", v)}
                                                placeholder="e.g. 24-48 hrs"
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 border-r border-emerald-100 text-center">
                                            <CellInput
                                                value={row.sampleResult}
                                                onChange={v => updateInoculationRow(idx, "sample", v)}
                                                placeholder="Result"
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 border-r border-emerald-100 text-center">
                                            <CellInput
                                                value={row.referenceResult}
                                                onChange={v => updateInoculationRow(idx, "reference", v)}
                                                placeholder="Reference"
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 border-r border-emerald-100 text-center">
                                            <CellInput
                                                value={row.blankResult}
                                                onChange={v => updateInoculationRow(idx, "blank", v)}
                                                placeholder="Blank"
                                            />
                                        </td>
                                        {!isLocked && (
                                            <td className="px-2 py-2.5 text-center border-l border-emerald-100">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeInoculationRow(idx)}
                                                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </motion.button>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 4 — Final Result
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<MicroscopeIcon className="w-4 h-4 text-white" />}
                    title="Final Result"
                    subtitle="Overall compliance determination for Bile-Tolerant Gram-Negative Bacteria detection"
                />
                <div className="p-5 space-y-4">
                    <textarea
                        value={preparation.result}
                        onChange={(v) =>
                            update("result", v.target.value)
                        }
                        rows={4}
                        placeholder="Enter any additional information..."
                        className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-y bg-white text-gray-700 placeholder-gray-400"
                    />
                </div>
            </SectionCard>
        </motion.div>
    );
};

export default BileTolerantPreparationDetail;