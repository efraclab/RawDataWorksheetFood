import React from "react";
import { FaPlus } from "react-icons/fa";

import type { CalculationBase } from "../../../models/CalculationBase";

import { moduleRegistry } from "../../../configs/moduleRegistry";

interface Props {
    calculations: CalculationBase[];

    samplePreparations: any[];

    onAdd: () => void;

    onRemove: (id: number) => void;

    parameterType: string;

    role: string;

    onFieldChange: (
        calculationId: number,
        field: keyof CalculationBase,
        value: any
    ) => void;
}

const CalculationSection: React.FC<Props> = ({
    calculations,
    samplePreparations,
    onAdd,
    onRemove,
    parameterType,
    role,
    onFieldChange,
}) => {
    const parameterTitle =
        parameterType.charAt(0).toUpperCase() +
        parameterType.slice(1);

    const moduleConfig =
        moduleRegistry[
        parameterType as keyof typeof moduleRegistry
        ];

    if (!moduleConfig) return null;

    const CalculationComponent = moduleConfig.calculationComponent;

    return (
        <div className="mt-8">

            {/* ================= CALCULATIONS DIVIDER ================= */}

            <div className="flex items-center gap-4 my-8">

                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />

                <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-lg border border-emerald-300/50 shadow-sm">

                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">

                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                        CALCULATIONS

                    </span>

                </div>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />

            </div>

            {/* ================= WHITE GLASS CARD ================= */}

            <div
                className="
                    relative
                    mx-4
                    mr-5
                    mb-5
                    rounded-xl
                    border
                    border-emerald-200/30
                    bg-white/50
                    backdrop-blur-sm
                    shadow-lg
                    p-6
                "
            >

                {/* ================= HEADER ================= */}

                <div className="flex items-center justify-between mb-6">

                    <h3 className="flex items-center gap-3 text-lg font-bold tracking-tight">

                        <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-emerald-900" />

                        <span className="text-emerald-900">
                            Calculations for {parameterTitle}
                        </span>

                    </h3>

                    <button
                        onClick={onAdd}
                        className="
                            flex
                            items-center
                            gap-1.5
                            px-3
                            py-2
                            rounded-lg
                            bg-gradient-to-r
                            from-emerald-600
                            to-emerald-900
                            text-xs
                            font-semibold
                            text-white
                            shadow-lg
                            hover:shadow-xl
                            hover:from-emerald-700
                            hover:to-emerald-800
                            transition-all
                            duration-200
                        "
                    >

                        <FaPlus className="w-3.5 h-3.5" />

                        Add Calculation

                    </button>

                </div>

                {/* ================= BODY ================= */}

                {calculations.map((calc) => (
                    <CalculationComponent
                        key={calc.id}
                        calculation={calc as any}
                        samplePreparations={samplePreparations}
                        onRemove={() => onRemove(calc.id)}
                        onFieldChange={onFieldChange as any}
                        role={role}
                    />
                ))}

            </div>

        </div>
    );
};

export default CalculationSection;