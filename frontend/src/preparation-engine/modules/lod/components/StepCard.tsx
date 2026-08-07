import React from "react";

import type { SamplePreparationLodStep } from "../models/SamplePreparationLodStep";

interface Props {

    index: number;

    step: SamplePreparationLodStep;

}

const StepCard: React.FC<Props> = ({
    index,
    step
}) => {

    return (

        <div className="rounded-xl border border-emerald-200 p-5 bg-white">

            <div className="flex items-center gap-4">

                <div className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold">

                    {index + 1}

                </div>

                <h4 className="font-bold text-emerald-900">

                    {step.name}

                </h4>

            </div>

        </div>

    );

};

export default StepCard;