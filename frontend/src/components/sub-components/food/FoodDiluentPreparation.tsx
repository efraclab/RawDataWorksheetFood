import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Target } from "lucide-react";
import type { DiluentPreparation } from "../../../preparation_models/drugs/DiluentPreparation";
import DiluentPreparationDetail from "../drugs/DiluentPreparationDetail";

interface Props {

    isLocked: boolean;

    parameterId: number;

    enabled: boolean;

    diluentPreparations: DiluentPreparation[];

    onToggle: (checked: boolean) => void;

    onAdd: () => void;

    onEdit: (id: string) => void;

    onRemove: (id: string) => void;
}
const FoodDiluentPreparation: React.FC<Props> = ({

    isLocked,

    parameterId,

    enabled,

    diluentPreparations,

    onToggle,

    onAdd,

    onEdit,

    onRemove

}) => {

    return (
        <div className="mt-8">
            {/* Toggle */}

            <div className="mb-6 mt-4">

                <label
                    className={`
                            flex items-center gap-4 group relative
                            ${isLocked
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                        `}
                >

                    <div className="relative flex items-center justify-center">

                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-all duration-300" />

                        <input
                            disabled={isLocked}
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => onToggle(e.target.checked)}
                            className="peer sr-only"
                        />

                        <div
                            className="
                                    relative
                                    w-14
                                    h-7
                                    rounded-full
                                    border-2
                                    border-emerald-200
                                    bg-gray-200
                                    peer-checked:bg-gradient-to-r
                                    peer-checked:from-emerald-700
                                    peer-checked:to-emerald-900
                                    peer-checked:border-emerald-600
                                    transition-all
                                    duration-300
                                    shadow-inner
                                    "
                        >

                            <motion.div
                                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                                animate={{
                                    x: enabled ? 28 : 0
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                }}
                            >

                                {enabled ? (

                                    <svg
                                        className="w-3 h-3 text-emerald-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>

                                ) : (

                                    <svg
                                        className="w-3 h-3 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>

                                )}

                            </motion.div>

                        </div>

                    </div>

                    <div className="flex-1">

                        <div className="flex items-center gap-2">

                            <span className="text-base font-bold text-emerald-800">

                                Diluent Preparation

                            </span>

                            <span
                                className={`px-2 py-0.5 text-[10px] font-medium rounded-full
                                        ${enabled
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-gray-100 text-gray-500 border border-gray-200"
                                    }`}
                            >
                                {enabled ? "Active" : "Inactive"}
                            </span>

                        </div>

                        <p className="text-xs text-emerald-600/70">

                            Toggle diluent preparation section

                        </p>

                    </div>

                </label>

            </div>
            {/* ADD HERE */}
            {/* Diluent Preparation Section */}
            <AnimatePresence>
                {enabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-6 bg-white rounded-xl border-2 border-emerald-200 shadow-lg"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">

                            <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5">
                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>
                                Diluent Preparation
                            </h3>

                            <button
                                disabled={isLocked}
                                onClick={onAdd}
                                className="
                                flex items-center gap-1.5
                                px-6 py-3
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                rounded-xl
                                font-semibold
                                shadow-lg
                                transition-all
                                duration-200
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                disabled:hover:bg-emerald-600
                            "
                            >
                                + Add Diluent Preparation
                            </button>

                        </div>

                        {/* Body */}
                        {diluentPreparations.length === 0 ? (

                            <div className="text-center py-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl">

                                <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                                    <Target className="w-10 h-10 text-emerald-400" />
                                </div>

                                <p className="text-lg font-bold text-emerald-800">
                                    No diluent preparation added yet
                                </p>

                                <p className="text-sm text-emerald-600 mt-2">
                                    Click "Add Diluent Preparation" to create a diluent preparation
                                </p>

                            </div>

                        ) : (

                            <AnimatePresence>
                                {diluentPreparations.map((diluent) => (

                                    <div key={diluent.id}>

                                        <DiluentPreparationDetail
                                            diluentPreparation={diluent}
                                            isLocked={isLocked}
                                            onEdit={onEdit}
                                            onRemove={onRemove}
                                        />

                                    </div>

                                ))}
                            </AnimatePresence>

                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FoodDiluentPreparation;