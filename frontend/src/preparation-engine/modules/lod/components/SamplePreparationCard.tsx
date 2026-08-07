import React, { useState } from "react";

import type { SamplePreparationLod } from "../models/SamplePreparationLod";

import SamplePreparationSteps from "./SamplePreparationSteps";

interface Props {

    preparation: SamplePreparationLod;

    onRemove: () => void;

}

const SamplePreparationCard: React.FC<Props> = ({
    preparation,
    onRemove
}) => {

    const [collapsed, setCollapsed] = useState(false);

    return (

        <div className="rounded-xl border border-slate-300 bg-white shadow-md overflow-hidden">

            {/* Header */}

            <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white px-5 py-4 flex items-center justify-between">

                <div>

                    <h3 className="font-bold text-lg">

                        {preparation.label}

                    </h3>

                    <p className="text-xs text-emerald-100">

                        Sample Preparation for LOD Details

                    </p>

                </div>

                <div className="flex items-center gap-2">

                    <button

                        onClick={() => setCollapsed(v => !v)}

                        className="p-2 hover:bg-white/20 rounded"

                    >

                        {collapsed ? "▼" : "▲"}

                    </button>

                    <button

                        onClick={onRemove}

                        className="p-2 hover:bg-red-500 rounded"

                    >

                        🗑

                    </button>

                </div>

            </div>

            {!collapsed && (

                <div className="p-5">

                    <SamplePreparationSteps

                        preparation={preparation}

                    />

                </div>

            )}

        </div>

    );

};

export default SamplePreparationCard;