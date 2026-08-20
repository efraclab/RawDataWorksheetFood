import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Target } from "lucide-react";

export interface PreparationGroupInfo {
    id: string;
    label: string;
    color?: string;
}

interface Props {
    activeGroups: string[];
    groups: Record<string, PreparationGroupInfo>;
    onRemove: (groupId: string) => void;
    isLocked: boolean;
}

const ActivePreparationGroups: React.FC<Props> = ({
    activeGroups,
    groups,
    onRemove,
    isLocked,
}) => {

    const groupInfo: Record<string, PreparationGroupInfo> = {};

    activeGroups
        .filter(
            (groupId) =>
                groupId !== "mobilePhase" &&
                groupId !== "dissoMedia"
        )
        .forEach((groupId) => {

            const group = groups[groupId];

            if (group) {
                groupInfo[groupId] = group;
            }

        });

    return (

        <AnimatePresence>

            {Object.keys(groupInfo).length > 0 ? (

                <motion.div
                    key="active-preparations-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                    layout
                >

                    {/* Header */}

                    <div className="flex items-center gap-3 my-4">

                        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"></div>

                        <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 rounded-full shadow-lg">

                            <span className="text-xs font-bold text-white uppercase tracking-wider">

                                Active Preparation Group

                            </span>

                        </div>

                        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent"></div>

                    </div>

                    <motion.div layout>

                        <div className="flex flex-wrap gap-3">

                            {Object.values(groupInfo).map((group) => (

                                <motion.div
                                    key={group.id}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.8,
                                        y: 20,
                                    }}
                                    whileHover={
                                        isLocked
                                            ? undefined
                                            : { scale: 1.05 }
                                    }
                                    className="group relative inline-flex items-center gap-3 py-2 px-4 bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-400 border-2 rounded-lg font-semibold shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >

                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                    <div className="relative z-10 flex items-center gap-3">

                                        <span className="font-bold text-sm">

                                            {group.label}

                                        </span>

                                    </div>

                                    <motion.button
                                        type="button"
                                        disabled={isLocked}
                                        onClick={() => {

                                            if (isLocked)
                                                return;

                                            onRemove(group.id);

                                        }}
                                        whileHover={
                                            isLocked
                                                ? undefined
                                                : {
                                                    scale: 1.2,
                                                    rotate: 90,
                                                }
                                        }
                                        whileTap={
                                            isLocked
                                                ? undefined
                                                : {
                                                    scale: 0.9,
                                                }
                                        }
                                        className={`relative z-10 w-5 h-5 flex items-center justify-center rounded-full text-white transition-all font-bold border border-white/50 shadow-sm ${
                                            isLocked
                                                ? "bg-emerald-800/40 cursor-not-allowed opacity-60"
                                                : "bg-emerald-800 hover:bg-red-500 hover:border-red-600"
                                        }`}
                                        title={
                                            isLocked
                                                ? `${group.label} is locked`
                                                : `Remove ${group.label}`
                                        }
                                    >

                                        <span className="text-[9px] inline-flex items-center justify-center h-full w-full">

                                            ✕

                                        </span>

                                    </motion.button>

                                </motion.div>

                            ))}

                        </div>

                        {/* Quick Guide */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mt-5 p-4 bg-gradient-to-r from-emerald-50 via-emerald-50 to-emerald-50 border-2 border-emerald-200 rounded-xl shadow-inner"
                        >

                            <div className="flex items-start gap-3">

                                <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">

                                    <span className="text-white text-lg">

                                        💡

                                    </span>

                                </div>

                                <div className="flex-1">

                                    <p className="text-sm text-emerald-800 font-semibold mb-1">

                                        Quick Guide

                                    </p>

                                    <p className="text-xs text-emerald-800 leading-relaxed">

                                        Click the{" "}

                                        <span className="inline-flex items-center justify-center w-5 h-5 bg-white rounded-full text-red-500 font-bold mx-1">

                                            ✕

                                        </span>

                                        {" "}button to remove a preparation group and all its data.

                                        The badge represents the active preparation group.

                                        Use <strong>"Add Preparation"</strong> to enable another preparation.

                                    </p>

                                </div>

                            </div>

                        </motion.div>

                    </motion.div>

                </motion.div>

            ) : (

                <motion.div
                    key="empty-state-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner"
                    layout
                >

                    <div className="inline-block">

                        <Target className="w-14 h-14 text-gray-300" />

                    </div>

                    <p className="text-base font-bold text-gray-800 mb-2">

                        No preparation groups configured yet

                    </p>

                    <p className="text-sm text-gray-600 max-w-md mx-auto">

                        Click the{" "}

                        <strong className="text-emerald-800">

                            "Add Preparation"

                        </strong>

                        {" "}button above to select preparation groups for this parameter.

                    </p>

                </motion.div>

            )}

        </AnimatePresence>

    );
};

export default ActivePreparationGroups;