import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Target } from "lucide-react";
import { CgTrash } from "react-icons/cg";

import type { Instrument } from "../../../preparation_models/Instrument";
import type { WorksheetInstrument } from "../../../models/WorksheetInstrument";

interface Props {
    isLocked: boolean;

    role: string;

    parameterId: number;

    instruments: Instrument[];

    addedInstruments: Record<number, WorksheetInstrument[]>;

    showInstrumentDropdown: boolean;

    instrumentSearch: string;

    searchFilteredInstruments: Instrument[];

    instrumentRef: React.RefObject<HTMLDivElement | null>;

    isReferenceDataLoading: boolean;

    referenceDataError: string | null;

    formatDate: (date: string | null) => string;

    onToggleDropdown: () => void;

    onSearch: (value: string) => void;

    onAddInstrument: (instrument: WorksheetInstrument) => void;

    onRemoveInstrument: (instrumentId: string) => void;
}



const ReferenceError: React.FC<{ error: string }> = ({ error }) => (
    <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700 font-medium shadow-sm">
        <div className="flex items-center mb-1">
            <Target className="w-5 h-5 mr-2" />
            Error loading reference data:
        </div>
        <p className="text-xs ml-7 break-words">{error}</p>
    </div>
);
const LoaderCircle: React.FC<{ className: string }> = ({ className }) => (
    <svg
        className={className + " animate-spin"}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
const ReferenceLoading: React.FC = () => (
    <div className="flex items-center justify-center p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-sm text-emerald-800 font-medium shadow-sm">
        <LoaderCircle className="w-5 h-5 mr-3" />
        Loading reference data (Instruments, Chemicals, Standards, Columns)...
    </div>
);
const FoodInstrumentSection: React.FC<Props> = ({
    isLocked,
    role,
    parameterId,
    instruments,
    addedInstruments,
    showInstrumentDropdown,
    instrumentSearch,
    searchFilteredInstruments,
    instrumentRef,
    isReferenceDataLoading,
    referenceDataError,
    formatDate,
    onToggleDropdown,
    onSearch,
    onAddInstrument,
    onRemoveInstrument
}) => {
    

    return (

        <>
            {/* Instruments Details */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight mb-3">
                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                        Instruments Details:
                    </h3>

                    <div className="relative" ref={instrumentRef}>

                        <button
                            disabled={isLocked}
                            onClick={onToggleDropdown}
                            className={`flex items-center gap-2 p-1.5
                            bg-gradient-to-r from-emerald-600 to-emerald-600
                            text-white font-semibold rounded-2xl
                            transition-all shadow-md text-xs
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${!isLocked ? "hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg" : ""}
                            `}
                        >
                            <Plus className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                            {showInstrumentDropdown && !isLocked && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="absolute right-0 mt-2 w-80 bg-white border border-emerald-300 rounded-lg shadow-xl z-50"
                                >
                                    <div className="p-2 border-b border-emerald-200">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                disabled={isLocked}
                                                type="text"
                                                placeholder="Search instruments..."
                                                value={instrumentSearch}
                                                onChange={(e) => onSearch(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {searchFilteredInstruments
                                            .filter(
                                                (inst) =>
                                                    !addedInstruments[
                                                        parameterId
                                                    ]?.find(
                                                        (added) => added.instrumentId === inst.id,
                                                    ),
                                            )
                                            .map((inst) => (
                                                <button
                                                    key={inst.id}
                                                    disabled={isLocked}
                                                    onClick={() =>
                                                        onAddInstrument(
                                                            {
                                                                id: null,
                                                                parameterId: parameterId,
                                                                instrumentId: inst.id,
                                                                name: inst.name,
                                                                instrumentTag: inst.instrumentTag ?? null,
                                                                make: inst.make ?? null,
                                                                calibrationDoneDate: inst.calibrationDoneDate ?? null,
                                                                calibrationDueDate: inst.calibrationDueDate ?? null,
                                                            },
                                                        )
                                                    }
                                                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                                >
                                                    <div className="font-semibold text-gray-900">
                                                        {inst.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {inst.instrumentTag!}
                                                    </div>
                                                </button>
                                            ))}
                                        {searchFilteredInstruments.filter(
                                            (inst) =>
                                                !addedInstruments[
                                                    parameterId
                                                ]?.find(
                                                    (added) => added.instrumentId === inst.id,
                                                ),
                                        ).length === 0 && (
                                                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                    {instrumentSearch
                                                        ? "No matching instruments"
                                                        : "All available instruments added"}
                                                </div>
                                            )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {isReferenceDataLoading && <ReferenceLoading />}
                {referenceDataError && (
                    <ReferenceError error={referenceDataError} />
                )}

                {!isReferenceDataLoading && !referenceDataError && (
                    <table className="w-full border-collapse text-sm shadow-md">
                        <thead>
                            <tr className="bg-emerald-100 border-2 border-emerald-500">
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                    Instrument Tag
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                    Instrument Name
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                    Calibration Done On
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                    Calibration Due On
                                </th>
                                {role === "Reviewer" && (
                                    <th className="px-3 py-2 text-center font-bold w-20">
                                        Action
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {addedInstruments[parameterId]?.length >
                                    0 ? (
                                    addedInstruments[parameterId].map(
                                        (instrument) => (
                                            <motion.tr
                                                key={instrument.instrumentId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                            >
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {instrument.instrumentTag! || "---"}
                                                </td>
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {instrument.name || "---"}
                                                </td>
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {formatDate(instrument.calibrationDoneDate)}
                                                </td>
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {formatDate(instrument.calibrationDueDate)}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <motion.button
                                                       disabled={isLocked}
                                                        onClick={() => {

                                                            if (!instrument.instrumentId)
                                                                return;

                                                            onRemoveInstrument(instrument.instrumentId);

                                                        }}
                                                        whileHover={{
                                                            scale: 1.1,
                                                            rotate: 10,
                                                        }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="mx-2"
                                                    >
                                                        <CgTrash className="w-5 h-5 text-red-500" />
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ),
                                    )
                                ) : (
                                    <tr className="border-2 border-emerald-500">
                                        <td
                                            colSpan={role === "Reviewer" ? 5 : 4}
                                            className="px-3 py-4 text-center text-gray-500"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Target className="w-8 h-8 opacity-30" />
                                                <span>
                                                    {role === "Reviewer"
                                                        ? 'No instruments added. Click "Add Instrument" to add.'
                                                        : "No instruments added yet."}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div >
        </>

    );

};

export default FoodInstrumentSection;