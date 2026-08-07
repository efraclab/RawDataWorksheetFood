import React from "react";

import EmptySamplePreparation from "./EmptySamplePreparation";
import SamplePreparationLodDetail from "./SamplePreparationLodDetail";

import type { SamplePreparationLod } from "../models/SamplePreparationLod";
import type { SamplePreparationLodStep } from "../models/SamplePreparationLodStep";

interface Props {
    samplePreparations: SamplePreparationLod[];

    role: string;

    onAdd: () => void;

    onRemove: (samplePreparationId: number) => void;

    onStepChange: (
        samplePreparationId: number,
        stepName: SamplePreparationLodStep["name"],
        field: "value1" | "unit1" | "value2" | "unit2" | "logBookID",
        value: string
    ) => void;
    isLocked: boolean;
}

const SamplePreparationSection: React.FC<Props> = ({
    samplePreparations,
    role,
    onAdd,
    onRemove,
    onStepChange,
    isLocked,
}) => {

    return (

        <div className="p-6">

            {/* Section Header */}

            <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                    {/* Vertical Emerald Bar */}

                    <div className="w-1.5 h-6 rounded-full bg-emerald-800" />

                    <div>

                        <h3 className="text-2xl font-bold text-emerald-950 tracking-tight">

                            Sample Preparations for LOD

                        </h3>



                    </div>

                </div>

                <button
                    onClick={onAdd}
                    disabled={isLocked}
                    className={`
        rounded-xl
        bg-emerald-600
        hover:bg-emerald-700
        px-5
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-lg
        transition-all
        duration-200
        ${isLocked
                            ? "opacity-50 cursor-not-allowed hover:bg-emerald-600"
                            : ""
                        }
    `}
                >
                    + Add Preparation
                </button>

            </div>

            {/* Empty State */}

            {samplePreparations.length === 0 ? (

                <EmptySamplePreparation
                    onAdd={onAdd}
                />

            ) : (

                <div className="space-y-5">

                    {samplePreparations.map(preparation => (

                        <SamplePreparationLodDetail

                            key={preparation.id}

                            samplePreparationLod={preparation}

                            role={role}

                            onRemove={() =>
                                onRemove(preparation.id)
                            }

                            onStepChange={onStepChange}
                            isLocked={isLocked}
                        />

                    ))}

                </div>

            )}

        </div>

    );

};

export default SamplePreparationSection;