import React from "react";
import { BiTestTube } from "react-icons/bi";

interface Props {
    sampleCount: number;
}

const LODHeader: React.FC<Props> = ({
    sampleCount
}) => {

    return (

       <div className="px-6 py-5 bg-gradient-to-r from-white via-white to-emerald-50">
            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shadow-lg">

                        <BiTestTube
                            className="w-5 h-5 text-white"
                        />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-emerald-900">

                            LOD Analysis

                        </h2>

                        <p className="text-sm text-emerald-600">

                            Loss on Drying • Sample & Calculations

                        </p>

                    </div>

                </div>

                <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">

                    {sampleCount} Items

                </div>

            </div>

        </div>

    );

};

export default LODHeader;