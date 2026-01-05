import React from "react";
import { Printer, X, FileText } from "lucide-react";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { Chemical } from "../preparation_models/Chemical";
import type { Instrument } from "../preparation_models/Instrument";
import type { Standard } from "../preparation_models/Standard";
import type { Analyst } from "../models/Analyst";

interface PrintReportProps {
  worksheetInfo: WorksheetDetail;
  analysts: Analyst[];
  instruments: Instrument[];
  chemicals: Chemical[];
  standards: Standard[];
  onClose: () => void;
}

const PrintReport: React.FC<PrintReportProps> = ({
  worksheetInfo,
  analysts,
  instruments,
  chemicals,
  standards,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const safeJSONParse = (data: any, fallback: any = []) => {
    if (!data) return fallback;
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (e) {
        return fallback;
      }
    }
    return data;
  };

  const stepHasValues = (step: any) => {
    return !!(
      step.value1 ||
      step.value2 ||
      step.value3 ||
      step.id ||
      step.logBookID ||
      step.solventChemical
    );
  };

  const boldValue = (value: string | number, unit?: string) => {
    const val = value || "___";
    const u = unit || "";
    return `<strong>${val}${u ? ' ' + u : ''}</strong>`;
  };

  const formatPreparationSteps = (steps: any[], preparationType: string) => {
    if (!steps || steps.length === 0) return null;

    const validSteps = steps.filter(stepHasValues);

    if (validSteps.length === 0) return null;

    let stepCounter = 0;

    return validSteps.map((step: any, idx: number) => {
      stepCounter++;
      let stepText = "";

      switch (step.name) {
        case "Weighing":
          if (preparationType === "standard") {
            stepText = `Weigh accurately ${boldValue(step.value1, step.unit1)} of standard${
              step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""
            }.`;
          } else {
            stepText = `Weigh accurately ${boldValue(step.value1, step.unit1)} of ${step.solventChemical || "sample"}${
              step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""
            }.`;
          }
          break;

        case "1st Dilution":
          if (preparationType === "disso") {
            stepText = `Take ${boldValue(step.value1, step.unit1 || "ml")} of stock solution & dilute to ${boldValue(step.value2, step.unit2 || "ml")} with diluent.`;
          } else {
            stepText = `Dilute to ${boldValue(step.value1, step.unit1 || "ml")} with diluent.`;
          }
          break;

        case "2nd Dilution":
          stepText = `Take ${boldValue(step.value1, step.unit1 || "ml")} of 1st Dilution Solution & dilute to ${boldValue(step.value2, step.unit2 || "ml")} with diluent.`;
          break;

        case "3rd Dilution":
          stepText = `Take ${boldValue(step.value1, step.unit1 || "ml")} of 2nd Dilution Solution & dilute to ${boldValue(step.value2, step.unit2 || "ml")} with diluent.`;
          break;

        case "4th Dilution":
          stepText = `Take ${boldValue(step.value1, step.unit1 || "ml")} of 3rd Dilution Solution & dilute to ${boldValue(step.value2, step.unit2 || "ml")} with diluent.`;
          break;

        case "Filtration":
          stepText = `Filter the solution through ${boldValue(step.value1, step.unit1 || "µm")} syringe filter.`;
          break;

        case "Instrument Details":
          stepText = `Instrument ID: ${step.id || "___"}, RPM: ${boldValue(step.value1, "rpm")}, Temperature: ${boldValue(step.value2, step.unit2 || "°C")}.`;
          break;

        case "Tablet Details":
          stepText = `Claim: ${boldValue(step.value1, step.unit1 || "mg")}, Media Volume: ${boldValue(step.value2, step.unit2 || "ml")}, Sampling Time: ${boldValue(step.value3, step.unit3 || "min")}.`;
          break;

        case "Weighing (Empty Bottle)":
        case "Weighing (Empty Crucible)":
          stepText = `Weigh of ${
            step.name.includes("Bottle") ? "Empty Bottle" : "Empty Crucible"
          }: ${boldValue(step.value1, step.unit1 || "g")}${
            step.logBookID ? ` (Log ID: ${step.logBookID})` : ""
          }.`;
          break;

        case "Weighing (Before Drying)":
          stepText = `Weigh of ${
            preparationType.includes("lod") ? "Bottle" : "Crucible"
          } + Sample: ${boldValue(step.value1, step.unit1 || "g")}.`;
          break;

        case "Drying":
          stepText = `Dry the sample at ${boldValue(step.value1, step.unit1 || "°C")} for ${boldValue(step.value2, step.unit2 || "hr")}${
            step.logBookID ? ` (Log ID: ${step.logBookID})` : ""
          }.`;
          break;

        case "Weighing (After Drying)":
          stepText = `Weigh of ${
            preparationType.includes("lod") ? "Bottle" : "Crucible"
          } + Sample after drying: ${boldValue(step.value1, step.unit1 || "g")}.`;
          break;

        default:
          const val1 = step.value1 ? boldValue(step.value1, step.unit1) : '';
          const val2 = step.value2 ? boldValue(step.value2, step.unit2) : '';
          stepText = `${step.name}: ${val1} ${val2}`.trim();
      }

      return (
        <div key={idx} className="mb-1.5">
          <div className="flex gap-2 text-sm">
            <span 
              className="text-gray-800 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: stepText }}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 15mm 15mm 15mm 15mm;
            }
            
            .no-print {
              display: none !important;
            }
            
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            
            .print-container {
              width: 100%;
              max-width: none;
              margin: 0;
              padding: 0;
              box-shadow: none;
            }
            
            .page-break-before {
              page-break-before: always;
              break-before: always;
            }
            
            .page-break-after {
              page-break-after: always;
              break-after: always;
            }
            
            .page-break-inside-avoid {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            table {
              page-break-inside: auto;
              break-inside: auto;
            }
            
            tr {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            thead {
              display: table-header-group;
            }
            
            tfoot {
              display: table-footer-group;
            }
            
            .section-container {
              page-break-inside: avoid;
              break-inside: avoid;
              margin-bottom: 15px;
            }
            
            .keep-together {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            h3, h4 {
              page-break-after: avoid;
              break-after: avoid;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            p {
              orphans: 3;
              widows: 3;
            }
            
            .footer-section {
              page-break-inside: avoid;
              break-inside: avoid;
              margin-top: 40px;
            }
            
            .signature-table {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
          
          @media screen {
            .print-container {
              max-width: 210mm;
              margin: 50px auto;
              padding: 15mm 15mm;
              background: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            
            .no-print {
              position: fixed;
              display: flex;
              gap: 10px;
            }
          }
        `}
      </style>

      <div className="flex flex-col">
        <div className="no-print top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 shadow-lg z-50">
          <div className="w-full px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Worksheet Print Preview
                  </h2>
                  <p className="text-emerald-100 text-xs mt-0.5">
                    Review before printing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-lg border border-white/20 shadow-lg font-semibold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>

                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main print container */}
        <div className="print-container">
          
          <div className="keep-together">

            {/* Header Section Start*/}
            <div className="flex justify-between items-center text-sm mb-6 pb-4 border-b-2 border-gray-200">
              <div></div>
              <div className="flex flex-col items-end">
                <img src="/ic_efrac.png" alt="EFRAC Logo" className="h-6" />
              </div>
            </div>

            <div className="mb-5">
              <table className="w-full">
                <table className="w-full table-fixed border border-black">
                  <tbody>
                    <tr className="bg-gray-200">
                      <td
                        className="border border-black px-3 py-2 text-sm font-bold"
                        colSpan={4}
                      >
                        EDWARD FOOD RESEARCH & ANALYSIS CENTRE LTD
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="border border-black px-3 py-2 font-bold text-md text-center"
                        colSpan={4}
                      >
                        Raw Data Worksheet
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-3 py-2 text-sm">
                        Revision No:
                      </td>

                      <td
                        className="border border-black px-3 py-2 text-center font-bold text-sm"
                        colSpan={2}
                      >
                        QA.3.1.0.3
                      </td>

                      <td className="border border-black px-3 py-2 text-sm">
                        Page No:
                      </td>
                    </tr>
                  </tbody>
                </table>
              </table>
            </div>
            {/* Header Section End*/}

            {/* Worksheet Information Table */}
            <div className="mb-5">
              <table className="w-full text-sm">
                <table className="w-full table-fixed border border-black">
                  <colgroup>
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "20%" }} />
                  </colgroup>

                  <tbody>
                    <tr>
                      <td className="border border-black px-3 py-2" colSpan={2}>
                        Registration No: {worksheetInfo.sample.registrationNo}
                      </td>
                      <td className="border border-black px-3 py-2" colSpan={2}>
                        Date of Receipt:{" "}
                        {worksheetInfo.sample.dueDate
                          ? new Date().toLocaleDateString("en-GB")
                          : ""}
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-3 py-2" colSpan={2}>
                        Sample Name: {worksheetInfo.sample.sampleName}
                      </td>
                      <td className="border border-black px-3 py-2" colSpan={2}>
                        Number of Samples: {worksheetInfo.parameters.length}
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black px-3 py-2">
                        Due Date:{" "}
                        {worksheetInfo.sample.dueDate
                          ? new Date(
                              worksheetInfo.sample.dueDate
                            ).toLocaleDateString("en-GB")
                          : ""}
                      </td>

                      <td className="border border-black px-3 py-2">
                        Analysis Started On:
                      </td>

                      <td className="border border-black px-3 py-2" colSpan={2}>
                        Analysis Completed On:
                      </td>
                    </tr>
                  </tbody>
                </table>
              </table>
            </div>

            {/* Sample Details Table */}
            <div className="mb-5">
              <table className="w-full border border-black text-sm">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-10 px-4 py-3 border-r border-black text-center">
                      1
                    </td>
                    <td className="w-1/3 px-4 py-3 border-r border-black">
                      Sample Particulars (All relevant information received with
                      sample to be entered):
                    </td>
                    <td className="px-3 py-3">
                      {worksheetInfo.sample.sampleName || "---"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-10 px-4 py-3 border-r border-black text-center">
                      2
                    </td>
                    <td className="w-1/3 px-4 py-3 border-r border-black">
                      Test(s) required (all tests and condition to be entered):
                    </td>
                    <td className="px-3 py-3">
                      {worksheetInfo.parameters
                        .map((p) => p.parameterName)
                        .join(", ")}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-10 px-4 py-3 border-r border-black text-center">
                      3
                    </td>
                    <td className="w-1/3 px-4 py-3 border-r border-black">
                      Method(s) of Analysis / testing
                    </td>
                    <td className="px-3 py-3 h-16">
                      {Array.from(
                        new Set(
                          worksheetInfo.parameters.map((p) => p.methodName)
                        )
                      ).join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-10 px-4 py-3 border-r border-black text-center">
                      4
                    </td>
                    <td className="w-1/3 px-4 py-3 border-r border-black">
                      Raw Data (Observations, Readings, Calculations etc):
                    </td>
                    <td className="px-3 py-3 h-32 align-top"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Parameters */}
          {worksheetInfo.parameters.map((param, paramIdx) => {
            const filteredInstruments = instruments.filter((inst) =>
              param.instrumentIds?.includes(inst.id)
            );
            const filteredChemicals = chemicals.filter((chem) =>
              param.chemicalIds?.includes(chem.id)
            );
            const filteredStandards = standards.filter((std) =>
              param.standardIds?.includes(std.id)
            );

            return (
              <div key={paramIdx} className="mb-6">
                {paramIdx > 0 && <div className=""></div>}

                <div className="keep-together">
                  <h3 className="text-base font-bold mb-3 py-2.5 uppercase">
                    PARAMETER {paramIdx + 1}: {param.parameterName} (
                    {param.paraCode})
                  </h3>

                  {/* Parameter Details */}
                  {/* <div className="mb-4">
                    <h4 className="text-sm font-bold mb-2 underline">
                      Parameter Details:
                    </h4>
                    <div className="border border-black text-sm">
                      <div className="flex border-b border-black">
                        <div className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                          Method:
                        </div>
                        <div className="px-3 py-2">
                          {param.methodName} ({param.methodCode})
                        </div>
                      </div>
                      {param.status && (
                        <div className="flex border-b border-black">
                          <div className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                            Status:
                          </div>
                          <div className="px-3 py-2">{param.status}</div>
                        </div>
                      )}
                      {param.analyzedBy && (
                        <div className="flex border-b border-black">
                          <div className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                            Analyzed By:
                          </div>
                          <div className="px-3 py-2">
                            {analysts.find(
                              (a) => a.employeeId === param.analyzedBy
                            )?.username || "Unknown"}
                          </div>
                        </div>
                      )}
                      {param.analysisStartDate && (
                        <div className="flex border-b border-black">
                          <div className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                            Analysis Start Date:
                          </div>
                          <div className="px-3 py-2">
                            {new Date(param.analysisStartDate).toLocaleString(
                              "en-GB"
                            )}
                          </div>
                        </div>
                      )}
                      {param.analysisCompletionDate && (
                        <div className="flex border-b border-black">
                          <div className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                            Analysis Completion Date:
                          </div>
                          <div className="px-3 py-2">
                            {new Date(
                              param.analysisCompletionDate
                            ).toLocaleString("en-GB")}
                          </div>
                        </div>
                      )}
                      {param.approvedBy && (
                        <div className="flex border-b border-black">
                          <div className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                            Approved By:
                          </div>
                          <div className="px-3 py-2">{param.approvedBy}</div>
                        </div>
                      )}
                      {param.approvedAt && (
                        <div className="flex">
                          <div className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                            Approved At:
                          </div>
                          <div className="px-3 py-2">
                            {new Date(param.approvedAt).toLocaleString("en-GB")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div> */}
                </div>

                {/* Instruments */}
                {filteredInstruments.length > 0 && (
                  <div className="section-container mb-4">
                    <h4 className="text-sm font-bold mb-2 underline">
                      Instruments Used:
                    </h4>
                    <table className="w-full border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Instrument Tag
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Instrument Name
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Calibration Done
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Calibration Due
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInstruments.map((inst, idx) => (
                          <tr key={idx}>
                            <td className="border border-black px-3 py-2">
                              {inst.tag}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {inst.name}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {inst.calibrationDoneDate
                                ? new Date(
                                    inst.calibrationDoneDate
                                  ).toLocaleDateString("en-GB")
                                : "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {inst.calibrationDueDate
                                ? new Date(
                                    inst.calibrationDueDate
                                  ).toLocaleDateString("en-GB")
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Chemicals */}
                {filteredChemicals.length > 0 && (
                  <div className="section-container mb-4">
                    <h4 className="text-sm font-bold mb-2 underline">
                      Chemicals/Reagents Used:
                    </h4>
                    <table className="w-full border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Chemical Name
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Make
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Batch No.
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Validity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredChemicals.map((chem, idx) => (
                          <tr key={idx}>
                            <td className="border border-black px-3 py-2">
                              {chem.name}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {chem.make || "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {chem.batchNo || "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {chem.validity
                                ? new Date(chem.validity).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Standards */}
                {filteredStandards.length > 0 && (
                  <div className="section-container mb-4">
                    <h4 className="text-sm font-bold mb-2 underline">
                      Standards Used:
                    </h4>
                    <table className="w-full border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Standard Name
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Purity
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Make
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Batch No.
                          </th>
                          <th className="border border-black px-3 py-2 text-left font-bold">
                            Validity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStandards.map((std, idx) => (
                          <tr key={idx}>
                            <td className="border border-black px-3 py-2">
                              {std.name}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {std.purity || "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {std.make || "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {std.batchNo || "N/A"}
                            </td>
                            <td className="border border-black px-3 py-2">
                              {std.validity
                                ? new Date(std.validity).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Diluent Preparation */}
                {param.diluentPreparation && (
                  <div className="section-container mb-4">
                    <h4 className="text-sm font-bold mb-2 underline">
                      Diluent Preparation:
                    </h4>
                    <div className="border border-black px-3 py-2 bg-gray-50 text-sm">
                      {param.diluentPreparation}
                    </div>
                  </div>
                )}

                {/* Standard Preparations */}
                {param.standardPreparations &&
                  param.standardPreparations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-bold mb-2 underline">
                        Standard Preparations:
                      </h4>
                      {param.standardPreparations.map((prep, idx) => {
                        const steps = safeJSONParse(prep.steps, []);
                        const formattedSteps = formatPreparationSteps(
                          steps,
                          "standard"
                        );

                        if (!formattedSteps) return null;

                        return (
                          <div key={idx} className="section-container mb-3">
                            <p className="font-bold mb-2 text-sm">
                              {prep.label} for {prep.preparationType}:
                            </p>
                            <div>{formattedSteps}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {/* Sample Preparations */}
                {param.samplePreparations &&
                  param.samplePreparations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-bold mb-2 underline">
                        Sample Preparations:
                      </h4>
                      {param.samplePreparations.map((prep, idx) => {
                        const steps = safeJSONParse(prep.steps, []);
                        const formattedSteps = formatPreparationSteps(
                          steps,
                          prep.preparationType || "sample"
                        );

                        if (!formattedSteps) return null;

                        return (
                          <div key={idx} className="section-container mb-3">
                            <p className="font-bold mb-2 text-sm">
                              {prep.label} for {prep.preparationType}:
                            </p>
                            <div className="">{formattedSteps}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {/* Calculations */}
                {param.calculations && param.calculations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold mb-2 underline">
                      Calculations:
                    </h4>
                    {param.calculations.map((calc, idx) => {
                      const calcData = safeJSONParse(calc.data, {});
                      return (
                        <div key={idx} className="section-container mb-3">
                          <p className="font-bold mb-2 text-sm">
                            {calc.label} for {calc.calculationType}
                          </p>
                          <div className="border border-black text-sm">
                            {Object.entries(calcData).map(
                              ([key, value]: [string, any]) => {
                                if (
                                  key === "id" ||
                                  key === "label" ||
                                  value === null ||
                                  value === ""
                                )
                                  return null;
                                return (
                                  <div
                                    key={key}
                                    className="flex border-b border-black last:border-b-0"
                                  >
                                    <div className="w-2/5 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                                      {key.replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (c) => c.toUpperCase())
                                      .trim()}:
                                    </div>
                                    <div className="px-3 py-2">
                                      {String(value)}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Other Information */}
                {param.otherInfo && (
                  <div className="section-container mb-4">
                    <h4 className="text-sm font-bold mb-2 underline">
                      Other Information:
                    </h4>
                    <div className="border border-black px-3 py-2 bg-gray-50 text-sm">
                      {param.otherInfo}
                    </div>
                  </div>
                )}

                <div className="mt-6 mb-4 text-sm">
                  <p className="text-sm leading-relaxed">
                    Analyzed by{" "}
                    <span className="font-bold">
                      {analysts.find((a) => a.employeeId === param.analyzedBy)?.username ||
                        "Unknown"}
                    </span>
                    . Analysis started on{" "}
                    <span className="font-bold">
                      {param.analysisStartDate
                      ? new Date(param.analysisStartDate).toLocaleDateString("en-GB")
                      : "N/A"}
                    </span>
                    {" "}and completed on{" "}
                    <span className="font-bold">
                    {param.analysisCompletionDate
                      ? new Date(param.analysisCompletionDate).toLocaleDateString("en-GB")
                      : "N/A"}
                    </span>
                    .
                  </p>
                </div>

              </div>
            );
          })}

          {/* Document Footer Start*/}
          <div className="footer-section">
            <table className="signature-table w-full border-2 border-black text-sm mt-20">
              <thead>
                <tr className="bg-white">
                  <th className="border border-black px-4 py-3 text-center font-bold">
                    REVIEWED BY (QC)
                    <div className="font-normal text-xs mt-0.5">
                      (Sign & Date)
                    </div>
                  </th>
                  <th className="border border-black px-4 py-3 text-center font-bold">
                    REVIEWED BY (QA)
                    <div className="font-normal text-xs mt-0.5">
                      (Sign & Date)
                    </div>
                  </th>
                  <th className="border border-black px-4 py-3 text-center font-bold">
                    APPROVED BY (QA)
                    <div className="font-normal text-xs mt-0.5">
                      (Sign & Date)
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-4 py-1 align-top">
                    <div className="text-sm italic">
                      Prepared By: QC Executive
                    </div>
                  </td>
                  <td className="border border-black px-4 py-1 align-top">
                    <div className="text-sm italic">Issued By: QA Manager</div>
                  </td>
                  <td className="border border-black px-4 py-1 align-top">
                    <div className="text-sm italic">
                      Original Issue Date:
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-1 align-top">
                    <div className="text-sm italic">
                      Approved By: Technical Manager
                    </div>
                  </td>
                  <td className="border border-black px-4 py-1 align-top">
                    <div className="text-sm italic">
                      Classified "Internal Use Only"
                    </div>
                  </td>
                  <td className="border border-black px-4 py-1 align-top">
                    <div className="text-sm italic">
                      Revision Date:
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
           {/* Document Footer End*/}
        </div>
      </div>
    </>
  );
};

export default PrintReport;
