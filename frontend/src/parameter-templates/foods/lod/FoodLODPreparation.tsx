import type { FoodTemplateContext } from "../../../models/FoodTemplateContext";

interface Props {

    context: FoodTemplateContext;

}

const FoodLODPreparation: React.FC<Props> = ({
    context
}) => {

    const parameterId = context.parameter.id;

    const samplePreparations =
        context.samplePreparationLodPerParam[parameterId] || [];

    return (

        <>

            {samplePreparations.map(samplePreparation => (

                <div key={samplePreparation.id}>

                    {samplePreparation.id}

                </div>

            ))}

        </>

    );

};

export default FoodLODPreparation;