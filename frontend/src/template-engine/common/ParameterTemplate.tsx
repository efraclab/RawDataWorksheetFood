import type { FoodTemplateContext } from "../../models/FoodTemplateContext";

export type ParameterTemplate =
    React.ComponentType<{
        context: FoodTemplateContext;
    }>;