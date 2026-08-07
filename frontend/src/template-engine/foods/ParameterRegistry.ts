import type { ParameterTemplate } from "../common/ParameterTemplate";
import LODTemplate from "../../parameter-templates/foods/lod/LODTemplate";

class ParameterRegistry {

    private templates = new Map<string, ParameterTemplate>();

    register(parameterName: string, template: ParameterTemplate) {

        this.templates.set(parameterName.toLowerCase(), template);

    }

    get(parameterName: string): ParameterTemplate | undefined {

        return this.templates.get(parameterName.toLowerCase());

    }

}

const registry = new ParameterRegistry();

registry.register(
    "Limit of Detection (LOD)",
    LODTemplate
);

export default registry;