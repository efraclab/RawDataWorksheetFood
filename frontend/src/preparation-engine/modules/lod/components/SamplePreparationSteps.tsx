import React from "react";

import type { SamplePreparationLod } from "../models/SamplePreparationLod";

import StepCard from "./StepCard";

interface Props {

    preparation: SamplePreparationLod;

}

const SamplePreparationSteps: React.FC<Props> = ({
    preparation
}) => {

    return (

        <div className="space-y-4">

            {preparation.steps.map((step, index) => (

                <StepCard

                    key={index}

                    index={index}

                    step={step}

                />

            ))}

        </div>

    );

};

export default SamplePreparationSteps;