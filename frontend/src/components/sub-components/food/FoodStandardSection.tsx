import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Target } from "lucide-react";
import { CgTrash } from "react-icons/cg";
import type { Standard } from "../../../preparation_models/Standard";
import type { WorksheetStandard } from "../../../models/WorksheetStandard";




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

interface Props {
    isLocked: boolean

    role: string;

    parameterId: number;

    standards: Standard[];

    addedStandards: Record<number, WorksheetStandard[]>;

    showStandardDropdown: boolean;

    standardSearch: string;

    searchFilteredStandards: Standard[];

    standardRef: React.RefObject<HTMLDivElement | null>;

    isReferenceDataLoading: boolean;

    referenceDataError: string | null;

    formatDate: (date: string | null) => string;

    onToggleDropdown: () => void;

    onSearch: (value: string) => void;

    onAddStandard: (standard: WorksheetStandard) => void;

    onRemoveStandard: (standardId: string) => void;
}

const FoodStandardSection: React.FC<Props> = ({
    isLocked,
    role,
    parameterId,
    standards,
    addedStandards,
    showStandardDropdown,
    standardSearch,
    searchFilteredStandards,
    standardRef,
    isReferenceDataLoading,
    referenceDataError,
    formatDate,
    onToggleDropdown,
    onSearch,
    onAddStandard,
    onRemoveStandard
}) => {

    return (

        <>
            {/* Standards Used - Dynamic with Add/Remove */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5 tracking-tight mb-3">
                        <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
                        Standards Details:
                    </h3>

                    <div className="relative" ref={standardRef}>
                        <button
                            disabled={isLocked}
                            onClick={() => onToggleDropdown()}
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
                            {showStandardDropdown && (
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
                                                type="text"
                                                placeholder="Search standards..."
                                                value={standardSearch}
                                                onChange={(e) =>
                                                    onSearch(e.target.value)
                                                }
                                                className="w-full pl-10 pr-3 py-2 border border-emerald-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {searchFilteredStandards
                                            .filter(
                                                (std) =>
                                                    !addedStandards[
                                                        parameterId
                                                    ]?.find(
                                                        (added) =>
                                                            added.serialNo === std.serialNo,
                                                    ),
                                            )
                                            .map((std) => (
                                                <button
                                                    key={std.serialNo}
                                                    disabled={isLocked}
                                                    onClick={() =>
                                                        onAddStandard(
                                                            {
                                                                id: null,
                                                                parameterId: parameterId,
                                                                serialNo: std.serialNo,
                                                                name: std.name,
                                                                batchNo: std.batchNo ?? null,
                                                                make: std.make ?? null,
                                                                purity: std.purity ?? null,
                                                                validity: std.validity ?? null,
                                                            },
                                                        )
                                                    }
                                                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 border-b border-emerald-200 last:border-b-0 transition-colors text-sm"
                                                >
                                                    <div className="font-semibold text-gray-900">
                                                        {std.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {std.make} • Purity: {std.purity}
                                                    </div>
                                                </button>
                                            ))}
                                        {searchFilteredStandards.filter(
                                            (std) =>
                                                !addedStandards[parameterId]?.find(
                                                    (added) =>
                                                        added.serialNo === std.serialNo,
                                                ),
                                        ).length === 0 && (
                                                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                                    {standardSearch
                                                        ? "No matching standards"
                                                        : "All available standards added"}
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
                                    Name of Standard
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                    Purity
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                    Make
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                    Lot No./Batch No.
                                </th>
                                <th className="px-3 py-2 border-r-2 border-emerald-500 text-left font-bold">
                                    Validity
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
                                {addedStandards[parameterId]?.length >
                                    0 ? (
                                    addedStandards[parameterId].map(
                                        (standard) => (
                                            <motion.tr
                                                key={standard.serialNo}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="border-2 border-emerald-500 hover:bg-emerald-50 transition-colors"
                                            >
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {standard.name || "---"}
                                                </td>
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {standard.purity || "---"}
                                                </td>
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {standard.make || "---"}
                                                </td>
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {standard.batchNo || "---"}
                                                </td>
                                                <td className="px-3 py-2 border-r-2 border-emerald-500">
                                                    {formatDate(standard.validity)}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <motion.button
                                                    disabled={isLocked}
                                                        onClick={() => {
                                                            onRemoveStandard(standard.serialNo)
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
                                            colSpan={role === "Reviewer" ? 6 : 5}
                                            className="px-3 py-4 text-center text-gray-500"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Target className="w-8 h-8 opacity-30" />
                                                <span>
                                                    {role === "Reviewer"
                                                        ? 'No standards added. Click "Add Standard" to add.'
                                                        : "No standards added yet."}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>

        </>

    );

};

export default FoodStandardSection;