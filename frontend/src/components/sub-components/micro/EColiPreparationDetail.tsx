import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EcoliObservationRow } from "../../../preparation_models/micro/EColiObservationRow";
import type { EcoliPreparation } from "../../../preparation_models/micro/EColiPreparation";
import { Dna } from "lucide-react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const BacteriaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="4" ry="7" />
        <path d="M12 5V3M12 21v-2" />
        <path d="M8 7l-2-2M18 7l-2 2M8 17l-2 2M18 17l-2-2" />
        <path d="M5 12H3M21 12h-2" />
    </svg>
);

const FlaskIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6M9 3v7L4.5 17A2 2 0 006 21h12a2 2 0 001.5-4L15 10V3" />
        <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
);


const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="4" rx="1" /><path d="M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// ─── Default Data ─────────────────────────────────────────────────────────────

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const DEFAULT_OBSERVATION_ROWS: Omit<EcoliObservationRow, "id">[] = [
    {
        medium: "Inoculation in Soya bean Casein Digest Medium",
        colonyGrowthCharacteristics: "Turbidity",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "18-24",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Inoculation in MacConkey Broth (From Incubated SCDM)",
        colonyGrowthCharacteristics: "Turbidity with acid production",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "24-48",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Inoculation in MacConkey Agar (From Incubated MacConkey Broth)",
        colonyGrowthCharacteristics: "Pink non-mucoid colony",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "30-35",
        incubationTime: "24-72",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
];

const DEFAULT_BIOCHEMICAL_ROWS: Omit<EcoliObservationRow, "id">[] = [
    {
        medium: "EMB Agar",
        colonyGrowthCharacteristics: "Metallic sheen",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "37",
        incubationTime: "24",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Gram's staining",
        colonyGrowthCharacteristics: "",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "",
        incubationTime: "",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Test for Indole",
        colonyGrowthCharacteristics: "",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "35",
        incubationTime: "24-48",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "MR Test",
        colonyGrowthCharacteristics: "",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "35",
        incubationTime: "24-48",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Voges-Proskauer Reaction",
        colonyGrowthCharacteristics: "",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "35",
        incubationTime: "24-48",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
    {
        medium: "Citrate utilization",
        colonyGrowthCharacteristics: "",
        analysisStarted: "",
        analysisCompleted: "",
        incubationTemp: "35",
        incubationTime: "24-48",
        sample: "",
        referenceCulture: "",
        blank: "",
        incubationTempUnit: "℃",
        incubationTimeUnit: "Hr."
    },
];

export const createDefaultEcoliPreparation = (index: number): EcoliPreparation => ({
    id: Date.now() + index,
    label: `E.coli Preparation ${index + 1}`,
    observationRows: DEFAULT_OBSERVATION_ROWS.map((r) => ({ ...r, id: makeId() })),
    biochemicalRows: DEFAULT_BIOCHEMICAL_ROWS.map((r) => ({ ...r, id: makeId() })),
    result: "",
    remarks: "",
});

// ─── Styled sub-components ────────────────────────────────────────────────────

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



// ─── Props ────────────────────────────────────────────────────────────────────

interface EcoliPreparationDetailProps {
    preparation: EcoliPreparation;
    onChange: (updated: EcoliPreparation) => void;
    onRemove?: () => void;
    isLocked?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const EcoliPreparationDetail: React.FC<EcoliPreparationDetailProps> = ({
    preparation,
    onChange,
    onRemove,
    isLocked = false,
}) => {
    const update = useCallback(<K extends keyof EcoliPreparation>(key: K, value: EcoliPreparation[K]) => {
        onChange({ ...preparation, [key]: value });
    }, [preparation, onChange]);

    // ── Observation helpers ──
    const updateObsRow = (id: string, field: keyof EcoliObservationRow, value: string) => {
        onChange({
            ...preparation,
            observationRows: preparation.observationRows.map((r) =>
                r.id === id ? { ...r, [field]: value } : r
            ),
        });
    };

    const addObsRow = () => {
        const newRow: EcoliObservationRow = {
            id: makeId(),
            medium: "",
            colonyGrowthCharacteristics: "",
            analysisStarted: "",
            analysisCompleted: "",
            incubationTemp: "",
            incubationTime: "",
            sample: "",
            referenceCulture: "",
            blank: "",
            incubationTempUnit: "℃",
            incubationTimeUnit: "Hr."
        };
        onChange({ ...preparation, observationRows: [...preparation.observationRows, newRow] });
    };

    const removeObsRow = (id: string) => {
        onChange({ ...preparation, observationRows: preparation.observationRows.filter((r) => r.id !== id) });
    };

    const addBiocRow = () => {
        const newRow: EcoliObservationRow = {
            id: makeId(),
            medium: "",
            colonyGrowthCharacteristics: "",
            analysisStarted: "",
            analysisCompleted: "",
            incubationTemp: "",
            incubationTime: "",
            sample: "",
            referenceCulture: "",
            blank: "",
            incubationTempUnit: "℃",
            incubationTimeUnit: "Hr."
        };
        onChange({ ...preparation, biochemicalRows: [...preparation.biochemicalRows, newRow] });
    };

    const updateBiocRow = (id: string, field: keyof EcoliObservationRow, value: string) => {
        onChange({
            ...preparation,
            biochemicalRows: preparation.biochemicalRows.map((r) =>
                r.id === id ? { ...r, [field]: value } : r
            ),
        });
    };

    const removeBiocRow = (id: string) => {
        onChange({ ...preparation, biochemicalRows: preparation.biochemicalRows.filter((r) => r.id !== id) });
    };

    const wrapperClass = isLocked
        ? "opacity-75 select-none [&_input]:pointer-events-none [&_input]:cursor-not-allowed [&_select]:pointer-events-none [&_select]:cursor-not-allowed [&_textarea]:pointer-events-none [&_textarea]:cursor-not-allowed"
        : "";

    const cellInputCls =
        "w-full text-xs text-center text-gray-700 bg-transparent outline-none " +
        "border border-transparent rounded-md px-1.5 py-1 " +
        "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-gray-300";

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
                        <BacteriaIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p
                            className="text-base font-bold text-emerald-900 bg-transparent outline-none border-b-2 border-transparent focus:border-emerald-400 transition-colors min-w-[220px]"
                        >{preparation.label}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Isolation and Detection of E.coli</p>
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
                SECTION 2 — Observations (Main growth media)
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<FlaskIcon className="w-4 h-4 text-white" />}
                    title="Observations"
                    subtitle="Growth observations across culture media"
                    badge={
                        !isLocked && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={addObsRow}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                Add Row
                            </motion.button>
                        )
                    }
                />
                <div className="p-5">
                    <div className="overflow-x-auto rounded-xl border-2 border-emerald-100">
                        <table className="w-full text-sm border-collapse min-w-[1800px]">
                            <thead>
                                <tr className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
                                    <th className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600 w-[20%]">Medium</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600 w-[16%]">Colony / Growth Characteristics</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[8%]">Analysis Started</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[8%]">Analysis Completed</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[6%]">Incubation Temp. (℃)</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[6%]">Incubation Time (Hr.)</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[12%]">Sample</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[12%]">Ref. Culture</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald w-[12%]">Blank</th>
                                    {!isLocked && <th className="px-3 py-3 w-10" >Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {preparation.observationRows.map((row, idx) => (
                                        <motion.tr
                                            key={row.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.15 }}
                                            className={`border-b border-emerald-50 hover:bg-emerald-50/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                                        >
                                            <td className="px-3 py-2.5 border-r border-emerald-100">
                                                <input
                                                    value={row.medium}
                                                    onChange={(e) => updateObsRow(row.id, "medium", e.target.value)}
                                                    className={`${cellInputCls} text-left`}
                                                    placeholder="Medium name"
                                                />
                                            </td>
                                            <td className="px-3 py-2.5 border-r border-emerald-100">
                                                <input
                                                    value={row.colonyGrowthCharacteristics}
                                                    onChange={(e) => updateObsRow(row.id, "colonyGrowthCharacteristics", e.target.value)}
                                                    className={`${cellInputCls} text-left`}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    type="datetime-local"
                                                    value={row.analysisStarted}
                                                    onChange={(e) => updateObsRow(row.id, "analysisStarted", e.target.value)}
                                                    className={`${cellInputCls} text-[10px]`}
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    type="datetime-local"
                                                    value={row.analysisCompleted}
                                                    onChange={(e) => updateObsRow(row.id, "analysisCompleted", e.target.value)}
                                                    className={`${cellInputCls} text-[10px]`}
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.incubationTemp}
                                                    type="number"
                                                    onChange={(e) => updateObsRow(row.id, "incubationTemp", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.incubationTime}
                                                    type="number"
                                                    onChange={(e) => updateObsRow(row.id, "incubationTime", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.sample}
                                                    onChange={(e) => updateObsRow(row.id, "sample", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.referenceCulture}
                                                    onChange={(e) => updateObsRow(row.id, "referenceCulture", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.blank}
                                                    onChange={(e) => updateObsRow(row.id, "blank", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            {!isLocked && (
                                                <td className="px-2 py-2.5 text-center">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeObsRow(row.id)}
                                                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <TrashIcon className="w-3.5 h-3.5" />
                                                    </motion.button>
                                                </td>
                                            )}
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 3 — Biochemical Confirmation
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<Dna className="w-4 h-4 text-white" />}
                    title="Biochemical Confirmation"
                    subtitle="Select at least 5 suspected colonies and subculture on Nutrient Agar / Broth"
                    badge={
                        !isLocked && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={addBiocRow}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                Add Row
                            </motion.button>
                        )
                    }
                />
                <div className="p-5">

                    <div className="overflow-x-auto rounded-xl border-2 border-emerald-100">
                        <table className="w-full text-sm border-collapse min-w-[1800px]">
                            <thead>
                                <tr className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
                                    <th className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600 w-[20%]">Medium</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600 w-[16%]">Colony / Growth Characteristics</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[8%]">Analysis Started</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[8%]">Analysis Completed</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[6%]">Incubation Temp. (℃)</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[6%]">Incubation Time (Hr.)</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[12%]">Sample</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[12%]">Ref. Culture</th>
                                    <th className="px-3 py-3 text-center text-xs font-bold border-r border-emerald-600 w-[12%]">Blank</th>
                                    {!isLocked && <th className="px-3 py-3 w-10" >Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {preparation.biochemicalRows.map((row, idx) => (
                                        <motion.tr
                                            key={row.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.15 }}
                                            className={`border-b border-emerald-50 hover:bg-emerald-50/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                                        >
                                            <td className="px-3 py-2.5 border-r border-emerald-100">
                                                <input
                                                    value={row.medium}
                                                    onChange={(e) => updateBiocRow(row.id, "medium", e.target.value)}
                                                    className={`${cellInputCls} text-left`}
                                                    placeholder="Medium name"
                                                />
                                            </td>
                                            <td className="px-3 py-2.5 border-r border-emerald-100">
                                                <input
                                                    value={row.colonyGrowthCharacteristics}
                                                    onChange={(e) => updateBiocRow(row.id, "colonyGrowthCharacteristics", e.target.value)}
                                                    className={`${cellInputCls} text-left`}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    type="datetime-local"
                                                    value={row.analysisStarted}
                                                    onChange={(e) => updateBiocRow(row.id, "analysisStarted", e.target.value)}
                                                    className={`${cellInputCls} text-[10px]`}
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    type="datetime-local"
                                                    value={row.analysisCompleted}
                                                    onChange={(e) => updateBiocRow(row.id, "analysisCompleted", e.target.value)}
                                                    className={`${cellInputCls} text-[10px]`}
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.incubationTemp}
                                                    type="number"
                                                    onChange={(e) => updateBiocRow(row.id, "incubationTemp", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.incubationTime}
                                                    type="number"
                                                    onChange={(e) => updateBiocRow(row.id, "incubationTime", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.sample}
                                                    onChange={(e) => updateBiocRow(row.id, "sample", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.referenceCulture}
                                                    onChange={(e) => updateBiocRow(row.id, "referenceCulture", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            <td className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                <input
                                                    value={row.blank}
                                                    onChange={(e) => updateBiocRow(row.id, "blank", e.target.value)}
                                                    className={cellInputCls}
                                                    placeholder="—"
                                                />
                                            </td>
                                            {!isLocked && (
                                                <td className="px-2 py-2.5 text-center">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeBiocRow(row.id)}
                                                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <TrashIcon className="w-3.5 h-3.5" />
                                                    </motion.button>
                                                </td>
                                            )}
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                </div>

                <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
                    <strong>Note: </strong>
                    Perform at minimum 5 biochemical tests on suspected colonies. E.coli is IMViC pattern: <strong>++−−</strong> (Indole +ve, MR +ve, VP −ve, Citrate −ve).
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 4 — Final Result
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<ClipboardIcon className="w-4 h-4 text-white" />}
                    title="Final Result"
                    subtitle="Overall determination for this E.coli test"
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

export default EcoliPreparationDetail;