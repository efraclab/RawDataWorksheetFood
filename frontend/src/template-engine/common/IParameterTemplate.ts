import type { ParameterDetail } from "../../models/ParameterDetail";

export interface ParameterTemplateProps {

    parameter: ParameterDetail;

    role: string;

}

export interface IParameterTemplate {

    component: React.ComponentType<ParameterTemplateProps>;

}