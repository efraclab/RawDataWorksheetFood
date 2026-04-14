import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SalmonellaInoculationRow } from "../../../preparation_models/micro/SalmonellaInoculationRow";
import type { SalmonellaPreparation } from "../../../preparation_models/micro/SalmonellaPreparation";
import type { SalmonellaBiochemicalRow } from "../../../preparation_models/micro/SalmonellaBiochemicalRow";

const makeDefaultInoculationRows = (): SalmonellaInoculationRow[] => [
    {
        medium: "Buffeemerald Peptone Water (BPW)",
        colonyCharacteristics: "Turbidity",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "37°C",
        incubationTime: "18-24 hrs",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
    },
    {
        medium: "Rappaport-Vassiliadis (RV) Broth",
        colonyCharacteristics: "Turbidity with color change",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "42°C",
        incubationTime: "24-48 hrs",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
    },
    {
        medium: "Selenite Cystine Broth",
        colonyCharacteristics: "Turbidity",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "37°C",
        incubationTime: "24 hrs",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
    },
    {
        medium: "XLD Agar (From RV Broth)",
        colonyCharacteristics: "Red colonies with black centers (H2S positive)",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "37°C",
        incubationTime: "24-48 hrs",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
    },
    {
        medium: "Bismuth Sulfite Agar",
        colonyCharacteristics: "Black colonies with metallic sheen",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "37°C",
        incubationTime: "24-48 hrs",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
    },
    {
        medium: "Hektoen Enteric (HE) Agar",
        colonyCharacteristics: "Blue-green colonies with black centers",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "37°C",
        incubationTime: "24 hrs",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
    },
];

const makeDefaultBiochemicalRows = (): SalmonellaBiochemicalRow[] => [
    { testName: "Gram's staining", analysisStarted: "", analysisCompleted: "", mediaReagent: "Gram's stain reagents", incubationCondition: "Room temperature", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Catalase Test", analysisStarted: "", analysisCompleted: "", mediaReagent: "3% Hydrogen Peroxide", incubationCondition: "Room temperature", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Oxidase Test", analysisStarted: "", analysisCompleted: "", mediaReagent: "Oxidase reagent", incubationCondition: "Room temperature", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Triple Sugar Iron (TSI) Test", analysisStarted: "", analysisCompleted: "", mediaReagent: "TSI Agar slants", incubationCondition: "37°C / 18-24 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Urease Test", analysisStarted: "", analysisCompleted: "", mediaReagent: "Urea Broth", incubationCondition: "37°C / 4-6 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Indole Production", analysisStarted: "", analysisCompleted: "", mediaReagent: "Tryptone Broth + Kovac's reagent", incubationCondition: "37°C / 24 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Methyl Red Test", analysisStarted: "", analysisCompleted: "", mediaReagent: "MR-VP Medium + Methyl Red", incubationCondition: "37°C / 48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Voges-Proskauer Test", analysisStarted: "", analysisCompleted: "", mediaReagent: "MR-VP Medium + VP reagents", incubationCondition: "37°C / 48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Citrate Utilization", analysisStarted: "", analysisCompleted: "", mediaReagent: "Simmons Citrate Agar", incubationCondition: "37°C / 24-48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Lysine Decarboxylase", analysisStarted: "", analysisCompleted: "", mediaReagent: "Lysine Decarboxylase Broth", incubationCondition: "37°C / 24-48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Arginine Decarboxylase", analysisStarted: "", analysisCompleted: "", mediaReagent: "Arginine Decarboxylase Broth", incubationCondition: "37°C / 24-48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Ornithine Decarboxylase", analysisStarted: "", analysisCompleted: "", mediaReagent: "Ornithine Decarboxylase Broth", incubationCondition: "37°C / 24-48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Motility Test", analysisStarted: "", analysisCompleted: "", mediaReagent: "Motility Test Medium", incubationCondition: "37°C / 18-24 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Malonate Utilization", analysisStarted: "", analysisCompleted: "", mediaReagent: "Malonate Broth", incubationCondition: "37°C / 24-48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Phenylalanine Deaminase", analysisStarted: "", analysisCompleted: "", mediaReagent: "Phenylalanine Agar + 10% FeCl3", incubationCondition: "37°C / 24 hrs", observation: "", referenceObservation: "", blankObservation: "" },
];

// Helper functions to create empty rows
const makeEmptyInoculationRow = (): SalmonellaInoculationRow => ({
    medium: "",
    colonyCharacteristics: "",
    analysisStarted: "",
    analysisCompleted: "",
    incubationTemp: "",
    incubationTime: "",
    sampleResult: "",
    referenceResult: "",
    blankResult: "",
});

const makeEmptyBiochemicalRow = (): SalmonellaBiochemicalRow => ({
    testName: "",
    analysisStarted: "",
    analysisCompleted: "",
    mediaReagent: "",
    incubationCondition: "",
    observation: "",
    referenceObservation: "",
    blankObservation: "",
});

export const createDefaultSalmonellaPreparation = (index: number): SalmonellaPreparation => ({
    id: Date.now() + index,
    label: `Salmonella Preparation ${index + 1}`,
    inoculationRows: makeDefaultInoculationRows(),
    biochemicalRows: makeDefaultBiochemicalRows(),
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

const BugIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" /><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
        <path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" /><path d="M6 13H2" />
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" /><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
        <path d="M22 13h-4" /><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
);

// ─── Shaemerald UI primitives ─────────────────────────────────────────────────────

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

interface SalmonellaPreparationDetailProps {
    preparation: SalmonellaPreparation;
    onChange: (updated: SalmonellaPreparation) => void;
    onRemove?: () => void;
    isLocked?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const SalmonellaPreparationDetail: React.FC<SalmonellaPreparationDetailProps> = ({
    preparation,
    onChange,
    onRemove,
    isLocked = false,
}) => {
    const update = useCallback(
        <K extends keyof SalmonellaPreparation>(key: K, value: SalmonellaPreparation[K]) => {
            onChange({ ...preparation, [key]: value });
        },
        [preparation, onChange],
    );

    // ── Inoculation row helpers ──
    const updateInoculationRow = (idx: number, field: keyof SalmonellaInoculationRow, value: string) => {
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
    const updateBiochemicalRow = (idx: number, field: keyof SalmonellaBiochemicalRow, value: string) => {
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
                        <p className="text-xs text-emerald-600 font-medium">Isolation and Detection of Salmonella</p>
                    </div>
                </div>
                {onRemove && !isLocked && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRemove}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-all"
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
                    icon={<BugIcon className="w-4 h-4 text-white" />}
                    title="Enrichment Protocol"
                    subtitle="Multi-stage enrichment for enhanced Salmonella detection"
                />
                <div className="p-5">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span className="text-emerald-500 text-base leading-none mt-0.5">🔬</span>
                        <div className="text-xs text-emerald-800 leading-relaxed">
                            <strong>Primary Enrichment:</strong> Homogenize sample in Buffeemerald Peptone Water (BPW) at 37°C for 18-24 hours.
                            <br />
                            <strong>Selective Enrichment:</strong> Transfer to Rappaport-Vassiliadis broth (42°C) and Selenite Cystine broth (37°C).
                            <br />
                            <strong>Selective Plating:</strong> Plate on XLD, Bismuth Sulfite, and Hektoen Enteric agars for typical Salmonella colonies.
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
                    subtitle="Sequential enrichment and selective plating for Salmonella isolation"
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
                    <table className="w-full text-sm border-collapse min-w-[1400px]">
                        <thead>
                            <tr className="bg-emerald-700 text-white">
                                <th className={thClass + " text-white border-emerald-600 w-[22%]"}>Medium</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Colony / Growth Characteristics</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Started</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Completed</th>
                                <th className={thClass + " text-white border-emerald-600 w-[5%]"}>Incubation Temp. (℃)</th>
                                <th className={thClass + " text-white border-emerald-600 w-[5%]"}>Incubation Time (Hr.)</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[8%]">Sample</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[8%]">Reference</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[8%]">Blank</th>
                                {!isLocked && <th className="px-2 py-3 w-10 border-l border-emerald-600 "></th>}
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
                                                placeholder="e.g. 37°C"
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
                                                onChange={v => updateInoculationRow(idx, "sampleResult", v)}
                                                placeholder="Result"
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 border-r border-emerald-100 text-center">
                                            <CellInput
                                                value={row.referenceResult}
                                                onChange={v => updateInoculationRow(idx, "referenceResult", v)}
                                                placeholder="Reference"
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 border-r border-emerald-100 text-center">
                                            <CellInput
                                                value={row.blankResult}
                                                onChange={v => updateInoculationRow(idx, "blankResult", v)}
                                                placeholder="Blank"
                                            />
                                        </td>
                                        {!isLocked && (
                                            <td className="px-2 py-2.5 text-center border-l border-emerald-100">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeInoculationRow(idx)}
                                                    className="p-1 text-gray-300 hover:text-emerald-500 transition-colors"
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
                SECTION 4 — Biochemical Tests
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<BeakerIcon className="w-4 h-4 text-white" />}
                    title="Biochemical Tests"
                    subtitle="Comprehensive identification using biochemical characterization"
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
                    <table className="w-full text-sm border-collapse min-w-[1100px]">
                        <thead>
                            <tr className="bg-emerald-700 text-white">
                                <th className={thClass + " text-white border-emerald-600"}>Test Name</th>
                                <th className={thClass + " text-white border-emerald-600"}>Analysis Started</th>
                                <th className={thClass + " text-white border-emerald-600"}>Analysis Completed</th>
                                <th className={thClass + " text-white border-emerald-600"}>Media / Reagent</th>
                                <th className={thClass + " text-white border-emerald-600"}>Incubation Condition</th>
                                <th className={thClass + " text-white border-emerald-600"}>Observation</th>
                                <th className={thClass + " text-white border-emerald-600"}>Reference</th>
                                <th className={thClass + " text-white border-emerald-600"}>Blank</th>
                                {!isLocked && <th className="px-2 py-3 w-10 border-l border-emerald-600"></th>}
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
                                                value={row.incubationCondition}
                                                onChange={v => updateBiochemicalRow(idx, "incubationCondition", v)}
                                                placeholder="e.g. 37°C / 24 hrs"
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
                                                value={row.referenceObservation}
                                                onChange={v => updateBiochemicalRow(idx, "referenceObservation", v)}
                                                placeholder="Reference"
                                            />
                                        </td>
                                        <td className={tdClass}>
                                            <CellInput
                                                value={row.blankObservation}
                                                onChange={v => updateBiochemicalRow(idx, "blankObservation", v)}
                                                placeholder="Blank"
                                            />
                                        </td>
                                        {!isLocked && (
                                            <td className="px-2 py-2.5 text-center border-l border-emerald-100">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeBiochemicalRow(idx)}
                                                    className="p-1 text-gray-300 hover:text-emerald-500 transition-colors"
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
                    subtitle="Overall compliance determination for Salmonella detection"
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

export default SalmonellaPreparationDetail;