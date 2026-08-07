import type { ParameterDetail } from "../../../models/ParameterDetail";
import { IoCardOutline } from "react-icons/io5";

interface Props {
    parameter: ParameterDetail | null;
    onClose: () => void;
}

const FoodParameterOverview: React.FC<Props> = ({
    parameter,
    onClose
}) => {

    if (!parameter)
        return null;

    return (

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-6 overflow-hidden">

            {/* Header */}

            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-800 px-6 py-4">

                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center">

                            <svg
                                className="w-5 h-5 text-emerald-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>

                        </div>

                        <div>

                            <h3 className="text-base font-bold text-white tracking-tight">

                                Parameter Overview

                            </h3>

                            <p className="text-xs text-emerald-300/80 font-medium mt-0.5">

                                Complete analysis information

                            </p>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 transition-all duration-200"
                    >

                        <span className="text-white/80 text-lg font-bold">

                            ✕

                        </span>

                    </button>

                </div>

            </div>

            {/* Body */}
            <div className="bg-slate-50 px-4 py-4">
                <div className="grid grid-cols-2 gap-5">

                    {/* Parameter Code */}

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm px-5 py-4">

                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">

                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>

                            PARAMETER CODE

                        </div>

                        <div className="mt-2 text-2xl font-bold text-slate-800">

                            {parameter.paraCode}

                        </div>

                    </div>

                    {/* Parameter Name */}

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm px-5 py-4">

                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">

                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>

                            PARAMETER NAME

                        </div>

                        <div className="mt-2 text-2xl font-bold text-slate-800">

                            {parameter.parameterName}

                        </div>

                    </div>

                </div>
                {/* Assigned Analyst */}

                <div className="mt-5 rounded-xl border border-slate-200 bg-white shadow-sm px-5 py-4">

                    <div className="flex items-center gap-2 mb-4">

                        <div className="w-1 h-5 rounded-full bg-emerald-500"></div>

                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                            ASSIGNED ANALYST
                        </span>

                    </div>

                    <div className="flex items-start gap-3">

                        <div
                            className="
                                    w-11
                                    h-11
                                    rounded-lg
                                    bg-emerald-500
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                    text-xl
                                    "
                        >

                            {(parameter.analyzedByName ?? "A")
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div>

                            <div className="font-semibold text-slate-800">

                                {parameter.analyzedByName}

                            </div>

                            <div className="mt-0.5">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1
                                        px-2
                                        py-0.5
                                        rounded-md
                                        bg-emerald-50
                                        border
                                        border-emerald-200
                                        text-[11px]
                                        font-medium
                                        text-emerald-700
                                        "
                                >
                                    <IoCardOutline className="w-3 h-3" />

                                    {parameter.analyzedBy}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>

    );

};

export default FoodParameterOverview;