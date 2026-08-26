import React from "react";
import type { ParameterDetail } from "../../../models/ParameterDetail";
import { IoCardOutline } from "react-icons/io5";

interface Props {
    parameter: ParameterDetail | null;
    onClose: () => void;
    role?: string;
    isReviewerApprovedForQA?: boolean;
    approvedByReviewer?: string | null;
    approvedByReviewerName?: string | null;
    reviewerRemarks?: string | null;
    analystComment?: string | null;
}

const FoodParameterOverview: React.FC<Props> = ({
    parameter,
    onClose,
    role,
    isReviewerApprovedForQA = false,
    approvedByReviewer = null,
    approvedByReviewerName = null,
    reviewerRemarks = null,
    analystComment = null
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

                {role?.toLowerCase() !== "qa" && (
                    <>
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

                    </>
                )}

                {/* ========================================================
                    REVIEWER APPROVED / PENDING QA VALIDATION
                    Parameter-level display belongs in this overview.
                    Workflow/API actions remain owned by FoodWorksheet.
                ======================================================== */}
                {isReviewerApprovedForQA && (
                    <>
                        {/* ASSIGNED REVIEWER */}
                        {(approvedByReviewer || approvedByReviewerName) && (
                            <div className="relative mb-5 mt-5">
                                <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                            <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Assigned Reviewer</h4>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center ring-2 ring-emerald-200">
                                                <span className="text-white text-lg font-bold">
                                                    {(approvedByReviewerName || "A").charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="font-semibold text-base text-slate-900 mb-1">
                                                {approvedByReviewerName || "Unknown"}
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
                                                    <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417 0.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                    </svg>
                                                    {approvedByReviewer || "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {role?.toLowerCase() === "qa" && (
                            <>
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

                            </>
                        )}

                        {/* PARAMETER APPROVED & FINALIZED */}
                        {role?.toLowerCase() !== "qa" && (
                            <div className="relative mb-5 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                                <div className="bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 px-6 py-5 border-b border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 01-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 01-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 01-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 01.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Parameter Approved &amp; Finalized</h3>
                                            <p className="text-sm text-slate-600 mt-0.5">This parameter has been reviewed and approved</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-emerald-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm text-slate-800 mb-1">Status: Approved</h4>
                                                    <p className="text-sm text-slate-600">This parameter has been finalized and approved. All data is now locked and cannot be modified.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-xl p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm text-slate-800 mb-1">View Only Access</h4>
                                                    <p className="text-sm text-slate-600">You can view all parameter details, preparations, and calculations below.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {reviewerRemarks && (
                                    <div className="mx-6 mb-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14v8h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs font-semibold text-blue-800 mb-1">Reviewer Remarks</h4>
                                                <p className="text-sm italic text-blue-900 bg-blue-100 rounded-lg px-3 py-2 border border-blue-200">&ldquo;{reviewerRemarks}&rdquo;</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {analystComment && (
                                    <div className="mx-6 mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2h14v8h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs font-semibold text-gray-700 mb-1">Analyst Comment</h4>
                                                <p className="text-sm italic text-gray-800 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200">&ldquo;{analystComment}&rdquo;</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

            </div>

        </div>

    );

};

export default FoodParameterOverview;