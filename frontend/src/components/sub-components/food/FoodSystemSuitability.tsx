import type { SystemSuitability } from "../../../preparation_models/drugs/SystemSuitability";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Target } from "lucide-react";
import SystemSuitabilityDetail from "../drugs/SystemSuitabilityDetail";

interface Props {
    parameterId: number;
    enabled: boolean;
    systemSuitabilities: SystemSuitability[];

    onToggle: (checked: boolean) => void;
    onAdd: () => void;
    onRemove: (id: number) => void;

    onStepChange: (
        suitabilityId: number,
        stepName: string,
        field: "value1" | "value2" | "value3" | "value4",
        value: string
    ) => void;

    onAddStep: (
        suitabilityId: number,
        stepName: string,
        limitType?: string
    ) => void;

    onRemoveStep: (
        suitabilityId: number,
        stepName: string
    ) => void;
}
const FoodSystemSuitability: React.FC<Props> = ({
    parameterId,
    enabled,
    systemSuitabilities,
    onToggle,
    onAdd,
    onRemove,
    onStepChange,
    onAddStep,
    onRemoveStep,
}) => {
    return (

        <div className="mt-8">

            {/* Toggle */}

            <div className="mb-6 mt-4">

                <label className="flex items-center gap-4 cursor-pointer group relative">

                    <div className="relative flex items-center justify-center">

                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-all duration-300" />

                        <input
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

                                System Suitability

                            </span>

                            <span
                                className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${enabled
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                                    }`}
                            >
                                {enabled ? "Active" : "Inactive"}
                            </span>

                        </div>

                        <p className="text-xs text-emerald-600/70">

                            Toggle system suitability section

                        </p>

                    </div>

                </label>

            </div>

            {/* ADD THE MAIN SECTION HERE */}
            <AnimatePresence>

                {enabled && (

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-6 bg-white rounded-xl border-2 border-emerald-200 shadow-lg"
                    >

                        <div className="flex items-center justify-between mb-4">

                            <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2.5">

                                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full"></span>

                                System Suitability

                            </h3>

                            <button
                                onClick={onAdd}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg text-sm"
                            >
                                <Plus className="w-4 h-4" />

                                Add System Suitability

                            </button>

                        </div>

                        {systemSuitabilities.length === 0 ? (

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden text-center py-10 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
                            >

                                <div className="relative z-10">

                                    <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">

                                        <Target className="w-12 h-12 text-emerald-400" />

                                    </div>

                                    <p className="text-lg font-bold text-emerald-800 mb-2">

                                        No system suitability added yet

                                    </p>

                                    <p className="text-sm text-emerald-600">

                                        Click "Add System Suitability" to begin

                                    </p>

                                </div>

                            </motion.div>

                        ) : (

                            <AnimatePresence>

                                {systemSuitabilities.map((suitability) => (

                                    <div key={suitability.id}>

                                        <SystemSuitabilityDetail
                                            systemSuitability={suitability}
                                            onRemove={() => onRemove(suitability.id)}
                                            onStepChange={(
                                                suitabilityId,
                                                stepName,
                                                field,
                                                value
                                            ) =>
                                                onStepChange(
                                                    suitabilityId,
                                                    stepName,
                                                    field,
                                                    value
                                                )
                                            }
                                            onAddStep={(
                                                suitabilityId,
                                                stepName,
                                                limitType
                                            ) =>
                                                onAddStep(
                                                    suitabilityId,
                                                    stepName,
                                                    limitType
                                                )
                                            }
                                            onRemoveStep={(
                                                suitabilityId,
                                                stepName
                                            ) =>
                                                onRemoveStep(
                                                    suitabilityId,
                                                    stepName
                                                )
                                            }
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

export default FoodSystemSuitability;