import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ClostridiumInoculationRow } from "../../../preparation_models/micro/ClostridiumInoculationRow";
import type { ClostridiumBiochemicalRow } from "../../../preparation_models/micro/ClostridiumBiochemicalRow";
import type { ClostridiumPreparation } from "../../../preparation_models/micro/ClostridiumPreparation";

const makeDefaultInoculationRows = (): ClostridiumInoculationRow[] => [
    {
        medium: "Homogenize in SCDM Negative Control",
        colonyCharacteristics: "",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "48",
        observation: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Reinforced Medium (With Heat)",
        colonyCharacteristics: "Blackening of the medium",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "48",
        observation: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Reinforced Medium (Without Heat)",
        colonyCharacteristics: "Blackening of the medium",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "48",
        observation: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Columbia Agar (With Heat)",
        colonyCharacteristics: "White colony",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "48",
        observation: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Columbia Agar (Without Heat)",
        colonyCharacteristics: "White colony",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "48",
        observation: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
];

const makeDefaultBiochemicalRows = (): ClostridiumBiochemicalRow[] => [
    {
        testName: "Gram's staining",
        analysisStarted: "",
        analysisCompleted: "",
        mediaReagent: "Gram's staining reagent",
        incubationTemp: "",
        incubationTime: "",
        observation: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        testName: "Catalase Test",
        analysisStarted: "",
        analysisCompleted: "",
        mediaReagent: "Hydrogen peroxide Solution (H2O2)",
        incubationTemp: "",
        incubationTime: "",
        observation: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        testName: "Spore Production",
        analysisStarted: "",
        analysisCompleted: "",
        mediaReagent: "Ellner's Medium",
        incubationTemp: "",
        incubationTime: "",
        observation: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
];

// Helper functions to create empty rows
const makeEmptyInoculationRow = (): ClostridiumInoculationRow => ({
    medium: "",
    colonyCharacteristics: "",
    analysisStarted: "",
    analysisCompleted: "",
    incubationTemp: "",
    incubationTime: "",
    observation: "",
    referenceCulture: "",
    blank: "",
    incubationTempUnit: "℃",
    incubationTimeUnit: "Hr."
});

const makeEmptyBiochemicalRow = (): ClostridiumBiochemicalRow => ({
    testName: "",
    analysisStarted: "",
    analysisCompleted: "",
    mediaReagent: "",
    incubationTemp: "",
    incubationTime: "",
    observation: "",
    blank: "",
    incubationTempUnit: "℃",
    incubationTimeUnit: "Hr."
});

export const createDefaultClostridiumPreparation = (index: number): ClostridiumPreparation => ({
    id: Date.now() + index,
    label: `Clostridium Preparation ${index + 1}`,
    inoculationRows: makeDefaultInoculationRows(),
    biochemicalRows: makeDefaultBiochemicalRows(),
    result: "",
});


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

const BeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
        <path d="M6 14h12" />
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

const ThermometerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1h4z" />
        <path d="M12 3V2" /><path d="M8 10V2c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v8" />
        <circle cx="12" cy="16" r="3" />
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

interface ClostridiumPreparationDetailProps {
    preparation: ClostridiumPreparation;
    onChange: (updated: ClostridiumPreparation) => void;
    onRemove?: () => void;
    isLocked?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ClostridiumPreparationDetail: React.FC<ClostridiumPreparationDetailProps> = ({
    preparation,
    onChange,
    onRemove,
    isLocked = false,
}) => {
    const update = useCallback(
        <K extends keyof ClostridiumPreparation>(key: K, value: ClostridiumPreparation[K]) => {
            onChange({ ...preparation, [key]: value });
        },
        [preparation, onChange],
    );

    // ── Inoculation row helpers ──
    const updateInoculationRow = (idx: number, field: keyof ClostridiumInoculationRow, value: string) => {
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

    // ── Biochemical row helpers ──
    const updateBiochemicalRow = (idx: number, field: keyof ClostridiumBiochemicalRow, value: string) => {
        onChange({
            ...preparation,
            biochemicalRows: preparation.biochemicalRows.map((r: any, i: any) =>
                i === idx ? { ...r, [field]: value } : r
            ),
        });
    };

    const addBiochemicalRow = () => {
        onChange({
            ...preparation,
            biochemicalRows: [...preparation.biochemicalRows, makeEmptyBiochemicalRow()],
        });
    };

    const removeBiochemicalRow = (idx: number) => {
        onChange({
            ...preparation,
            biochemicalRows: preparation.biochemicalRows.filter((_: any, i: any) => i !== idx),
        });
    };

    const wrapperClass = isLocked ? "pointer-events-none opacity-75 select-none" : "";

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
                        <p className="text-xs text-emerald-600 font-medium">Isolation and Detection of Clostridium sp.</p>
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
                SECTION 2 — Preliminary Test Note
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<ThermometerIcon className="w-4 h-4 text-white" />}
                    title="Preliminary Test"
                    subtitle="Sample preparation protocol for Clostridium detection"
                />
                <div className="p-5">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span className="text-emerald-500 text-base leading-none mt-0.5">⚡</span>
                        <div className="text-xs text-emerald-800 leading-relaxed">
                            <strong>Sample Division Protocol:</strong> Divide the sample into two portions (A and B) of 10 ml each.
                            <br />
                            <strong>Heat Treatment:</strong> Heat one portion (Portion A) at <strong>80°C for 10 minutes</strong> and then cool rapidly.
                            <br />
                            <strong>Control:</strong> Don't heat the other portion (Portion B).
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
                    subtitle="Media inoculation steps for both heated and non-heated portions"
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
                                <th className={thClass + " text-white border-emerald-600 w-[20%]"}>Medium</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Colony/Growth Characteristics</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Started</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Completed</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Incubation Temp. (℃)</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Incubation Time (Hr.)</th>
                                <th className={thClass + " text-white border-emerald-600 w-[12%]"}>Observation</th>
                                <th className={thClass + " text-white border-emerald-600 w-[12%]"}>Reference Culture</th>
                                <th className={thClass + " text-white border-emerald-600 w-[12%]"}>Blank</th>
                                {!isLocked && <th className="px-2 py-3 w-10 border-l border-emerald-600">Action</th>}
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
                                                placeholder="e.g. 30-35"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.incubationTime}
                                                type="number"
                                                onChange={v => updateInoculationRow(idx, "incubationTime", v)}
                                                placeholder="e.g. 48"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.observation}
                                                onChange={v => updateInoculationRow(idx, "observation", v)}
                                                placeholder="Observation"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.referenceCulture}
                                                onChange={v => updateInoculationRow(idx, "referenceCulture", v)}
                                                placeholder="Reference"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.blank}
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
                SECTION 4 — Biochemical Identification
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<BeakerIcon className="w-4 h-4 text-white" />}
                    title="Biochemical Identification"
                    subtitle="Identification tests for Clostridium species"
                    badge={
                        !isLocked && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={addBiochemicalRow}
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
                                <th className={thClass + " text-white border-emerald-600 w-[20%]"}>Name of the Test</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Started</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Completed</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Media/Reagent Required</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Incubation Temp. (℃)</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Incubation Time (Hr.)</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Observation</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Blank</th>
                                {!isLocked && <th className="px-2 py-3 w-10 border-l border-emerald-600">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {preparation.biochemicalRows.map((row: any, idx: any) => (
                                    <motion.tr
                                        key={idx}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        className={`border-b border-emerald-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-emerald-50/20"} hover:bg-emerald-50/50`}
                                    >
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.testName}
                                                onChange={v => updateBiochemicalRow(idx, "testName", v)}
                                                placeholder="Test name"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <DateInput
                                                value={row.analysisStarted}
                                                onChange={v => updateBiochemicalRow(idx, "analysisStarted", v)}
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <DateInput
                                                value={row.analysisCompleted}
                                                onChange={v => updateBiochemicalRow(idx, "analysisCompleted", v)}
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.mediaReagent}
                                                onChange={v => updateBiochemicalRow(idx, "mediaReagent", v)}
                                                placeholder="Media / Reagent"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                type="number"
                                                value={row.incubationTemp}
                                                onChange={v => updateBiochemicalRow(idx, "incubationTemp", v)}
                                                placeholder="e.g. 30-35"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.incubationTime}
                                                type="number"
                                                onChange={v => updateBiochemicalRow(idx, "incubationTime", v)}
                                                placeholder="e.g. 48"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.observation}
                                                onChange={v => updateBiochemicalRow(idx, "observation", v)}
                                                placeholder="Observation"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.blank}
                                                onChange={v => updateBiochemicalRow(idx, "blank", v)}
                                                placeholder="Blank"
                                            />
                                        </td>
                                        {!isLocked && (
                                            <td className="px-2 py-2.5 text-center border-l border-emerald-100">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeBiochemicalRow(idx)}
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
                SECTION 5 — Final Result
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<MicroscopeIcon className="w-4 h-4 text-white" />}
                    title="Final Result"
                    subtitle="Overall compliance determination for Clostridium detection"
                />
                <div className="p-5">
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

export default ClostridiumPreparationDetail;