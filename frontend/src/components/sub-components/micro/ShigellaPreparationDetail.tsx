import React, { useCallback } from "react";
import { motion } from "framer-motion";
import type { ShigellaInoculationRow } from "../../../preparation_models/micro/ShigellaInoculationRow";
import type { ShigellaBiochemicalRow } from "../../../preparation_models/micro/ShigellaBiochemicalRow";
import type { ShigellaPreparation } from "../../../preparation_models/micro/ShigellaPreparation";


const makeDefaultInoculationRow = (): ShigellaInoculationRow => ({
    medium: "",
    colonyCharacteristics: "",
    analysisStarted: "",
    analysisCompleted: "",
    incubationTemp: "",
    incubationTime: "",
    sampleResult: "",
    referenceResult: "",
    blankResult: "",
    incubationTempUnit: "℃",
    incubationTimeUnit: "Hr."
});

const makeDefaultBiochemicalRow = (): ShigellaBiochemicalRow => ({
    testName: "",
    analysisStarted: "",
    analysisCompleted: "",
    mediaReagent: "",
    incubationCondition: "",
    observation: "",
    referenceObservation: "",
    blankObservation: "",
});

const makeDefaultInoculationRows = (): ShigellaInoculationRow[] => [
    {
        medium: "Soya bean Casein Digest Medium",
        colonyCharacteristics: "Turbidity",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "18-24 ",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "GN Broth (From Incubated SCDM)",
        colonyCharacteristics: "Turbidity",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "24-48 ",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "XLD Agar (From Incubated GN Broth)",
        colonyCharacteristics: "Red coloemerald translucent colony without black center",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "24-28 ",
        sampleResult: "",
        referenceResult: "",
        blankResult: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
];

const makeDefaultBiochemicalRows = (): ShigellaBiochemicalRow[] => [
    { testName: "Gram's staining", analysisStarted: "", analysisCompleted: "", mediaReagent: "Nutrient Agar", incubationCondition: "37°C / 24 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Motility", analysisStarted: "", analysisCompleted: "", mediaReagent: "Motility Agar", incubationCondition: "37°C / 24 hrs or 4 to 6 days at room temp", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Test for Catalase", analysisStarted: "", analysisCompleted: "", mediaReagent: "Hydrogen Peroxide", incubationCondition: "NA", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Test for Oxidase", analysisStarted: "", analysisCompleted: "", mediaReagent: "Oxidase reagent", incubationCondition: "NA", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Lactose/Glucose fermentation, H₂S Production", analysisStarted: "", analysisCompleted: "", mediaReagent: "TSI Agar Medium", incubationCondition: "37°C / 7 days", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Urease Production", analysisStarted: "", analysisCompleted: "", mediaReagent: "Urea Agar", incubationCondition: "37°C / 24 hrs or 4 days", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Hugh-Leifson's Test", analysisStarted: "", analysisCompleted: "", mediaReagent: "Hugh-Leifson's Test medium", incubationCondition: "37°C / 24 hrs or 4 days", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Phenyl Pyruvic acid production", analysisStarted: "", analysisCompleted: "", mediaReagent: "NA, DL-Phenylalanine, Ferric Chloride", incubationCondition: "3 hrs at room temp", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Citrate utilization", analysisStarted: "", analysisCompleted: "", mediaReagent: "Simmon's Citrate Agar", incubationCondition: "37°C / 4 days", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Indole production", analysisStarted: "", analysisCompleted: "", mediaReagent: "Peptone water, Kovac's reagent", incubationCondition: "37°C / 48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Gelatin liquefaction", analysisStarted: "", analysisCompleted: "", mediaReagent: "Gelatin liquefaction test medium", incubationCondition: "22°C / 4 days", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Malonate utilization", analysisStarted: "", analysisCompleted: "", mediaReagent: "Malonate test medium", incubationCondition: "37°C / 24 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Fermentation of 1% Sucrose", analysisStarted: "", analysisCompleted: "", mediaReagent: "1% Sucrose", incubationCondition: "37°C / 48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Fermentation of 1% Lactose", analysisStarted: "", analysisCompleted: "", mediaReagent: "1% Lactose", incubationCondition: "37°C / 48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Fermentation of 1% Salicin", analysisStarted: "", analysisCompleted: "", mediaReagent: "1% Salicin", incubationCondition: "37°C / 48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Fermentation of 1% Dulcitol", analysisStarted: "", analysisCompleted: "", mediaReagent: "1% Dulcitol", incubationCondition: "37°C / 48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Fermentation of 1% Mannitol", analysisStarted: "", analysisCompleted: "", mediaReagent: "1% Mannitol", incubationCondition: "37°C / 48 hrs", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Dihydrolase & Decarboxylase — Lysine", analysisStarted: "", analysisCompleted: "", mediaReagent: "—", incubationCondition: "37°C / 4 days", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Dihydrolase & Decarboxylase — Arginine", analysisStarted: "", analysisCompleted: "", mediaReagent: "—", incubationCondition: "37°C / 4 days", observation: "", referenceObservation: "", blankObservation: "" },
    { testName: "Dihydrolase & Decarboxylase — Ornithine", analysisStarted: "", analysisCompleted: "", mediaReagent: "—", incubationCondition: "37°C / 4 days", observation: "", referenceObservation: "", blankObservation: "" },
];

export const createDefaultShigellaPreparation = (index: number): ShigellaPreparation => ({
    id: Date.now() + index,
    label: `Shigella Preparation ${index + 1}`,
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
        className={`w-full text-xs text-gray-700 bg-transparent outline-none border border-gray-200 rounded-lg px-2 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300 ${className}`}
    />
);


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


interface ShigellaPreparationDetailProps {
    preparation: ShigellaPreparation;
    onChange: (updated: ShigellaPreparation) => void;
    onRemove?: () => void;
    isLocked?: boolean;
}


const ShigellaPreparationDetail: React.FC<ShigellaPreparationDetailProps> = ({
    preparation,
    onChange,
    onRemove,
    isLocked = false,
}) => {
    const update = useCallback(
        <K extends keyof ShigellaPreparation>(key: K, value: ShigellaPreparation[K]) => {
            onChange({ ...preparation, [key]: value });
        },
        [preparation, onChange],
    );

    const updateInoculationRow = (idx: number, field: keyof ShigellaInoculationRow, value: string) => {
        onChange({
            ...preparation,
            inoculationRows: preparation.inoculationRows.map((r, i) =>
                i === idx ? { ...r, [field]: value } : r
            ),
        });
    };

    const addInoculationRow = () => {
        onChange({
            ...preparation,
            inoculationRows: [...preparation.inoculationRows, makeDefaultInoculationRow()],
        });
    };

    const removeInoculationRow = (idx: number) => {
        onChange({
            ...preparation,
            inoculationRows: preparation.inoculationRows.filter((_, i) => i !== idx),
        });
    };

    const updateBiochemicalRow = (idx: number, field: keyof ShigellaBiochemicalRow, value: string) => {
        onChange({
            ...preparation,
            biochemicalRows: preparation.biochemicalRows.map((r, i) =>
                i === idx ? { ...r, [field]: value } : r
            ),
        });
    };

    const addBiochemicalRow = () => {
        onChange({
            ...preparation,
            biochemicalRows: [...preparation.biochemicalRows, makeDefaultBiochemicalRow()],
        });
    };

    const removeBiochemicalRow = (idx: number) => {
        onChange({
            ...preparation,
            biochemicalRows: preparation.biochemicalRows.filter((_, i) => i !== idx),
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
                        <p className="text-xs text-emerald-600 font-medium">Isolation and Detection of Shigella</p>
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
                SECTION 2 — Inoculation Observations
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<FlaskIcon className="w-4 h-4 text-white" />}
                    title="Inoculation Observations"
                    subtitle="Sequential media inoculation steps — SCDM → GN Broth → XLD Agar"
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
                                <th className={thClass + " text-white border-emerald-600 w-[18%]"}>Colony / Growth Characteristics</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Started</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Completed</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Incubation Temp. (℃)</th>
                                <th className={thClass + " text-white border-emerald-600 w-[6%]"}>Incubation Time (Hr.)</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[12%]">Sample</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[12%]">Reference</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[12%]">Culture Blank</th>
                                {!isLocked && <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {preparation.inoculationRows.map((row, idx) => (
                                <tr
                                    key={idx}
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
                                    <td className="px-3 py-2.5 text-center">
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 3 — Biochemical Tests
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<BeakerIcon className="w-4 h-4 text-white" />}
                    title="Biochemical Tests"
                    subtitle="Comprehensive identification using various biochemical test mediums"
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
                                <th className={thClass + " text-white border-emerald-600 w-[18%]"}>Test Name</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Started</th>
                                <th className={thClass + " text-white border-emerald-600 w-[8%]"}>Analysis Completed</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Media / Reagent</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Incubation Condition</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Observation</th>
                                <th className={thClass + " text-white border-emerald-600 w-[14%]"}>Reference</th>
                                <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center border-r border-emerald-600 w-[14%]">Blank</th>
                                {!isLocked && <th className="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider text-center">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {preparation.biochemicalRows.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={`border-b border-emerald-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-emerald-50/20"} hover:bg-emerald-50/50`}
                                >
                                    <td className={tdClass}>
                                        <CellInput
                                            value={row.testName}
                                            onChange={v => updateBiochemicalRow(idx, "testName", v)}
                                            placeholder="Test Name"
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
                                    <td className="px-3 py-2.5 align-top border-r border-emerald-100">
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
                                </tr>
                            ))}
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
                    subtitle="Overall compliance determination for Shigella detection"
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

export default ShigellaPreparationDetail;