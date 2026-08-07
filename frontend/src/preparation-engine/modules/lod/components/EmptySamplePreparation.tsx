import React from "react";
import { motion } from "framer-motion";

interface Props {
    onAdd: () => void;
}

const EmptySamplePreparation: React.FC<Props> = ({ onAdd }) => {
    const Target: React.FC<{ className: string }> = ({ className }) => (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
    return (

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden text-center py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl shadow-inner"
        >
            <div className="relative z-10">
                <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-3">
                    <Target className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-base font-bold text-emerald-800 mb-1">
                    No sample preparations added yet
                </p>
                <p className="text-xs text-emerald-600/80 max-w-md mx-auto">
                    Click the add button to create
                    LOD sample preparation
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-100/50 px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-semibold text-emerald-800">
                        Ready to start
                    </span>
                </div>
            </div>
        </motion.div>

    );

};

export default EmptySamplePreparation;