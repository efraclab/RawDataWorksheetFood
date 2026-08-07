import React from "react";
import type { FoodTemplateContext } from "../../../models/FoodTemplateContext";

import FoodLODPreparation from "./FoodLODPreparation";
import FoodLODCalculation from "./FoodLODCalculation";

interface Props {
    context: FoodTemplateContext;
}

const LODTemplate: React.FC<Props> = ({ context }) => {

    return (
        <>
            <FoodLODPreparation context={context} />

            <FoodLODCalculation context={context} />
        </>
    );
};

export default LODTemplate;