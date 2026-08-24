import React from "react";
import { motion } from "framer-motion";

const Target: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

interface EmptyCalculationProps {
    calculationType?: string;
    addCalculationLabel?: string;
}

const EmptyCalculation: React.FC<EmptyCalculationProps> = ({
    calculationType = "LOD",
    addCalculationLabel = "Add Calculation",
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="
                relative
                overflow-hidden
                mx-4
                mb-4
                text-center
                py-12
                rounded-xl
                border-2
                border-dashed
                border-emerald-300
                bg-gradient-to-br
                from-emerald-50
                via-white
                to-emerald-50
                shadow-inner
            "
        >
            {/* Background Glow */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="
                        absolute
                        top-0
                        left-1/4
                        w-48
                        h-48
                        bg-emerald-500
                        rounded-full
                        mix-blend-multiply
                        blur-2xl
                        animate-pulse
                    "
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="inline-block p-4 bg-white rounded-full shadow-md mb-3">
                    <Target className="w-10 h-10 text-emerald-400" />
                </div>

                <p className="font-semibold text-base text-emerald-800 mb-1">
                    No {calculationType} calculations added yet
                </p>

                <p className="text-xs text-emerald-600/80 max-w-sm mx-auto">
                    Click "{addCalculationLabel}" to begin
                </p>
            </div>
        </motion.div>
    );
};

export default EmptyCalculation;