import React from "react";

interface Props {
    sampleName: string;
    parameterName?: string;
    methodName?: string;
}

const FoodWorksheetInfo: React.FC<Props> = ({
    sampleName,
    parameterName,
    methodName
}) => {

    return (

        <div className="p-0 my-8">

            <div className="my-4 border border-emerald-900/30 mb-6 rounded-xl overflow-hidden shadow-md">

                <table className="w-full border-collapse text-sm shadow-md rounded-xl overflow-hidden">

                    <tbody>

                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-50 transition-colors">

                            <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                                1
                            </td>

                            <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">

                                Sample Particulars (All relevant information received with sample to be entered):

                            </td>

                            <td className="px-3 py-3 font-medium">

                                {sampleName || "---"}

                            </td>

                        </tr>

                        <tr className="border-b border-emerald-900/20 hover:bg-emerald-50 transition-colors">

                            <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                                2
                            </td>

                            <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">

                                Test(s) required (all tests and condition to be entered):

                            </td>

                            <td className="px-3 py-3 font-medium">

                                {parameterName || "No parameters added"}

                            </td>

                        </tr>

                        <tr className="hover:bg-emerald-50 transition-colors">

                            <td className="w-10 px-4 py-4 border-r border-emerald-900/20 font-bold text-center bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-200">
                                3
                            </td>

                            <td className="w-1/3 px-4 py-4 border-r border-emerald-100 font-bold bg-gradient-to-r from-emerald-50 to-white text-emerald-800">

                                Method(s) of Analysis / Testing

                            </td>

                            <td className="px-3 py-3 h-16 font-medium">

                                {methodName || "No methods"}

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default FoodWorksheetInfo;