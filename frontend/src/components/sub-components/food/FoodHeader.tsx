import React from "react";
import { motion } from "framer-motion";

interface FoodHeaderProps {
    worksheetId: string;
    registrationNo: string;
    sampleName: string;
    parameterCount: number | undefined;
    dueDate?: string | null;
    displayStatus?: string | null;
}

const FoodHeader: React.FC<FoodHeaderProps> = ({
    worksheetId,
    registrationNo,
    sampleName,
    parameterCount,
    dueDate,
    displayStatus
}) => {

    const formatDate = (date?: string | null) => {

        if (!date)
            return "---";

        const d = new Date(date);

        if (isNaN(d.getTime()))
            return date;

        return d.toLocaleDateString("en-GB");
    };

    return (

        <>
            <div className="flex justify-end mb-6 pb-4 border-b border-slate-200">

                <img
                    src="/ic_efrac.png"
                    alt="EFRAC"
                    className="h-12"
                />

            </div>

            {/* Header */}

            <div className="my-4 border border-emerald-900/40 mb-6 rounded-xl overflow-hidden shadow-xl">

                <div className="relative flex justify-between items-center px-6 py-5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 overflow-hidden">

                    <div
                        className="absolute inset-0 opacity-[0.045] pointer-events-none"
                        style={{
                            backgroundImage:
                                "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
                            backgroundSize: "18px 18px"
                        }}
                    />

                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

                    <div className="absolute bottom-0 left-12 w-28 h-28 rounded-full bg-teal-300/10 blur-2xl pointer-events-none" />

                    <div className="relative flex items-center gap-4">

                        <h1 className="flex items-baseline gap-3 tracking-wide text-white">

                            <span className="text-sm font-semibold">
                                Worksheet ID:
                            </span>

                            <span className="text-2xl font-extrabold">
                                {worksheetId}
                            </span>

                        </h1>

                        {displayStatus && (

                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    duration: 0.6
                                }}
                                className="ml-4"
                            >

                                <div className="relative px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 flex items-center gap-2">

                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [1, .7, 1]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity
                                        }}
                                    >

                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                                            />

                                        </svg>

                                    </motion.div>

                                    <span className="text-xs font-bold text-white uppercase">

                                        {displayStatus}

                                    </span>

                                </div>

                            </motion.div>

                        )}

                    </div>

                </div>

            </div>

            {/* Information Card */}

            <div className="my-4 border border-emerald-900/30 rounded-xl overflow-hidden shadow-md">

                <div className="relative grid grid-cols-2 border-b border-white/10 text-sm bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 overflow-hidden">

                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage:
                                "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
                            backgroundSize: "16px 16px"
                        }}
                    />

                    <div className="relative flex items-center px-4 py-3 border-r border-white/10">

                        <span className="font-bold mr-2 text-emerald-300 text-xs uppercase tracking-wider">

                            Registration No:

                        </span>

                        <span className="font-semibold text-white text-sm">

                            {registrationNo || "---"}

                        </span>

                    </div>

                    <div className="relative flex items-center px-4 py-3">

                        <span className="font-bold mr-2 text-emerald-300 text-xs uppercase tracking-wider">

                            Sample Name:

                        </span>

                        <span className="font-semibold text-white text-sm">

                            {sampleName || "---"}

                        </span>

                    </div>

                </div>

                <div className="grid grid-cols-2 text-sm bg-white">

                    <div className="flex items-center px-4 py-3 border-r border-emerald-100">

                        <span className="font-bold mr-2 text-emerald-800">

                            Number of Parameters:

                        </span>

                        <span className="font-semibold text-slate-700">

                            {parameterCount}

                        </span>

                    </div>

                    <div className="flex items-center px-4 py-3">

                        <span className="font-bold mr-2 text-emerald-800">

                            Due Date:

                        </span>

                        <span className="font-semibold text-slate-700">

                            {formatDate(dueDate)}

                        </span>

                    </div>

                </div>

            </div>

        </>

    );

};

export default FoodHeader;