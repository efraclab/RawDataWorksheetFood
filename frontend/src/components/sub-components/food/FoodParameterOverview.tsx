import React from "react";
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

    /*
     * Some workflow fields may not yet be present in the
     * ParameterDetail interface, so keep them safely accessible.
     */
    const revisionStartDate = (parameter as any).revisionStartDate;
    const revisionCompletedDate = (parameter as any).revisionCompletedDate;
    const approvedAtReviewer = (parameter as any).approvedAtReviewer;

    const formatDate = (date?: string | null) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const hasTimeline =
        parameter.analysisStartDate ||
        parameter.analysisCompletionDate ||
        revisionStartDate ||
        revisionCompletedDate ||
        approvedAtReviewer;

    return (

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-6 overflow-hidden">

            {/* ============================================================
                HEADER
            ============================================================ */}

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

            {/* ============================================================
                BODY
            ============================================================ */}

            <div className="bg-slate-50 px-4 py-4">

                {/* ========================================================
                    PARAMETER CODE + PARAMETER NAME
                ======================================================== */}

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

                {/* ========================================================
                    ASSIGNED ANALYST
                ======================================================== */}

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

                {/* ========================================================
                    ANALYSIS TIMELINE
                    Same visual structure as Drug
                ======================================================== */}

                {hasTimeline && (

                    <div className="relative group mt-5">

                        <div className="relative bg-white border border-emerald-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">

                            {/* Timeline Header */}

                            <div className="flex items-center gap-2 mb-4">

                                <div className="w-1 h-5 bg-emerald-500 rounded-full" />

                                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">

                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>

                                    Analysis Timeline

                                </h4>

                            </div>

                            {/* Timeline Cards */}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* ====================================================
                                    STARTED
                                ==================================================== */}

                                {parameter.analysisStartDate && (

                                    <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">

                                        <div className="flex items-center gap-2 mb-2">

                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">

                                                <svg
                                                    className="w-4 h-4 text-emerald-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                    />

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />

                                                </svg>

                                            </div>

                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                Started
                                            </span>

                                        </div>

                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatDate(parameter.analysisStartDate)}
                                        </p>

                                    </div>

                                )}

                                {/* ====================================================
                                    COMPLETED
                                ==================================================== */}

                                {parameter.analysisCompletionDate && (

                                    <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">

                                        <div className="flex items-center gap-2 mb-2">

                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">

                                                <svg
                                                    className="w-4 h-4 text-emerald-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />

                                                </svg>

                                            </div>

                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                Completed
                                            </span>

                                        </div>

                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatDate(parameter.analysisCompletionDate)}
                                        </p>

                                    </div>

                                )}

                                {/* ====================================================
                                    REVISION STARTED
                                ==================================================== */}

                                {revisionStartDate && (

                                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:border-orange-300 transition-all">

                                        <div className="flex items-center gap-2 mb-2">

                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">

                                                <svg
                                                    className="w-4 h-4 text-orange-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>

                                            </div>

                                            <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                                                Revision Started
                                            </span>

                                        </div>

                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatDate(revisionStartDate)}
                                        </p>

                                    </div>

                                )}

                                {/* ====================================================
                                    REVISION COMPLETED
                                ==================================================== */}

                                {revisionCompletedDate && (

                                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:border-orange-300 transition-all">

                                        <div className="flex items-center gap-2 mb-2">

                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">

                                                <svg
                                                    className="w-4 h-4 text-orange-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />

                                                </svg>

                                            </div>

                                            <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                                                Revision Completed
                                            </span>

                                        </div>

                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatDate(revisionCompletedDate)}
                                        </p>

                                    </div>

                                )}

                                {/* ====================================================
                                    REVIEWED
                                ==================================================== */}

                                {approvedAtReviewer && (

                                    <div className="bg-emerald-50 rounded-lg p-4 border border-slate-200 hover:border-emerald-300 transition-all">

                                        <div className="flex items-center gap-2 mb-2">

                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">

                                                <svg
                                                    className="w-4 h-4 text-emerald-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 01.806-1.946 3.42 3.42 0 013.138-3.138z"
                                                    />

                                                </svg>

                                            </div>

                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                Reviewed
                                            </span>

                                        </div>

                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatDate(approvedAtReviewer)}
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default FoodParameterOverview;