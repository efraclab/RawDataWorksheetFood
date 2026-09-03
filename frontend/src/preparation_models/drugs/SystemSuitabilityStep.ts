export interface SystemSuitabilityStep {
    name: "RSD Area" | "RSD Retention time" | "Tailing factor" | "Resolution" | "Theorital Plate count" | "Peak to Valley ratio" | string;
    value1: string;
    value2: string;
    // Lower bound of the limit (used alone for NLT/NMT, or as the NLT bound when limitType is "BOTH")
    value3: string;
    // Upper (NMT) bound of the limit, only used when limitType is "BOTH" (a range limit, e.g. NLT 0.95 and NMT 1.05)
    value4?: string;
    // "BOTH" means the step has a range limit requiring both an NLT and an NMT value
    limitType?: "NLT" | "NMT" | "BOTH";
}