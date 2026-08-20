import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    parameterId: number;
    enabled: boolean;
    value: string;

    onToggle: (checked: boolean) => void;
    onChange: (value: string) => void;

    isLocked: boolean;
}

const FoodAdditionalInfo: React.FC<Props> = ({
    parameterId,
    enabled,
    value,
    onToggle,
    onChange,
    isLocked
}) => {

    return (
        <div className="mt-8">

            {/* Toggle */}

            <label
                className={`flex items-center gap-4 group relative ${
                    isLocked
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                }`}
            >

                <div className="relative flex items-center justify-center">

                    <div
                        className={`absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-full blur-lg transition-all duration-300 ${
                            isLocked
                                ? "opacity-0"
                                : "opacity-0 group-hover:opacity-20"
                        }`}
                    />

                    <input
                        type="checkbox"
                        checked={enabled}
                        disabled={isLocked}
                        onChange={(e) => {
                            if (isLocked)
                                return;

                            onToggle(e.target.checked);
                        }}
                        className="peer sr-only"
                    />

                    <div
                        className={`relative w-14 h-7 rounded-full border-2 border-emerald-200 bg-gray-200
                        peer-checked:bg-gradient-to-r
                        peer-checked:from-emerald-700
                        peer-checked:to-emerald-900
                        peer-checked:border-emerald-600
                        transition-all duration-300 shadow-inner ${
                            isLocked
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                        }`}
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

                        <span
                            className={`text-base font-bold ${
                                isLocked
                                    ? "text-emerald-800/50"
                                    : "text-emerald-800"
                            }`}
                        >
                            Additional Info
                        </span>

                        <span
                            className={`px-2 py-0.5 text-[10px] font-medium rounded-full
                            ${
                                enabled
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                            }
                            ${
                                isLocked
                                    ? "opacity-60"
                                    : ""
                            }`}
                        >
                            {enabled ? "Active" : "Inactive"}
                        </span>

                    </div>

                    <p
                        className={`text-xs mt-1 ${
                            isLocked
                                ? "text-emerald-500/40"
                                : "text-emerald-500"
                        }`}
                    >
                        Toggle additional information section
                    </p>

                </div>

            </label>

            <AnimatePresence>

                {enabled && (

                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >

                        <div className="mt-4 bg-white rounded-xl shadow-lg border border-emerald-100 p-6">

                            <div>

                                <div className="flex items-center gap-2 mb-3">

                                    <div className="w-1 h-6 bg-emerald-700 rounded-full"></div>

                                    <h3
                                        className={`text-base font-bold ${
                                            isLocked
                                                ? "text-emerald-900/50"
                                                : "text-emerald-900"
                                        }`}
                                    >
                                        Additional Info
                                    </h3>

                                </div>

                                <textarea
                                    rows={5}
                                    value={value}
                                    disabled={isLocked}
                                    onChange={(e) => {
                                        if (isLocked)
                                            return;

                                        onChange(e.target.value);
                                    }}
                                    placeholder="Enter any additional information..."
                                    className={`
                                        w-full
                                        min-h-[120px]
                                        rounded-lg
                                        border
                                        border-emerald-200
                                        px-4
                                        py-3
                                        resize-none
                                        outline-none
                                        transition-all
                                        duration-200

                                        focus:border-emerald-700
                                        focus:ring-2
                                        focus:ring-emerald-700/20

                                        ${
                                            isLocked
                                                ? "opacity-60 cursor-not-allowed bg-gray-50"
                                                : "bg-white"
                                        }
                                    `}
                                />

                            </div>

                        </div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>
    );
};

export default FoodAdditionalInfo;