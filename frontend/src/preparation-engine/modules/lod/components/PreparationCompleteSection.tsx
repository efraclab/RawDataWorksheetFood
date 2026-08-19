import React from "react";
import { AlertCircle, Lock } from "lucide-react";
import { moduleRegistry } from "../../../configs/moduleRegistry";

interface Props {
    completed: boolean;
    completedAt: Date | null;
    onComplete: () => void;
    onUnlock: () => void;
    parameterType: string;
}

const PreparationCompleteSection: React.FC<Props> = ({
    completed,
    completedAt,
    onComplete,
    onUnlock,
    parameterType,
}) => {
    const moduleConfig =
        moduleRegistry[
            parameterType as keyof typeof moduleRegistry
        ];

    const parameterTitle =
        moduleConfig?.shortName ??
        parameterType ??
        "Sample";

    if (completed) {
        return (
            <div
                className="
                    mx-6
                    mb-6
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-5
                    py-3
                "
            >
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex-shrink-0
                                w-6
                                h-6
                                rounded-full
                                bg-emerald-500
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.8}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <div>
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-emerald-800
                                "
                            >
                                {parameterTitle} Preparation Completed
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-emerald-600
                                "
                            >
                                Completed at{" "}
                                {completedAt
                                    ? completedAt.toLocaleString()
                                    : "-"
                                }
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onUnlock}
                        className="
                            flex
                            items-center
                            gap-1.5
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-orange-700
                            bg-orange-50
                            border
                            border-orange-300
                            rounded-lg
                            hover:bg-orange-100
                            transition-colors
                        "
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="
                                    M8 11V7a4 4 0 118 0
                                    m-4 8v2
                                    m-6 4h12a2 2 0 002-2v-6
                                    a2 2 0 00-2-2H6a2 2 0 00-2 2v6
                                    a2 2 0 002 2z
                                "
                            />
                        </svg>
                        Unlock Preparation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-6 mb-6">

            <button
                type="button"
                onClick={onComplete}
                className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-emerald-600
                    to-green-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-md
                    hover:from-emerald-700
                    hover:to-green-700
                    transition-all
                "
            >
                <Lock className="w-4 h-4" />
                Mark {parameterTitle} Preparation as Complete
            </button>

            <div
                className="
                    mt-3
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-amber-300
                    bg-amber-50
                    p-4
                "
            >
                <AlertCircle
                    className="
                        mt-0.5
                        h-5
                        w-5
                        text-amber-600
                    "
                />

                <div>
                    <p
                        className="
                            text-sm
                            font-medium
                            text-amber-900
                        "
                    >
                        Complete preparation above to unlock
                        the Calculations section.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PreparationCompleteSection;
