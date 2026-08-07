import type { FoodTemplateContext } from "../../../models/FoodTemplateContext";

interface Props {

    context: FoodTemplateContext;

}

const FoodLODCalculation: React.FC<Props> = ({
    context
}) => {

    return (

        <div>

            Food LOD Calculation

        </div>

    );

};

export default FoodLODCalculation;