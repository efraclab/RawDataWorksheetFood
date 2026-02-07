export interface SystemSuitabilityStep {
    name: "RSD Area" | "RSD Retention time" | "Tailing factor" | "Resolution" | "Theorital Plate count" | "Peak to Valley ratio" | string;
    value1: string;
    value2: string;
    value3: string;
    limitType?: "NLT" | "NMT";
}