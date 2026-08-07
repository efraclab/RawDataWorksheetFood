import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Target } from "lucide-react";

import type { BufferPreparation as BufferPreparationModel } from "../../../preparation_models/drugs/BufferPreparation";

// Reusing Drug Component
import BufferPreparationDetail from "../drugs/BufferPreparationDetail";

interface Props {

    isLocked: boolean;

    parameterId: number;

    enabled: boolean;

    buffers: BufferPreparationModel[];

    onToggle: (checked: boolean) => void;

    onAdd: () => void;

    onRemove: (bufferId: number) => void;

    onStepChange: (

        bufferId: number,

        stepName: string,

        field:
            | "value1"
            | "unit1"
            | "logBookID"
            | "solventChemical",

        value: string

    ) => void;

}

const FoodBufferPreparation: React.FC<Props> = ({

    isLocked,

    parameterId,

    enabled,

    buffers,

    onToggle,

    onAdd,

    onRemove,

    onStepChange

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
                            : "cursor-pointer"}
                    `}
                >

                    <div className="relative flex items-center justify-center">

                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-all duration-300" />

                        <input
                            type="checkbox"
                            checked={enabled}
                            disabled={isLocked}
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

                                Buffer Preparation

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

                            Toggle buffer preparation section

                        </p>

                    </div>

                </label>

            </div>
            {/* ADD HERE */}
            <AnimatePresence>

                {enabled && (

                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >

                        <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6">

                            {/* Header */}

                            <div className="flex items-center justify-between mb-6">

                                <div className="flex items-center gap-3">

                                    <div className="w-1.5 h-7 bg-emerald-700 rounded-full" />

                                    <div>

                                        <h3 className="text-2xl font-bold text-emerald-900">
                                            Buffer Preparations
                                        </h3>

                                        {/* <p className="text-sm text-emerald-600">
                                            Configure buffer preparations for this parameter
                                        </p> */}

                                    </div>

                                </div>

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
                                    <Plus className="w-5 h-5" />

                                    Add Buffer Preparation
                                </button>

                            </div>

                            {/* Empty State */}

                            {buffers.length === 0 ? (

                                <div
                                    className="
            rounded-3xl
            border-2
            border-dashed
            border-emerald-300
            bg-gradient-to-br
            from-emerald-50
            to-cyan-50
            py-20
            flex
            flex-col
            items-center
            justify-center
        "
                                >

                                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
                                        <Target className="w-9 h-9 text-emerald-500" />
                                    </div>

                                    <h4 className="text-xl font-bold text-emerald-900">
                                        No buffer preparations added yet
                                    </h4>

                                    <p className="text-emerald-600 mt-2">
                                        Click "Add Buffer Preparation" to begin
                                    </p>

                                </div>

                            ) : (

                                <AnimatePresence>

                                    {buffers.map((buffer) => (

                                        <div key={buffer.id}>

                                            <BufferPreparationDetail
                                                buffer={buffer}
                                                isLocked={isLocked}
                                                onStepChange={(
                                                    bufferId,
                                                    stepName,
                                                    field,
                                                    newValue
                                                ) =>
                                                    onStepChange(
                                                        bufferId,
                                                        stepName,
                                                        field,
                                                        newValue
                                                    )
                                                }
                                                onRemove={() => onRemove(buffer.id)}
                                            />

                                        </div>

                                    ))}

                                </AnimatePresence>

                            )}

                        </div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>

    );

};

export default FoodBufferPreparation;