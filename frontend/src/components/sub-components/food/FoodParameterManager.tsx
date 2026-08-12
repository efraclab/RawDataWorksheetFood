import React, { useState } from "react";
import type { ParameterDetail } from "../../../models/ParameterDetail";
import type { SampleData } from "../../../models/SampleData";
import { IoFlask } from "react-icons/io5";
import { Trash2 } from "lucide-react";


interface Props {
    parameterCount: number | undefined;

    addedParameters: ParameterDetail[];

    availableParameters: SampleData[];

    onDeleteParameter: (parameter: ParameterDetail) => void;

    onAddParameter: (parameter: SampleData) => void;

    expandedParameterId: number | null;

    onToggleParameter: (parameter: ParameterDetail) => void;

}



const FoodParameterManager: React.FC<Props> = ({
    parameterCount,
    addedParameters,
    availableParameters,
    expandedParameterId,
    onAddParameter,
    onToggleParameter,
    onDeleteParameter
}) => {

    const [showDropdown, setShowDropdown] = useState(false);
    React.useEffect(() => {
        if (availableParameters.length === 0) {
            setShowDropdown(false);
        }
    }, [availableParameters]);

    // console.log("parameterCount =", parameterCount);
    // console.log("addedParameters.length =", addedParameters.length);

    return (
        <div className="
                relative
                rounded-2xl
                bg-gradient-to-r
                from-emerald-900
                via-emerald-800
                to-emerald-900
                shadow-xl
                border
                border-emerald-700
                p-6
                mb-8
                ">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
            {/* Header */}
            <div className="relative flex items-center justify-between">

                <h3 className="text-xl font-bold text-white flex items-center gap-3">

                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner">

                        <IoFlask className="w-5 h-5 text-emerald-300" />

                    </div>

                    <span>
                        Parameters Management
                    </span>

                </h3>

                <div className="relative">

                    <button
                        onClick={() => {
                            if (availableParameters.length === 0) return;
                            setShowDropdown(!showDropdown);
                        }}
                        // disabled={addedParameters.length >= (parameterCount ?? 0)}
                        //disabled = {false}
                        className={`
                                inline-flex items-start gap-2 rounded-lg
                                px-5 py-2.5 font-semibold shadow-md transition-all duration-200
                                ${availableParameters.length === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }
                            `}
                    >
                        <span className="text-base">+</span>
                        Add Parameter
                    </button>

                    {showDropdown && (

                        <div
                            className="
                                absolute
                                right-0
                                top-full
                                mt-2
                                w-80
                                bg-white
                                rounded-xl
                                shadow-2xl
                                border
                                border-slate-200
                                z-[9999]
                                max-h-96
                                overflow-y-auto
                                "
                        >

                            {availableParameters.length === 0 ? (

                                <div className="p-6 text-center text-gray-500">
                                    No parameters available
                                </div>

                            ) : (

                                availableParameters.map(param => (

                                    <div
                                        key={param.paraCode}
                                        onClick={() => {
                                            onAddParameter(param);
                                            setShowDropdown(false);
                                        }}
                                        className="px-4 py-3
                                               cursor-pointer
                                               hover:bg-emerald-50
                                               transition
                                               border-b
                                               last:border-b-0"
                                    >

                                        <div className="font-semibold text-slate-800">
                                            {param.parameter}
                                        </div>

                                        <div className="text-xs text-slate-500 mt-1">
                                            {param.methodCode}
                                            {" • "}
                                            {param.methodName}
                                        </div>

                                    </div>

                                ))

                            )}

                        </div>

                    )}

                </div>

            </div>

            {/* Empty State */}

            {addedParameters.length === 0 ? (

                <div
                    className="
                        rounded-xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        py-10
                        px-6
                        mt-4
                    "
                >

                    <div className="flex flex-col items-center">

                        <div
                            className="w-10 h-10
                                   rounded-full
                                   border-2
                                   border-emerald-200
                                   flex items-center justify-center
                                   text-emerald-500
                                   text-2xl"
                        >
                            ◎
                        </div>

                        <h3 className="mt-5 font-bold text-slate-800">
                            No parameters added yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Click the "Add Parameter" button above to add parameters.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="mt-4 space-y-3">

                    {addedParameters.map(parameter => (

                        <div
                            key={parameter.id}
                            className="
                                rounded-xl
                                bg-emerald-50
                                border
                                border-emerald-200
                                shadow-md
                                overflow-hidden
                            "
                        >

                            <div className="px-5 py-2.5">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <h3 className="font-semibold text-slate-800 text-base">
                                                {parameter.parameterName}
                                            </h3>

                                            <span
                                                className="
                                                inline-flex
                                                items-center
                                                px-2.5
                                                py-[2px]
                                                rounded-full
                                                border
                                                border-emerald-200
                                                bg-emerald-50
                                                text-[9px]
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                text-emerald-700
                                            ">
                                                {parameter.status}
                                            </span>

                                        </div>

                                        <div className="text-xs text-slate-500 mt-2">

                                            {parameter.paraCode}
                                            {" • "}
                                            {parameter.methodCode}

                                        </div>

                                        <div className="text-sm text-slate-700 mt-2">

                                            <span className="font-medium">
                                                Assigned to:
                                            </span>

                                            {" "}

                                            {parameter.analyzedByName ?? "Not Assigned"}

                                        </div>

                                    </div>

                                    <div className="flex items-center self-start gap-2 mt-1">

                                        <button
                                            onClick={() => onToggleParameter(parameter)}
                                            className="
                                                inline-flex
                                                items-center
                                                justify-center
                                                gap-1
                                                h-7
                                                px-3
                                                rounded-md
                                                border
                                                border-emerald-200
                                                bg-white
                                                text-[9px]
                                                font-semibold
                                                text-emerald-700
                                                hover:bg-emerald-50
                                                transition
                                                "
                                        >
                                            {expandedParameterId === parameter.id
                                                ? "CLICK TO HIDE"
                                                : "CLICK TO VIEW"}

                                            <span>
                                                {expandedParameterId === parameter.id ? "▲" : "▼"}
                                            </span>
                                        </button>

                                        <button
                                            className="
                                                w-6
                                                h-6
                                                rounded-md
                                                border
                                                border-red-200
                                                bg-white
                                                hover:bg-red-50
                                                flex
                                                items-center
                                                justify-center
                                                text-red-500
                                                transition
                                            "
                                            onClick={() => onDeleteParameter(parameter)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default FoodParameterManager;