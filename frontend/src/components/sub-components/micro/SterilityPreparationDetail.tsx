import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FilterPaperUsage, GrowthResult, SterilityPreparation, SterilityTestType } from "../../../preparation_models/micro/SterilityPreparation";
import type { SterilityObservationDay } from "../../../preparation_models/micro/SterilityObservationDay";
import type { SterilitySubCultureRow } from "../../../preparation_models/micro/SterilitySubCultureRow";

// ─── Icons ────────────────────────────────────────────────────────────────────

const MicroscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" />
        <path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
        <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
);

const FilterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
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

// ─── Shared UI primitives (matching BETPreparationDetail theme) ───────────────

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

interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    unit?: string;
    className?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, placeholder = "", type = "text", unit, className = "" }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        <label className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder-gray-300 min-w-0"
            />
            {unit && <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{unit}</span>}
        </div>
    </div>
);

// ─── Growth toggle button ─────────────────────────────────────────────────────

const GrowthToggle: React.FC<{
    value: GrowthResult;
    onChange: (v: GrowthResult) => void;
    disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
    const cycle = (): void => {
        if (disabled) return;
        if (value === "") onChange("+ve");
        else if (value === "+ve") onChange("-ve");
        else onChange("");
    };

    return (
        <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={cycle}
            disabled={disabled}
            className={`w-14 h-7 rounded-md text-[11px] font-bold border-2 transition-all select-none ${
                value === "+ve"
                    ? "bg-green-500 text-white border-green-500 shadow-sm shadow-green-200"
                    : value === "-ve"
                    ? "bg-sky-100 text-sky-700 border-sky-300"
                    : "bg-gray-50 text-gray-300 border-gray-200 hover:border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            {value || "—"}
        </motion.button>
    );
};

// ─── Radio-style toggle group ─────────────────────────────────────────────────

function RadioToggle<T extends string>({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-semibold transition-all ${
                            value === opt.value
                                ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                                : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Default factory ──────────────────────────────────────────────────────────

const makeDay = (day: number): SterilityObservationDay => ({
    day,
    date: "",
    sampleFTM: "",
    sampleSCDM: "",
    positiveControlFTM: "",
    positiveControlSCDM: "",
    blankFTM: "",
    blankSCDM: "",
});

const makeSubCultureRow = (): SterilitySubCultureRow => ({
    date: "",
    ftmSampleResult: "",
    ftmPositiveControlResult: "",
    ftmBlankResult: "",
    scdmSampleResult: "",
    scdmPositiveControlResult: "",
    scdmBlankResult: "",
});

export const createDefaultSterilityPreparation = (index: number): SterilityPreparation => ({
    id: Date.now() + index,
    label: `Sterility Preparation ${index + 1}`,
    testType: "Direct Inoculation",
    filterPaperName: "",
    filterPaperDiameter: "",
    filterPaperPoreSize: "",
    filterPaperUsage: "Cut in half",
    observationDays: Array.from({ length: 14 }, (_, i) => makeDay(i + 1)),
    subCultureRows: [makeSubCultureRow(), makeSubCultureRow(), makeSubCultureRow(), makeSubCultureRow()],
    finalResult: "",
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface SterilityPreparationDetailProps {
    preparation: SterilityPreparation;
    onChange: (updated: SterilityPreparation) => void;
    onRemove?: () => void;
    isLocked?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const SterilityPreparationDetail: React.FC<SterilityPreparationDetailProps> = ({
    preparation,
    onChange,
    onRemove,
    isLocked = false,
}) => {
    const update = useCallback(
        <K extends keyof SterilityPreparation>(key: K, value: SterilityPreparation[K]) => {
            onChange({ ...preparation, [key]: value });
        },
        [preparation, onChange],
    );

    // ── Observation day helpers ──
    const updateDay = (dayIdx: number, field: keyof SterilityObservationDay, value: string) => {
        onChange({
            ...preparation,
            observationDays: preparation.observationDays.map((d: any, i: number) =>
                i === dayIdx ? { ...d, [field]: value } : d,
            ),
        });
    };

    const addObservationDay = () => {
        const nextDay = preparation.observationDays.length + 1;
        onChange({
            ...preparation,
            observationDays: [...preparation.observationDays, makeDay(nextDay)],
        });
    };

    const removeObservationDay = (idx: number) => {
        const updated = preparation.observationDays
            .filter((_: any, i: number) => i !== idx)
            .map((d: any, i: number) => ({ ...d, day: i + 1 }));
        onChange({ ...preparation, observationDays: updated });
    };

    // ── Sub-culture helpers ──
    const updateSubCulture = (rowIdx: number, field: keyof SterilitySubCultureRow, value: string) => {
        onChange({
            ...preparation,
            subCultureRows: preparation.subCultureRows.map((r: any, i: number) =>
                i === rowIdx ? { ...r, [field]: value } : r,
            ),
        });
    };

    const addSubCultureRow = () => {
        onChange({ ...preparation, subCultureRows: [...preparation.subCultureRows, makeSubCultureRow()] });
    };

    const removeSubCultureRow = (idx: number) => {
        onChange({ ...preparation, subCultureRows: preparation.subCultureRows.filter((_: any, i: number) => i !== idx) });
    };

    const isMembrane = preparation.testType === "Membrane Filtration";
    const wrapperClass = isLocked
        ? "opacity-75 select-none [&_input]:pointer-events-none [&_input]:cursor-not-allowed [&_select]:pointer-events-none [&_select]:cursor-not-allowed [&_textarea]:pointer-events-none [&_textarea]:cursor-not-allowed"
        : "";

    // Column group header style
    const colGroupHeader = "px-2 py-2 text-center text-[11px] font-bold uppercase tracking-wider";

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
                            className="text-base font-bold text-emerald-900 bg-transparent outline-none border-b-2 border-transparent focus:border-emerald-400 transition-colors w-64"
                            >{preparation.label}</p>
                        <p className="text-xs text-emerald-600 font-medium">Sterility Testing — Bacterial Growth Observation</p>
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
                SECTION 2 — Test Method
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<FilterIcon className="w-4 h-4 text-white" />}
                    title="Test Method"
                    subtitle="Select test type and fill membrane filtration details if applicable"
                />
                <div className="p-5 space-y-5">
                    <RadioToggle<SterilityTestType>
                        label="Test Type"
                        value={preparation.testType}
                        onChange={v => update("testType", v)}
                        options={[
                            { value: "Direct Inoculation", label: "Direct Inoculation" },
                            { value: "Membrane Filtration", label: "Membrane Filtration" },
                        ]}
                    />

                    <AnimatePresence>
                        {isMembrane && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Field
                                        label="Filter Paper Name"
                                        value={preparation.filterPaperName}
                                        onChange={v => update("filterPaperName", v)}
                                        placeholder="e.g. Millipore"
                                    />
                                    <Field
                                        label="Diameter"
                                        value={preparation.filterPaperDiameter}
                                        onChange={v => update("filterPaperDiameter", v)}
                                        placeholder="e.g. 47"
                                        unit="mm"
                                    />
                                    <Field
                                        label="Pore Size"
                                        value={preparation.filterPaperPoreSize}
                                        onChange={v => update("filterPaperPoreSize", v)}
                                        placeholder="e.g. 0.45"
                                        unit="µm"
                                    />
                                    <RadioToggle<FilterPaperUsage>
                                        label="Filter Paper Used As"
                                        value={preparation.filterPaperUsage}
                                        onChange={v => update("filterPaperUsage", v)}
                                        options={[
                                            { value: "Cut in half", label: "Cut in half" },
                                            { value: "Used whole", label: "Used whole" },
                                        ]}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Incubation note */}
                    <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                        <span className="text-amber-500 text-base leading-none mt-0.5">🌡️</span>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            <strong>Incubation Conditions:</strong> FTM (Fluid Thioglycollate Medium) is incubated at{" "}
                            <strong>30–35°C</strong> &amp; SCDM (Soyabean Casein Digest Medium) is incubated at{" "}
                            <strong>20–25°C</strong>
                        </p>
                    </div>
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 3 — 14-Day Observations
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<CalendarIcon className="w-4 h-4 text-white" />}
                    title="Observations"
                    subtitle="Record daily growth (+ve / -ve) for Sample, Positive Control and Blank"
                    badge={
                        !isLocked && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={addObservationDay}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-all shadow-sm"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                Add Row
                            </motion.button>
                        )
                    }
                />
                <div className="p-5">
                    {/* Legend */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                        <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-md">+ve = Growth</span>
                        <span className="px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-700 font-semibold rounded-md">-ve = No Growth</span>
                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-400 font-semibold rounded-md">— = Not recorded</span>
                        <span className="ml-auto text-gray-400 italic">Click a cell to cycle: — → +ve → -ve → —</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-emerald-100">
                        <table className="w-full border-collapse min-w-[860px] text-sm">
                            <thead>
                                {/* Top group headers */}
                                <tr className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
                                    <th rowSpan={2} className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600 w-12">Day</th>
                                    <th rowSpan={2} className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600 w-32">Date</th>
                                    <th colSpan={2} className={`${colGroupHeader} border-r border-emerald-600 bg-emerald-800/50`}>Sample</th>
                                    <th colSpan={2} className={`${colGroupHeader} border-r border-emerald-600 bg-emerald-800/30`}>Positive Control</th>
                                    <th colSpan={2} className={`${colGroupHeader} bg-emerald-800/50`}>Blank</th>
                                    {!isLocked && <th rowSpan={2} className="px-2 py-3 w-10 border-l border-emerald-600" />}
                                </tr>
                                <tr className="bg-emerald-800 text-white text-[11px]">
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">FTM</th>
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">SCDM</th>
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">FTM</th>
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">SCDM</th>
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">FTM</th>
                                    <th className="px-3 py-2 text-center font-semibold border-t border-emerald-600">SCDM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {preparation.observationDays.map((day: any, idx: number) => (
                                        <motion.tr
                                            key={day.day}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 8 }}
                                            className={`border-b border-emerald-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-emerald-50/20"} hover:bg-emerald-50/50`}
                                        >
                                            {/* Day number */}
                                            <td className="px-3 py-2 border-r border-emerald-100 text-center">
                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                                    {day.day}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="px-2 py-2 border-r border-emerald-100">
                                                <input
                                                    type="date"
                                                    value={day.date}
                                                    onChange={e => updateDay(idx, "date", e.target.value)}
                                                    className="w-full text-xs text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-emerald-400 transition-colors"
                                                />
                                            </td>

                                            {/* Sample FTM */}
                                            <td className="px-2 py-2 border-r border-emerald-100 text-center">
                                                <div className="flex justify-center">
                                                    <GrowthToggle
                                                        value={day.sampleFTM}
                                                        onChange={v => updateDay(idx, "sampleFTM", v)}
                                                        disabled={isLocked}
                                                    />
                                                </div>
                                            </td>

                                            {/* Sample SCDM */}
                                            <td className="px-2 py-2 border-r border-emerald-100 text-center">
                                                <div className="flex justify-center">
                                                    <GrowthToggle
                                                        value={day.sampleSCDM}
                                                        onChange={v => updateDay(idx, "sampleSCDM", v)}
                                                        disabled={isLocked}
                                                    />
                                                </div>
                                            </td>

                                            {/* Positive Control FTM */}
                                            <td className="px-2 py-2 border-r border-emerald-100 text-center">
                                                <div className="flex justify-center">
                                                    <GrowthToggle
                                                        value={day.positiveControlFTM}
                                                        onChange={v => updateDay(idx, "positiveControlFTM", v)}
                                                        disabled={isLocked}
                                                    />
                                                </div>
                                            </td>

                                            {/* Positive Control SCDM */}
                                            <td className="px-2 py-2 border-r border-emerald-100 text-center">
                                                <div className="flex justify-center">
                                                    <GrowthToggle
                                                        value={day.positiveControlSCDM}
                                                        onChange={v => updateDay(idx, "positiveControlSCDM", v)}
                                                        disabled={isLocked}
                                                    />
                                                </div>
                                            </td>

                                            {/* Blank FTM */}
                                            <td className="px-2 py-2 border-r border-emerald-100 text-center">
                                                <div className="flex justify-center">
                                                    <GrowthToggle
                                                        value={day.blankFTM}
                                                        onChange={v => updateDay(idx, "blankFTM", v)}
                                                        disabled={isLocked}
                                                    />
                                                </div>
                                            </td>

                                            {/* Blank SCDM */}
                                            <td className="px-2 py-2 text-center">
                                                <div className="flex justify-center">
                                                    <GrowthToggle
                                                        value={day.blankSCDM}
                                                        onChange={v => updateDay(idx, "blankSCDM", v)}
                                                        disabled={isLocked}
                                                    />
                                                </div>
                                            </td>

                                            {/* Remove */}
                                            {!isLocked && (
                                                <td className="px-2 py-2.5 text-center border-l border-emerald-100">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeObservationDay(idx)}
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
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 4 — Sub-culture (after turbidity)
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<FlaskIcon className="w-4 h-4 text-white" />}
                    title="Observations (After Turbidity)"
                    subtitle="Transfer 1.0 mL aliquot from each incubated media container to fresh media — incubate 4 days"
                    badge={
                        !isLocked && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={addSubCultureRow}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-all shadow-sm"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                Add Row
                            </motion.button>
                        )
                    }
                />
                <div className="p-5 space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                        <strong>Note:</strong> If turbidity is observed, transfer 1.0 mL aliquot from each incubated media container to another fresh media container and incubate for 4 days.
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-emerald-100">
                        <table className="w-full border-collapse min-w-[820px] text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
                                    <th rowSpan={2} className="px-3 py-3 text-left text-xs font-bold border-r border-emerald-600 w-32">Date</th>
                                    <th colSpan={3} className={`${colGroupHeader} border-r border-emerald-600 bg-emerald-800/50`}>
                                        Fluid Thioglycollate Media (FTM)
                                    </th>
                                    <th colSpan={3} className={`${colGroupHeader} bg-emerald-800/30`}>
                                        Soyabean Casein Digest Media (SCDM)
                                    </th>
                                    {!isLocked && <th rowSpan={2} className="px-2 py-3 w-10 border-l border-emerald-600" />}
                                </tr>
                                <tr className="bg-emerald-800 text-white text-[11px]">
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">Sample</th>
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">+ve Control</th>
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">Blank</th>
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">Sample</th>
                                    <th className="px-3 py-2 text-center font-semibold border-r border-emerald-700 border-t border-emerald-600">+ve Control</th>
                                    <th className="px-3 py-2 text-center font-semibold border-t border-emerald-600">Blank</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {preparation.subCultureRows.map((row: any, idx: any) => (
                                        <motion.tr
                                            key={idx}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 8 }}
                                            className={`border-b border-emerald-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-emerald-50/20"} hover:bg-emerald-50/50`}
                                        >
                                            {/* Date */}
                                            <td className="px-2 py-2.5 border-r border-emerald-100">
                                                <input
                                                    type="date"
                                                    value={row.date}
                                                    onChange={e => updateSubCulture(idx, "date", e.target.value)}
                                                    className="w-full text-xs text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-emerald-400 transition-colors"
                                                />
                                            </td>

                                            {/* FTM columns */}
                                            {(["ftmSampleResult", "ftmPositiveControlResult", "ftmBlankResult"] as const).map(field => (
                                                <td key={field} className="px-2 py-2.5 border-r border-emerald-100 text-center">
                                                    <div className="flex justify-center">
                                                        <GrowthToggle
                                                            value={row[field]}
                                                            onChange={v => updateSubCulture(idx, field, v)}
                                                            disabled={isLocked}
                                                        />
                                                    </div>
                                                </td>
                                            ))}

                                            {/* SCDM columns */}
                                            {(["scdmSampleResult", "scdmPositiveControlResult", "scdmBlankResult"] as const).map((field, fi) => (
                                                <td key={field} className={`px-2 py-2.5 text-center ${fi < 2 ? "border-r border-emerald-100" : ""}`}>
                                                    <div className="flex justify-center">
                                                        <GrowthToggle
                                                            value={row[field]}
                                                            onChange={v => updateSubCulture(idx, field, v)}
                                                            disabled={isLocked}
                                                        />
                                                    </div>
                                                </td>
                                            ))}

                                            {/* Remove */}
                                            {!isLocked && (
                                                <td className="px-2 py-2.5 text-center border-l border-emerald-100">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeSubCultureRow(idx)}
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
                </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════
                SECTION 5 — Final Result
            ══════════════════════════════════════════════ */}
            <SectionCard>
                <SectionHeader
                    icon={<MicroscopeIcon className="w-4 h-4 text-white" />}
                    title="Final Result"
                    subtitle="Overall compliance determination for this sterility test"
                />
                <div className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <p className="text-sm text-gray-600 font-medium flex-1">
                            The product under examination{" "}
                            <strong className="text-gray-800">complies / does not comply</strong>{" "}
                            with the Sterility Test:
                        </p>
                        <div className="flex gap-3">
                            {(["Complies", "Does Not Comply"] as const).map(opt => {
                                const isSelected = preparation.finalResult === opt;
                                const isComplies = opt === "Complies";
                                return (
                                    <motion.button
                                        key={opt}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => update("finalResult", isSelected ? "" : opt)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all shadow-sm ${
                                            isSelected
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

                    <AnimatePresence>
                        {preparation.finalResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mt-4 p-4 rounded-xl border-2 ${
                                    preparation.finalResult === "Complies"
                                        ? "bg-emerald-50 border-emerald-300"
                                        : "bg-red-50 border-red-300"
                                }`}
                            >
                                <p className={`text-sm font-bold text-center ${
                                    preparation.finalResult === "Complies" ? "text-emerald-800" : "text-red-700"
                                }`}>
                                    {preparation.finalResult === "Complies"
                                        ? "✓ The product COMPLIES with the Sterility Test."
                                        : "✕ The product DOES NOT COMPLY with the Sterility Test."}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </SectionCard>
        </motion.div>
    );
};

export default SterilityPreparationDetail;