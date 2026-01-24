import React from "react";
import { Printer, X, FileText, ArrowLeft } from "lucide-react";
import type { SampleData } from "../preparation_models/SampleData";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { Analyst } from "../models/Analyst";
import type { Instrument } from "../preparation_models/Instrument";
import type { Chemical } from "../preparation_models/Chemical";
import type { Standard } from "../preparation_models/Standard";

interface PrintReportProps {
  worksheetInfo: WorksheetDetail;
  sampleData: SampleData;
  analysts: Analyst[];
  instruments: Instrument[];
  chemicals: Chemical[];
  standards: Standard[];
  onClose: () => void;
}

const PrintReport: React.FC<PrintReportProps> = ({
  worksheetInfo,
  sampleData,
  analysts,
  instruments,
  chemicals,
  standards,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  console.log(sampleData);

  console.log(worksheetInfo);

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
    return `<strong>${val}${u ? " " + u : ""}</strong>`;
  };

  const formatPreparationSteps = (
    steps: any[],
    type: string,
    preparationType?: string,
    assignedStandard?: string,
  ) => {
    if (!steps || steps.length === 0) return null;

    const validSteps = steps.filter(stepHasValues);

    if (validSteps.length === 0) return null;

    return validSteps.map((step: any, idx: number) => {
      let stepText = "";

      switch (step.name) {
        case "Weighing":
          if (type === "standard") {
            stepText = `Weigh accurately ${boldValue(
              step.value1,
              step.unit1,
            )} (SW1) of ${standards.find((s) => s.serialNo === assignedStandard)?.name || assignedStandard || `_____________`} ${
              step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""
            }.`;
          } else if (type === "mobile_phase" || type === "dissolution_media") {
            stepText = `Weigh accurately ${boldValue(
              step.value1,
              step.unit1,
            )} of ${step.solventChemical || `_____________`}${
              step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""
            }.`;
          } else {
            stepText = `Weigh accurately ${boldValue(
              step.value1,
              step.unit1,
            )} (SW2) of ${step.solventChemical || `_____________`}${
              step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""
            }.`;
          }
          break;

        case "PH":
          stepText = `Adjust pH to ${boldValue(step.value1)}${
            step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""
          }.`;
          break;

        case "Sonication":
          stepText = `Sonicate for ${boldValue(step.value1, step.unit1 || "min")}.`;
          break;

        case "Filtration":
          stepText = `Filter through ${boldValue(step.value1, step.unit1 || "micron")} filter.`;
          break;

        case "1 Tablets/Capsules":
          stepText = `Take ${boldValue(step.value1)} tablet(s)/capsule(s).`;
          break;

        case "1st Dilution":
          if (type === "sample") {
            if (preparationType !== "dissolution") {
              stepText = `Dilute to ${boldValue(
                step.value1,
                step.unit1 || "ml",
              )} (V8) with Diluent.`;
            } else {
              stepText = `Take ${boldValue(
                step.value1,
                step.unit1 || "ml",
              )} (V9) of Disso Solution & dilute to ${boldValue(
                step.value2,
                step.unit2 || "ml",
              )} (V10) with Diluent.`;
            }
          } else {
            stepText = `Dilute to ${boldValue(
              step.value1,
              step.unit1 || "ml",
            )} (V1) with Diluent.`;
          }
          break;

        case "2nd Dilution":
          if (type === "sample") {
            if (preparationType !== "dissolution") {
              stepText = `Take ${boldValue(
                step.value1,
                step.unit1 || "ml",
              )} (V9) of 1st Dilution Solution & dilute to ${boldValue(
                step.value2,
                step.unit2 || "ml",
              )} (V10) with Diluent.`;
            } else {
              stepText = `Take ${boldValue(
                step.value1,
                step.unit1 || "ml",
              )} (V11) of 1st Dilution Solution & dilute to ${boldValue(
                step.value2,
                step.unit2 || "ml",
              )} (V12) with Diluent.`;
            }
          } else {
            stepText = `Take ${boldValue(
              step.value1,
              step.unit1 || "ml",
            )} (V2) of 1st Dilution Solution & dilute to ${boldValue(
              step.value2,
              step.unit2 || "ml",
            )} (V3) with Diluent.`;
          }
          break;

        case "3rd Dilution":
          if (type === "sample") {
            if (preparationType !== "dissolution") {
              stepText = `Take ${boldValue(
                step.value1,
                step.unit1 || "ml",
              )} (V11) of 2nd Dilution Solution & dilute to ${boldValue(
                step.value2,
                step.unit2 || "ml",
              )} (V12) with Diluent.`;
            } else {
              stepText = `Take ${boldValue(
                step.value1,
                step.unit1 || "ml",
              )} (V13) of 2nd Dilution Solution & dilute to ${boldValue(
                step.value2,
                step.unit2 || "ml",
              )} (V14) with Diluent.`;
            }
          } else {
            stepText = `Take ${boldValue(
              step.value1,
              step.unit1 || "ml",
            )} (V4) of 2nd Dilution Solution & dilute to ${boldValue(
              step.value2,
              step.unit2 || "ml",
            )} (V5) with Diluent.`;
          }
          break;

        case "4th Dilution":
          if (type === "sample") {
            stepText = `Take ${boldValue(
              step.value1,
              step.unit1 || "ml",
            )} (V13) of 3rd Dilution Solution & dilute to ${boldValue(
              step.value2,
              step.unit2 || "ml",
            )} (V14) with Diluent.`;
          } else {
            stepText = `Take ${boldValue(
              step.value1,
              step.unit1 || "ml",
            )} (V6) of 3rd Dilution Solution & dilute to ${boldValue(
              step.value2,
              step.unit2 || "ml",
            )} (V7) with Diluent.`;
          }
          break;

        case "Filtration":
          stepText = `Filter the solution through ${boldValue(
            step.value1,
            step.unit1 || "µm",
          )} syringe filter.`;
          break;

        case "Instrument Details":
          stepText = `Instrument ID: ${step.id || "___"}, RPM: ${boldValue(
            step.value1,
            "rpm",
          )}, Temperature: ${boldValue(step.value2, step.unit2 || "°C")}.`;
          break;

        case "Tablet Details":
          stepText = `Claim: ${boldValue(
            step.value1,
            step.unit1 || "mg",
          )}, Media Volume: ${boldValue(
            step.value2,
            step.unit2 || "ml",
          )} (V8), Sampling Time: ${boldValue(step.value3, step.unit3 || "min")}.`;
          break;

        case "Weighing (Empty Bottle)":
        case "Weighing (Empty Crucible)":
          stepText = `Weigh of ${
            step.name.includes("Bottle") ? "Empty Bottle" : "Empty Crucible"
          }: ${boldValue(step.value1, step.unit1 || "g")} (W1) ${
            step.logBookID ? ` (Log ID: ${step.logBookID})` : ""
          }.`;
          break;

        case "Weighing (Before Drying)":
          stepText = `Weigh of ${
            preparationType!.includes("lod") ? "Bottle" : "Crucible"
          } + Sample: ${boldValue(step.value1, step.unit1 || "g")} (W2).`;
          break;

        case "Drying":
          stepText = `Dry the sample at ${boldValue(
            step.value1,
            step.unit1 || "°C",
          )} for ${boldValue(step.value2, step.unit2 || "hr")}${
            step.logBookID ? ` (Log ID: ${step.logBookID})` : ""
          }.`;
          break;

        case "Weighing (After Drying)":
          stepText = `Weigh of ${
            preparationType!.includes("lod") ? "Bottle" : "Crucible"
          } + Sample after drying: ${boldValue(
            step.value1,
            step.unit1 || "g",
          )} (W3).`;
          break;

        default:
          const val1 = step.value1 ? boldValue(step.value1, step.unit1) : "";
          const val2 = step.value2 ? boldValue(step.value2, step.unit2) : "";
          stepText = `${step.name}: ${val1} ${val2}`.trim();
      }

      return {
        stepName: step.name,
        stepText: stepText,
      };
    });
  };

  const renderPreparationStepsTable = (
    steps: any[],
    type: string,
    preparationType?: string,
    assignedStandard?: string,
  ) => {
    const formattedSteps = formatPreparationSteps(
      steps,
      type,
      preparationType!,
      assignedStandard,
    );
    if (!formattedSteps || formattedSteps.length === 0) return null;

    return (
      <table className="w-full border border-black text-sm">
        <tbody>
          {formattedSteps.map((step, idx) => (
            <tr key={idx} className="border-b border-black last:border-b-0">
              <td className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                {step.stepName}
              </td>
              <td className="px-3 py-2">
                <span dangerouslySetInnerHTML={{ __html: step.stepText }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderHeaderAndSampleSection = (
    param: any,
    paramIdx: number,
    totalParams: number,
  ) => {
    return (
      <div className="keep-together">
        <div className="mb-2">
          <table className="w-full">
            <table className="w-full table-fixed border border-black">
              <tbody>
                <tr className="bg-gray-200">
                  <td
                    className="border border-black px-3 py-2 text-sm font-bold text-center"
                    colSpan={4}
                  >
                    EDWARD FOOD RESEARCH & ANALYSIS CENTRE LTD
                  </td>
                </tr>

                <tr>
                  <td
                    className="border border-black px-3 py-2 font-bold text-sm text-center"
                    colSpan={4}
                  >
                    Raw Data Worksheet
                  </td>
                </tr>

                <tr>
                  <td
                    className="border border-black px-3 py-2 text-center font-bold text-md"
                    colSpan={4}
                  >
                    Annexure-{paramIdx + 1}
                  </td>
                </tr>
              </tbody>
            </table>
          </table>
        </div>

        <div className="mb-2">
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
                    {sampleData.recieptDate || ""}
                  </td>
                </tr>

                <tr>
                  <td className="border border-black px-3 py-2" colSpan={2}>
                    Sample Name: {worksheetInfo.sample.sampleName}
                  </td>
                  <td className="border border-black px-3 py-2" colSpan={2}>
                    Due Date:{" "}
                    {sampleData.tatDate || ""}
                  </td>
                </tr>

                <tr>
                  <td className="border border-black px-3 py-2" colSpan={2}>
                    Analysis Started On:{" "}
                    {sampleData.analysisStartDate
                      ? sampleData.analysisStartDate
                      : ""}
                  </td>
                  <td className="border border-black px-3 py-2" colSpan={2}>
                    Analysis Completed On:{" "}
                    {sampleData.analysisCompletionDate
                      ? sampleData.analysisCompletionDate
                      : ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </table>
        </div>

        <div className="mb-2">
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
                <td className="px-3 py-3">{param.parameterName}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="w-10 px-4 py-3 border-r border-black text-center">
                  3
                </td>
                <td className="w-1/3 px-4 py-3 border-r border-black">
                  Method(s) of Analysis / testing
                </td>
                <td className="px-3 py-3 h-16">{param.methodName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSignatureSection = () => {
    return (
      <div className="footer-section mt-20 mb-6">
        <table className="signature-table w-full text-sm">
          <thead>
            <tr className="bg-white">
              <th className="px-4 py-3 text-center font-bold">
                ANALYZED BY
                <div className="font-normal text-xs mt-0.5">(Sign & Date)</div>
              </th>
              <th className="px-4 py-3 text-center font-bold">
                REVIEWED BY (QC)
                <div className="font-normal text-xs mt-0.5">(Sign & Date)</div>
              </th>
              <th className="px-4 py-3 text-center font-bold">
                APPROVED BY (QA)
                <div className="font-normal text-xs mt-0.5">(Sign & Date)</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    );
  };

  const calculateDissoStats = (calcData: any) => {
    const result1 = calcData.calculationResultTablet1;
    const result2 = calcData.calculationResultTablet2;
    const result3 = calcData.calculationResultTablet3;
    const result4 = calcData.calculationResultTablet4;
    const result5 = calcData.calculationResultTablet5;
    const result6 = calcData.calculationResultTablet6;
    const resultUnit = calcData.calculationResultUnit || "";

    if (result1 && result2 && result3 && result4 && result5 && result6) {
      const nr1 = parseFloat(result1);
      const nr2 = parseFloat(result2);
      const nr3 = parseFloat(result3);
      const nr4 = parseFloat(result4);
      const nr5 = parseFloat(result5);
      const nr6 = parseFloat(result6);

      if (
        !isNaN(nr1) &&
        isFinite(nr1) &&
        !isNaN(nr2) &&
        isFinite(nr2) &&
        !isNaN(nr3) &&
        isFinite(nr3) &&
        !isNaN(nr4) &&
        isFinite(nr4) &&
        !isNaN(nr5) &&
        isFinite(nr5) &&
        !isNaN(nr6) &&
        isFinite(nr6)
      ) {
        return {
          average: ((nr1 + nr2 + nr3 + nr4 + nr5 + nr6) / 6).toFixed(4),
          minimum: Math.min(nr1, nr2, nr3, nr4, nr5, nr6).toFixed(4),
          maximum: Math.max(nr1, nr2, nr3, nr4, nr5, nr6).toFixed(4),
          unit: resultUnit,
          results: [nr1, nr2, nr3, nr4, nr5, nr6],
          areas: [
            calcData.areaOfSample1,
            calcData.areaOfSample2,
            calcData.areaOfSample3,
            calcData.areaOfSample4,
            calcData.areaOfSample5,
            calcData.areaOfSample6,
          ],
        };
      }
    }

    return null;
  };

  const calculateUCStats = (calcData: any) => {
    const result1 = calcData.calculationResultTablet1;
    const result2 = calcData.calculationResultTablet2;
    const result3 = calcData.calculationResultTablet3;
    const result4 = calcData.calculationResultTablet4;
    const result5 = calcData.calculationResultTablet5;
    const result6 = calcData.calculationResultTablet6;
    const result7 = calcData.calculationResultTablet7;
    const result8 = calcData.calculationResultTablet8;
    const result9 = calcData.calculationResultTablet9;
    const result10 = calcData.calculationResultTablet10;
    const resultUnit = calcData.calculationResultUnit || "";

    if (result1 && result2 && result3 && result4 && result5 && result6 && result7 && result8 && result9 && result10) {
      const nr1 = parseFloat(result1);
      const nr2 = parseFloat(result2);
      const nr3 = parseFloat(result3);
      const nr4 = parseFloat(result4);
      const nr5 = parseFloat(result5);
      const nr6 = parseFloat(result6);
      const nr7 = parseFloat(result7);
      const nr8 = parseFloat(result8);
      const nr9 = parseFloat(result9);
      const nr10 = parseFloat(result10);

      if (
        !isNaN(nr1) && isFinite(nr1) &&
        !isNaN(nr2) && isFinite(nr2) &&
        !isNaN(nr3) && isFinite(nr3) &&
        !isNaN(nr4) && isFinite(nr4) &&
        !isNaN(nr5) && isFinite(nr5) &&
        !isNaN(nr6) && isFinite(nr6) &&
        !isNaN(nr7) && isFinite(nr7) &&
        !isNaN(nr8) && isFinite(nr8) &&
        !isNaN(nr9) && isFinite(nr9) &&
        !isNaN(nr10) && isFinite(nr10)
      ) {
        return {
          average: ((nr1 + nr2 + nr3 + nr4 + nr5 + nr6 + nr7 + nr8 + nr9 + nr10) / 10).toFixed(4),
          minimum: Math.min(nr1, nr2, nr3, nr4, nr5, nr6, nr7, nr8, nr9, nr10).toFixed(4),
          maximum: Math.max(nr1, nr2, nr3, nr4, nr5, nr6, nr7, nr8, nr9, nr10).toFixed(4),
          unit: resultUnit,
          results: [nr1, nr2, nr3, nr4, nr5, nr6, nr7, nr8, nr9, nr10],
          areas: [
            calcData.areaOfSample1,
            calcData.areaOfSample2,
            calcData.areaOfSample3,
            calcData.areaOfSample4,
            calcData.areaOfSample5,
            calcData.areaOfSample6,
            calcData.areaOfSample7,
            calcData.areaOfSample8,
            calcData.areaOfSample9,
            calcData.areaOfSample10,
          ],
        };
      }
    }

    return null;
  };

  const findUnitForKey = (calcData: any, key: string): string => {
    if (
      [
        "calculationResultTablet1",
        "calculationResultTablet2",
        "calculationResultTablet3",
        "calculationResultTablet4",
        "calculationResultTablet5",
        "calculationResultTablet6",
        "calculationResultTablet7",
        "calculationResultTablet8",
        "calculationResultTablet9",
        "calculationResultTablet10",
      ].includes(key)
    )
      key = "calculationResult";

    const unitKey = `${key}Unit`;
    const unitKeyAlt = `${key.replace(/([A-Z])/g, "_$1").toLowerCase()}_unit`;

    if (calcData[unitKey]) return calcData[unitKey];
    if (calcData[unitKeyAlt]) return calcData[unitKeyAlt];

    return "";
  };

  // Render mathematical formula with fraction bar
  const renderMathFormula = (
    numerator: string,
    denominator: string,
    resultUnit?: string,
  ) => {
    return (
      <div className="formula-display my-3">
        <div className="flex items-center justify-center gap-3">
          <div className="formula-fraction text-center">
            <div className="numerator px-4 py-2 border-b-1 border-black text-xs">
              {numerator}
            </div>
            <div className="denominator px-4 py-2 text-xs">{denominator}</div>
          </div>
          {resultUnit && (
            <div className="text-sm font-semibold">{resultUnit}</div>
          )}
        </div>
      </div>
    );
  };

  // Generate formula derivation for each calculation type
  const renderCalculationDerivation = (calcData: any, calcType: string) => {
    const type = calcType.toLowerCase();

    if (type.includes("assay")) {
      const areaSample = calcData.areaOfSample || "___";
      const areaStd = calcData.areaOfStandard || "___";
      const mwBase = calcData.mWBase || "___";
      const mwSalt = calcData.mWSalt || "___";
      const purity = calcData.purity || "___";

      const sw1 = calcData.sw1 || "___";
      const sw2 = calcData.sw2 || "___";
      const v1 = calcData.v1 || "___";
      const v2 = calcData.v2 || "___";
      const v3 = calcData.v3 || "___";
      const v4 = calcData.v4 || "___";
      const v5 = calcData.v5 || "___";
      const v6 = calcData.v6 || "___";
      const v7 = calcData.v7 || "___";
      const v8 = calcData.v8 || "___";
      const v9 = calcData.v9 || "___";
      const v10 = calcData.v10 || "___";
      const v11 = calcData.v11 || "___";
      const v12 = calcData.v12 || "___";
      const v13 = calcData.v13 || "___";
      const v14 = calcData.v14 || "___";

      const stdVolsNumSymbolic: string[] = [];
      const stdVolsDenomSymbolic: string[] = [];
      const stdVolsNumValues: string[] = [];
      const stdVolsDenomValues: string[] = [];

      if (v1 !== "___" && v1 !== "0") {
        stdVolsDenomSymbolic.push("V1");
        stdVolsDenomValues.push(v1);
      }
      if (v2 !== "___" && v2 !== "0") {
        stdVolsNumSymbolic.push("V2");
        stdVolsNumValues.push(v2);
      }
      if (v3 !== "___" && v3 !== "0") {
        stdVolsDenomSymbolic.push("V3");
        stdVolsDenomValues.push(v3);
      }
      if (v4 !== "___" && v4 !== "0") {
        stdVolsNumSymbolic.push("V4");
        stdVolsNumValues.push(v4);
      }
      if (v5 !== "___" && v5 !== "0") {
        stdVolsDenomSymbolic.push("V5");
        stdVolsDenomValues.push(v5);
      }
      if (v6 !== "___" && v6 !== "0") {
        stdVolsNumSymbolic.push("V6");
        stdVolsNumValues.push(v6);
      }
      if (v7 !== "___" && v7 !== "0") {
        stdVolsDenomSymbolic.push("V7");
        stdVolsDenomValues.push(v7);
      }

      const smpVolsNumSymbolic: string[] = [];
      const smpVolsDenomSymbolic: string[] = [];
      const smpVolsNumValues: string[] = [];
      const smpVolsDenomValues: string[] = [];

      if (v8 !== "___" && v8 !== "0") {
        smpVolsNumSymbolic.push("V8");
        smpVolsNumValues.push(v8);
      }
      if (v9 !== "___" && v9 !== "0") {
        smpVolsDenomSymbolic.push("V9");
        smpVolsDenomValues.push(v9);
      }
      if (v10 !== "___" && v10 !== "0") {
        smpVolsNumSymbolic.push("V10");
        smpVolsNumValues.push(v10);
      }
      if (v11 !== "___" && v11 !== "0") {
        smpVolsDenomSymbolic.push("V11");
        smpVolsDenomValues.push(v11);
      }
      if (v12 !== "___" && v12 !== "0") {
        smpVolsNumSymbolic.push("V12");
        smpVolsNumValues.push(v12);
      }
      if (v13 !== "___" && v13 !== "0") {
        smpVolsDenomSymbolic.push("V13");
        smpVolsDenomValues.push(v13);
      }
      if (v14 !== "___" && v14 !== "0") {
        smpVolsNumSymbolic.push("V14");
        smpVolsNumValues.push(v14);
      }

      // Build formula parts
      const numeratorSymbolic = [
        "Area/ABS of Sample",
        "× SW1",
        ...stdVolsNumSymbolic.map((v: string) => `× ${v}`),
        ...smpVolsNumSymbolic.map((v: string) => `× ${v}`),
        "× MW Base",
        "× Purity %",
      ].join(" ");

      const denominatorSymbolic = [
        "Area/ABS of Standard",
        ...stdVolsDenomSymbolic.map((v: string) => `× ${v}`),
        "× SW2",
        ...smpVolsDenomSymbolic.map((v: string) => `× ${v}`),
        "× MW Salt",
        "× 100",
      ].join(" ");

      const numeratorValues = [
        areaSample,
        sw1,
        ...stdVolsNumValues,
        ...smpVolsNumValues,
        mwBase,
        purity,
      ].join(" × ");

      const denominatorValues = [
        areaStd,
        ...stdVolsDenomValues,
        sw2,
        ...smpVolsDenomValues,
        mwSalt,
        "100",
      ].join(" × ");

      return (
        <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
          <p className="font-bold text-sm mb-2">Formula (Symbolic):</p>
          {renderMathFormula(
            numeratorSymbolic,
            denominatorSymbolic,
            calcData.calculationResultUnit,
          )}

          <p className="font-bold text-sm mb-2 mt-4">
            Derivation (With Values):
          </p>
          {renderMathFormula(numeratorValues, denominatorValues)}

          {calcData.calculationResult && (
            <p className="text-center font-bold text-sm mt-3">
              Result = {calcData.calculationResult}{" "}
              {calcData.calculationResultUnit}
            </p>
          )}
        </div>
      );
    } else if (type.includes("residual_solvent")) {
      const areaSample = calcData.areaOfSample || "___";
      const areaStd = calcData.areaOfStandard || "___";
      const purity = calcData.purity || "___";

      const sw1 = calcData.sw1 || "___";
      const sw2 = calcData.sw2 || "___";
      const v1 = calcData.v1 || "___";
      const v2 = calcData.v2 || "___";
      const v3 = calcData.v3 || "___";
      const v4 = calcData.v4 || "___";
      const v5 = calcData.v5 || "___";
      const v6 = calcData.v6 || "___";

      // Build formula parts - only include non-zero volumes
      const numVols: string[] = [];
      const numVolsValues: string[] = [];
      const denVols: string[] = [];
      const denVolsValues: string[] = [];

      if (v2 !== "___" && v2 !== "0") {
        numVols.push("V2");
        numVolsValues.push(v2);
      }
      if (v4 !== "___" && v4 !== "0") {
        numVols.push("V4");
        numVolsValues.push(v4);
      }
      if (v6 !== "___" && v6 !== "0") {
        numVols.push("V6");
        numVolsValues.push(v6);
      }
      if (v1 !== "___" && v1 !== "0") {
        denVols.push("V1");
        denVolsValues.push(v1);
      }
      if (v3 !== "___" && v3 !== "0") {
        denVols.push("V3");
        denVolsValues.push(v3);
      }
      if (v5 !== "___" && v5 !== "0") {
        denVols.push("V5");
        denVolsValues.push(v5);
      }

      const numeratorSymbolic = [
        "Area/ABS Sample",
        "× SW1",
        ...numVols.map((v: string) => `× ${v}`),
        "× Purity",
        "× 1000000",
      ].join(" ");

      const denominatorSymbolic = [
        "Area/ABS Standard",
        ...denVols.map((v: string) => `× ${v}`),
        "× SW2",
        "× 100",
      ].join(" ");

      const numeratorValues = [
        areaSample,
        sw1,
        ...numVolsValues,
        purity,
        "1000000",
      ].join(" × ");

      const denominatorValues = [areaStd, ...denVolsValues, sw2, "100"].join(
        " × ",
      );

      return (
        <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
          <p className="font-bold text-sm mb-2">Formula (Symbolic):</p>
          {renderMathFormula(numeratorSymbolic, denominatorSymbolic, "ppm")}

          <p className="font-bold text-sm mb-2 mt-4">
            Derivation (With Values):
          </p>
          {renderMathFormula(numeratorValues, denominatorValues)}

          {calcData.calculationResult && (
            <p className="text-center font-bold text-sm mt-3">
              Result = {calcData.calculationResult}{" "}
              {calcData.calculationResultUnit}
            </p>
          )}
        </div>
      );
    } else if (type.includes("dissolution")) {
      const areaStd = calcData.areaOfStandard || "___";
      const mwBase = calcData.mWBase || "___";
      const mwSalt = calcData.mWSalt || "___";
      const purity = calcData.purity || "___";

      const sw1 = calcData.sw1 || "___";
      const claim = calcData.claim || "___";
      const v1 = calcData.v1 || "___";
      const v2 = calcData.v2 || "___";
      const v3 = calcData.v3 || "___";
      const v4 = calcData.v4 || "___";
      const v5 = calcData.v5 || "___";
      const v6 = calcData.v6 || "___";
      const v7 = calcData.v7 || "___";
      const v8 = calcData.v8 || "___";
      const v9 = calcData.v9 || "___";
      const v10 = calcData.v10 || "___";
      const v11 = calcData.v11 || "___";
      const v12 = calcData.v12 || "___";
      const v13 = calcData.v13 || "___";
      const v14 = calcData.v14 || "___";

      const stdVolsNumSymbolic: string[] = [];
      const stdVolsDenomSymbolic: string[] = [];
      const stdVolsNumValues: string[] = [];
      const stdVolsDenomValues: string[] = [];

      if (v1 !== "___" && v1 !== "0") {
        stdVolsDenomSymbolic.push("V1");
        stdVolsDenomValues.push(v1);
      }
      if (v2 !== "___" && v2 !== "0") {
        stdVolsNumSymbolic.push("V2");
        stdVolsNumValues.push(v2);
      }
      if (v3 !== "___" && v3 !== "0") {
        stdVolsDenomSymbolic.push("V3");
        stdVolsDenomValues.push(v3);
      }
      if (v4 !== "___" && v4 !== "0") {
        stdVolsNumSymbolic.push("V4");
        stdVolsNumValues.push(v4);
      }
      if (v5 !== "___" && v5 !== "0") {
        stdVolsDenomSymbolic.push("V5");
        stdVolsDenomValues.push(v5);
      }
      if (v6 !== "___" && v6 !== "0") {
        stdVolsNumSymbolic.push("V6");
        stdVolsNumValues.push(v6);
      }
      if (v7 !== "___" && v7 !== "0") {
        stdVolsDenomSymbolic.push("V7");
        stdVolsDenomValues.push(v7);
      }

      const smpVolsNumSymbolic: string[] = [];
      const smpVolsDenomSymbolic: string[] = [];
      const smpVolsNumValues: string[] = [];
      const smpVolsDenomValues: string[] = [];

      if (v8 !== "___" && v8 !== "0") {
        smpVolsNumSymbolic.push("Media Vol (V8)");
        smpVolsNumValues.push(v8);
      }

      if (v9 !== "___" && v9 !== "0") {
        smpVolsDenomSymbolic.push("V9");
        smpVolsDenomValues.push(v9);
      }
      if (v10 !== "___" && v10 !== "0") {
        smpVolsNumSymbolic.push("V10");
        smpVolsNumValues.push(v10);
      }
      if (v11 !== "___" && v11 !== "0") {
        smpVolsDenomSymbolic.push("V11");
        smpVolsDenomValues.push(v11);
      }
      if (v12 !== "___" && v12 !== "0") {
        smpVolsNumSymbolic.push("V12");
        smpVolsNumValues.push(v12);
      }
      if (v13 !== "___" && v13 !== "0") {
        smpVolsDenomSymbolic.push("V13");
        smpVolsDenomValues.push(v13);
      }
      if (v14 !== "___" && v14 !== "0") {
        smpVolsNumSymbolic.push("V14");
        smpVolsNumValues.push(v14);
      }

      const numeratorSymbolic = [
        "Area/ABS of Sample",
        "× SW1",
        ...stdVolsNumSymbolic.map((v: string) => `× ${v}`),
        ...smpVolsNumSymbolic.map((v: string) => `× ${v}`),
        "× MW Base",
        "× Purity %",
        "× 100",
      ].join(" ");

      const denominatorSymbolic = [
        "Area/ABS of Standard",
        ...stdVolsDenomSymbolic.map((v: string) => `× ${v}`),
        "× Claim",
        ...smpVolsDenomSymbolic.map((v: string) => `× ${v}`),
        "× MW Salt",
        "× 100",
      ].join(" ");

      const stats = calculateDissoStats(calcData);

      return (
        <div className="mb-3">
          <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
            <p className="font-bold text-sm mb-2">Formula (Symbolic):</p>
            {renderMathFormula(
              numeratorSymbolic,
              denominatorSymbolic,
              "mg/tablet",
            )}
          </div>

          {stats && stats.results && (
            <div className="mt-4">
              {stats.results.map((result, idx) => {
                const areaSample = stats.areas[idx] || "___";
                const numeratorValues = [
                  areaSample,
                  sw1,
                  ...stdVolsNumValues,
                  ...smpVolsNumValues,
                  mwBase,
                  purity,
                  "100",
                ].join(" × ");

                const denominatorValues = [
                  areaStd,
                  ...stdVolsDenomValues,
                  claim,
                  ...smpVolsDenomValues,
                  mwSalt,
                  "100",
                ].join(" × ");

                return (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-black p-3 mb-3 keep-together"
                  >
                    <p className="font-bold text-sm  mb-2">
                      Derivation (Tablet {idx + 1}):
                    </p>
                    {renderMathFormula(numeratorValues, denominatorValues)}
                    <p className="text-center font-bold text-xs mt-2">
                      Result = {result.toFixed(4)} mg/tablet
                    </p>
                  </div>
                );
              })}

              <div className="mt-4 border border-black keep-together">
                <table className="w-full">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td colSpan={3} className="p-3 border-b border-black">
                        <p className="font-bold text-sm">
                          Statistical Summary:
                        </p>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="text-center p-3 border-r border-black">
                        <p className="font-semibold text-xs">Minimum</p>
                        <p className="text-lg font-bold">{stats.minimum}</p>
                      </td>
                      <td className="text-center p-3 border-r border-black">
                        <p className="font-semibold text-xs">Average</p>
                        <p className="text-lg font-bold">{stats.average}</p>
                      </td>
                      <td className="text-center p-3">
                        <p className="font-semibold text-xs">Maximum</p>
                        <p className="text-lg font-bold">{stats.maximum}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    } else if (
      type.includes("lod") ||
      type.includes("sulphated_ash") ||
      type.includes("roi")
    ) {
      // Read stored values directly from calcData
      const w1 = calcData.w1 || "___";
      const w2 = calcData.w2 || "___";
      const w3 = calcData.w3 || "___";

      const numeratorSymbolic = "(W2 - W3)";
      const denominatorSymbolic = "(W2 - W1)";

      const numeratorValues = `(${w2} - ${w3})`;
      const denominatorValues = `(${w2} - ${w1})`;

      return (
        <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
          <p className="font-bold text-sm mb-2">Formula (Symbolic):</p>
          <div className="rounded p-3 mb-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-mono">
                {numeratorSymbolic} / {denominatorSymbolic} × 100 %
              </span>
            </div>
          </div>

          <p className="font-bold text-sm mb-2 mt-4">
            Derivation (With Values):
          </p>
          <div className="bg-gray-100 rounded p-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-mono">
                {numeratorValues} / {denominatorValues} × 100 %
              </span>
            </div>
          </div>

          {calcData.calculationResult && (
            <p className="text-center font-bold text-sm mt-3">
              Result = {calcData.calculationResult}{" "}
              {calcData.calculationResultUnit}
            </p>
          )}
        </div>
      );
    } else if (type.includes("uniformity_of_content")) {
      const areaStd = calcData.areaOfStandard || "___";
      const mwBase = calcData.mWBase || "___";
      const mwSalt = calcData.mWSalt || "___";
      const purity = calcData.purity || "___";

      const sw1 = calcData.sw1 || "___";
      const claim = calcData.claim || "___";
      const dilutedVol = calcData.dilutedVol || "___";
      const v1 = calcData.v1 || "___";
      const v2 = calcData.v2 || "___";
      const v3 = calcData.v3 || "___";
      const v4 = calcData.v4 || "___";
      const v5 = calcData.v5 || "___";
      const v6 = calcData.v6 || "___";
      const v7 = calcData.v7 || "___";
      const v8 = calcData.v8 || "___";
      const v9 = calcData.v9 || "___";
      const v10 = calcData.v10 || "___";
      const v11 = calcData.v11 || "___";
      const v12 = calcData.v12 || "___";
      const v13 = calcData.v13 || "___";
      const v14 = calcData.v14 || "___";
      const v15 = calcData.v15 || "___";
      const v16 = calcData.v16 || "___";

      const stdVolsNumSymbolic: string[] = [];
      const stdVolsDenomSymbolic: string[] = [];
      const stdVolsNumValues: string[] = [];
      const stdVolsDenomValues: string[] = [];

      if (v1 !== "___" && v1 !== "0") {
        stdVolsDenomSymbolic.push("V1");
        stdVolsDenomValues.push(v1);
      }
      if (v2 !== "___" && v2 !== "0") {
        stdVolsNumSymbolic.push("V2");
        stdVolsNumValues.push(v2);
      }
      if (v3 !== "___" && v3 !== "0") {
        stdVolsDenomSymbolic.push("V3");
        stdVolsDenomValues.push(v3);
      }
      if (v4 !== "___" && v4 !== "0") {
        stdVolsNumSymbolic.push("V4");
        stdVolsNumValues.push(v4);
      }
      if (v5 !== "___" && v5 !== "0") {
        stdVolsDenomSymbolic.push("V5");
        stdVolsDenomValues.push(v5);
      }
      if (v6 !== "___" && v6 !== "0") {
        stdVolsNumSymbolic.push("V6");
        stdVolsNumValues.push(v6);
      }
      if (v7 !== "___" && v7 !== "0") {
        stdVolsDenomSymbolic.push("V7");
        stdVolsDenomValues.push(v7);
      }
      if (v8 !== "___" && v8 !== "0") {
        stdVolsNumSymbolic.push("V8");
        stdVolsNumValues.push(v8);
      }

      const smpVolsNumSymbolic: string[] = [];
      const smpVolsDenomSymbolic: string[] = [];
      const smpVolsNumValues: string[] = [];
      const smpVolsDenomValues: string[] = [];

      if (v9 !== "___" && v9 !== "0") {
        smpVolsDenomSymbolic.push("V9");
        smpVolsDenomValues.push(v9);
      }
      if (v10 !== "___" && v10 !== "0") {
        smpVolsNumSymbolic.push("V10");
        smpVolsNumValues.push(v10);
      }
      if (v11 !== "___" && v11 !== "0") {
        smpVolsDenomSymbolic.push("V11");
        smpVolsDenomValues.push(v11);
      }
      if (v12 !== "___" && v12 !== "0") {
        smpVolsNumSymbolic.push("V12");
        smpVolsNumValues.push(v12);
      }
      if (v13 !== "___" && v13 !== "0") {
        smpVolsDenomSymbolic.push("V13");
        smpVolsDenomValues.push(v13);
      }
      if (v14 !== "___" && v14 !== "0") {
        smpVolsNumSymbolic.push("V14");
        smpVolsNumValues.push(v14);
      }
      if (v15 !== "___" && v15 !== "0") {
        smpVolsDenomSymbolic.push("V15");
        smpVolsDenomValues.push(v15);
      }
      if (v16 !== "___" && v16 !== "0") {
        smpVolsNumSymbolic.push("V16");
        smpVolsNumValues.push(v16);
      }

      const numeratorSymbolic = [
        "Area/ABS of Sample",
        "× SW1",
        ...stdVolsNumSymbolic.map((v: string) => `× ${v}`),
        ...smpVolsNumSymbolic.map((v: string) => `× ${v}`),
        "× MW Base",
        "× Purity %",
        "× Claim",
      ].join(" ");

      const denominatorSymbolic = [
        "Area/ABS of Standard",
        ...stdVolsDenomSymbolic.map((v: string) => `× ${v}`),
        "× Diluted Vol",
        ...smpVolsDenomSymbolic.map((v: string) => `× ${v}`),
        "× MW Salt",
        "× 100",
      ].join(" ");

      const stats = calculateUCStats(calcData);

      return (
        <div className="mb-3">
          <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
            <p className="font-bold text-sm mb-2">Formula (Symbolic):</p>
            {renderMathFormula(
              numeratorSymbolic,
              denominatorSymbolic,
              "mg/tablet",
            )}
          </div>

          {stats && stats.results && (
            <div className="mt-4">
              {stats.results.map((result, idx) => {
                const areaSample = stats.areas[idx] || "___";
                const numeratorValues = [
                  areaSample,
                  sw1,
                  ...stdVolsNumValues,
                  ...smpVolsNumValues,
                  mwBase,
                  purity,
                  claim,
                ].join(" × ");

                const denominatorValues = [
                  areaStd,
                  ...stdVolsDenomValues,
                  dilutedVol,
                  ...smpVolsDenomValues,
                  mwSalt,
                  "100",
                ].join(" × ");

                return (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-black p-3 mb-3 keep-together"
                  >
                    <p className="font-bold text-sm  mb-2">
                      Derivation (Tablet {idx + 1}):
                    </p>
                    {renderMathFormula(numeratorValues, denominatorValues)}
                    <p className="text-center font-bold text-xs mt-2">
                      Result = {result.toFixed(4)} mg/tablet
                    </p>
                  </div>
                );
              })}

              <div className="mt-4 border border-black keep-together">
                <table className="w-full">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td colSpan={3} className="p-3 border-b border-black">
                        <p className="font-bold text-sm">
                          Statistical Summary:
                        </p>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="text-center p-3 border-r border-black">
                        <p className="font-semibold text-xs">Minimum</p>
                        <p className="text-lg font-bold">{stats.minimum}</p>
                      </td>
                      <td className="text-center p-3 border-r border-black">
                        <p className="font-semibold text-xs">Average</p>
                        <p className="text-lg font-bold">{stats.average}</p>
                      </td>
                      <td className="text-center p-3">
                        <p className="font-semibold text-xs">Maximum</p>
                        <p className="text-lg font-bold">{stats.maximum}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
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

            /* Fix blue background overflow */
            .bg-gray-100 {
              overflow: hidden;
              box-sizing: border-box;
            }

            /* Ensure all elements with borders contain their backgrounds */
            .border-black,
            .border {
              box-sizing: border-box;
              overflow: hidden;
            }
            
            .page-break-before {
              page-break-before: always;
              break-before: always;
            }
            
            .page-break-inside-avoid {
              page-break-inside: avoid;
              break-inside: avoid;
              orphans: 3;
              widows: 3;
            }
            
            /* Table page break rules - ALLOW breaking but keep rows together */
            table {
              page-break-inside: auto;
              break-inside: auto;
              border-collapse: collapse;
            }
            
            /* Keep individual table rows together */
            tr {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            /* Repeat table header on each page if needed */
            thead {
              display: table-header-group;
            }
            
            /* Ensure table borders render on each page */
            tbody {
              page-break-inside: auto;
              break-inside: auto;
            }
            
            /* Keep entire preparation section together */
            .section-container {
              page-break-inside: avoid;
              break-inside: avoid;
              margin-bottom: 15px;
              orphans: 3;
              widows: 3;
            }
            
            .keep-together {
              page-break-inside: avoid;
              break-inside: avoid;
              orphans: 4;
              widows: 4;
            }
            
            h3, h4, h5 {
              page-break-after: avoid;
              break-after: avoid;
              orphans: 3;
              widows: 3;
            }
            
            .footer-section {
              page-break-inside: avoid;
              break-inside: avoid;
              margin-top: 60px;
            }

            /* Mathematical derivation - keep formula boxes together */
            .formula-display {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* If a section must break, add margin to next page */
            .mb-4, .mb-6 {
              page-break-after: auto;
            }

            /* Prevent orphan/widow lines in paragraphs */
            p {
              orphans: 3;
              widows: 3;
            }

            /* Allow mt-4 sections to break if needed */
            .mt-4 {
              page-break-inside: auto;
            }

            /* Table cells should not break */
            td {
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
          }

          .formula-fraction {
            display: inline-block;
            vertical-align: middle;
          }

          .numerator, .denominator {
            min-width: 200px;
            text-align: center;
          }
        `}
      </style>

      <div className="min-h-screen">
  <div className="no-print bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
    <div className="max-w-[1900px] mx-auto px-8 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Worksheet Print Preview
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Review before printing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

        <div className="print-container">
          {worksheetInfo.parameters.map((param: any, paramIdx: number) => {
            const filteredInstruments = instruments.filter((inst) =>
              param.instrumentIds?.includes(inst.id),
            );
            const filteredChemicals = chemicals.filter((chem) =>
              param.chemicalIds?.includes(chem.slno),
            );
            const filteredStandards = standards.filter((std) =>
              param.standardIds?.includes(std.serialNo),
            );

            return (
              <div
                key={paramIdx}
                className={paramIdx > 0 ? "page-break-before" : ""}
              >
                {renderHeaderAndSampleSection(
                  param,
                  paramIdx,
                  worksheetInfo.parameters.length,
                )}

                <div className="my-6">
                  <div className="keep-together">
                    <h3 className="text-lg bg-gray-200 font-bold border border-black mb-3 px-3 py-2 uppercase">
                      Parameter: {param.parameterName} ({param.paraCode})
                    </h3>
                  </div>

                  {/* Instruments */}
                  {filteredInstruments.length > 0 && (
                    <div className="section-container mb-4">
                      <h4 className="text-md uppercase font-bold mb-2">
                        Instruments Used
                      </h4>
                      <table className="w-full border border-black text-sm">
                        <thead>
                          <tr className="bg-gray-100">
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
                                {inst.instrumentTag}
                              </td>
                              <td className="border border-black px-3 py-2">
                                {inst.name}
                              </td>
                              <td className="border border-black px-3 py-2">
                                {inst.calibrationDoneDate
                                  ? new Date(
                                      inst.calibrationDoneDate,
                                    ).toLocaleDateString("en-GB")
                                  : "N/A"}
                              </td>
                              <td className="border border-black px-3 py-2">
                                {inst.calibrationDueDate
                                  ? new Date(
                                      inst.calibrationDueDate,
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
                      <h4 className="text-md uppercase font-bold mb-2">
                        Chemicals/Reagents Used
                      </h4>
                      <table className="w-full border border-black text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-black px-3 py-2 text-left font-bold">
                              Chemical Name
                            </th>
                            <th className="border border-black px-3 py-2 text-left font-bold">
                              Code
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
                                {chem.code || "N/A"}
                              </td>
                              <td className="border border-black px-3 py-2">
                                {chem.make || "N/A"}
                              </td>
                              <td className="border border-black px-3 py-2">
                                {chem.batchNo || "N/A"}
                              </td>
                              <td className="border border-black px-3 py-2">
                                {chem.exp_Date
                                  ? new Date(chem.exp_Date).toLocaleDateString(
                                      "en-GB",
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
                      <h4 className="text-md uppercase font-bold mb-2">
                        Standards Used
                      </h4>
                      <table className="w-full border border-black text-sm">
                        <thead>
                          <tr className="bg-gray-100">
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
                                      "en-GB",
                                    )
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Mobile Phase Preparations */}
                  {param.preparations &&
                    safeJSONParse(param.preparations, []).filter(
                      (p: any) => p.preparationCategory === "mobile_phase",
                    ).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          Mobile Phase Preparations
                        </h4>
                        {safeJSONParse(param.preparations, [])
                          .filter(
                            (p: any) => p.preparationCategory === "mobile_phase",
                          )
                          .map((prep: any, idx: number) => {
                            const steps = safeJSONParse(prep.steps, []);
                            const stepsTable = renderPreparationStepsTable(
                              steps,
                              "mobile_phase",
                              prep.preparationType || "mobile_phase",
                              prep.assignedStandardId,
                            );

                            if (!stepsTable) return null;

                            return (
                              <div key={idx} className="section-container mb-3">
                                <div className="mb-1">
                                  <p className="font-bold text-sm">
                                    {prep.label}
                                  </p>
                                </div>
                                <div className="p-0">{stepsTable}</div>
                              </div>
                            );
                          })}
                      </div>
                    )}

                  {/* Dissolution Media Preparations */}
                  {param.preparations &&
                    safeJSONParse(param.preparations, []).filter(
                      (p: any) => p.preparationCategory === "dissolution_media",
                    ).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          Dissolution Media Preparations
                        </h4>
                        {safeJSONParse(param.preparations, [])
                          .filter(
                            (p: any) =>
                              p.preparationCategory === "dissolution_media",
                          )
                          .map((prep: any, idx: number) => {
                            const steps = safeJSONParse(prep.steps, []);
                            const stepsTable = renderPreparationStepsTable(
                              steps,
                              "dissolution_media",
                              prep.preparationType || "dissolution_media",
                              prep.assignedStandardId,
                            );

                            if (!stepsTable) return null;

                            return (
                              <div key={idx} className="section-container mb-3">
                                <div className="mb-1">
                                  <p className="font-bold text-sm">
                                    {prep.label}
                                  </p>
                                </div>
                                <div className="p-0">{stepsTable}</div>
                              </div>
                            );
                          })}
                      </div>
                    )}

                  {/* Standard Preparations */}
                  {((param.standardPreparations &&
                    param.standardPreparations.length > 0) ||
                    (param.preparations &&
                      safeJSONParse(param.preparations, []).filter(
                        (p: any) => p.preparationCategory === "standard",
                      ).length > 0)) && (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          Standard Preparations
                        </h4>
                        {/* Old structure - standardPreparations array */}
                        {param.standardPreparations &&
                          param.standardPreparations.map(
                            (prep: any, idx: number) => {
                              const steps = safeJSONParse(prep.steps, []);
                              const stepsTable = renderPreparationStepsTable(
                                steps,
                                "standard",
                                prep.preparationType,
                                prep.assignedStandardId,
                              );

                              if (!stepsTable) return null;

                              return (
                                <div key={`old-${idx}`} className="section-container mb-3">
                                  <div className="mb-1">
                                    <p className="font-bold text-sm">
                                      {prep.label} (
                                      {prep.preparationType === "roi"
                                        ? "ROI"
                                        : prep.preparationType === "lod"
                                          ? "LOD"
                                          : prep.preparationType
                                              ?.split("_")
                                              .filter(Boolean)
                                              .map(
                                                (word: string | any[]) =>
                                                  word[0].toUpperCase() +
                                                  word.slice(1),
                                              )
                                              .join(" ")}
                                      )
                                    </p>
                                  </div>
                                  <div className="p-0">{stepsTable}</div>
                                </div>
                              );
                            },
                          )}
                        {/* New structure - preparations array filtered by category */}
                        {param.preparations &&
                          safeJSONParse(param.preparations, [])
                            .filter(
                              (p: any) => p.preparationCategory === "standard",
                            )
                            .map((prep: any, idx: number) => {
                              const steps = safeJSONParse(prep.steps, []);
                              const stepsTable = renderPreparationStepsTable(
                                steps,
                                "standard",
                                prep.preparationType,
                                prep.assignedStandardId,
                              );

                              if (!stepsTable) return null;

                              return (
                                <div key={`new-${idx}`} className="section-container mb-3">
                                  <div className="mb-1">
                                    <p className="font-bold text-sm">
                                      {prep.label} (
                                      {prep.preparationType === "roi"
                                        ? "ROI"
                                        : prep.preparationType === "lod"
                                          ? "LOD"
                                          : prep.preparationType
                                              ?.split("_")
                                              .filter(Boolean)
                                              .map(
                                                (word: string | any[]) =>
                                                  word[0].toUpperCase() +
                                                  word.slice(1),
                                              )
                                              .join(" ")}
                                      )
                                    </p>
                                  </div>
                                  <div className="p-0">{stepsTable}</div>
                                </div>
                              );
                            })}
                      </div>
                    )}

                  {/* Sample Preparations */}
                  {((param.samplePreparations &&
                    param.samplePreparations.length > 0) ||
                    (param.preparations &&
                      safeJSONParse(param.preparations, []).filter(
                        (p: any) => p.preparationCategory === "sample",
                      ).length > 0)) && (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          Sample Preparations
                        </h4>
                        {/* Old structure - samplePreparations array */}
                        {param.samplePreparations &&
                          param.samplePreparations.map(
                            (prep: any, idx: number) => {
                              const steps = safeJSONParse(prep.steps, []);
                              const stepsTable = renderPreparationStepsTable(
                                steps,
                                "sample",
                                prep.preparationType,
                                prep.solventChemical,
                              );

                              if (!stepsTable) return null;

                              return (
                                <div key={`old-${idx}`} className="section-container mb-3">
                                  <div className="mb-1">
                                    <p className="font-bold text-sm">
                                      {prep.label} (
                                      {prep.preparationType === "roi"
                                        ? "ROI"
                                        : prep.preparationType === "lod"
                                          ? "LOD"
                                          : prep.preparationType
                                              ?.split("_")
                                              .filter(Boolean)
                                              .map(
                                                (word: string | any[]) =>
                                                  word[0].toUpperCase() +
                                                  word.slice(1),
                                              )
                                              .join(" ")}
                                      )
                                    </p>
                                  </div>
                                  <div className="p-0">{stepsTable}</div>
                                </div>
                              );
                            },
                          )}
                        {/* New structure - preparations array filtered by category */}
                        {param.preparations &&
                          safeJSONParse(param.preparations, [])
                            .filter(
                              (p: any) => p.preparationCategory === "sample",
                            )
                            .map((prep: any, idx: number) => {
                              const steps = safeJSONParse(prep.steps, []);
                              const stepsTable = renderPreparationStepsTable(
                                steps,
                                "sample",
                                prep.preparationType,
                                prep.solventChemical,
                              );

                              if (!stepsTable) return null;

                              return (
                                <div key={`new-${idx}`} className="section-container mb-3">
                                  <div className="mb-1">
                                    <p className="font-bold text-sm">
                                      {prep.label} (
                                      {prep.preparationType === "roi"
                                        ? "ROI"
                                        : prep.preparationType === "lod"
                                          ? "LOD"
                                          : prep.preparationType
                                              ?.split("_")
                                              .filter(Boolean)
                                              .map(
                                                (word: string | any[]) =>
                                                  word[0].toUpperCase() +
                                                  word.slice(1),
                                              )
                                              .join(" ")}
                                      )
                                    </p>
                                  </div>
                                  <div className="p-0">{stepsTable}</div>
                                </div>
                              );
                            })}
                      </div>
                    )}

                  {/* Calculations */}
                  {param.calculations && param.calculations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md uppercase font-bold mb-2">
                        Calculations
                      </h4>
                      {param.calculations.map((calc: any, idx: number) => {
                        const calcData = safeJSONParse(calc.data, {});
                        const isDissoCalc = calc.calculationType
                          ?.toLowerCase()
                          .includes("disso");
                        const isUCCalc = calc.calculationType
                          ?.toLowerCase()
                          .includes("uniformity_of_content");

                        return (
                          <div
                            key={idx}
                            className="section-container mb-4 page-break-inside-avoid"
                          >
                            <div className="mb-1">
                              <p className="font-bold text-sm">
                                {calc.label} (
                                {calc.calculationType === "roi"
                                  ? "ROI"
                                  : calc.calculationType === "lod"
                                    ? "LOD"
                                    : calc.calculationType
                                        .split("_")
                                        .filter(Boolean)
                                        .map(
                                          (word: string | any[]) =>
                                            word[0].toUpperCase() +
                                            word.slice(1),
                                        )
                                        .join(" ")}
                                )
                              </p>
                            </div>

                            {/* Calculation Details Table */}
                            <div className="border border-black">
                              <table className="w-full text-sm">
                                <tbody>
                                  {Object.entries(calcData).map(
                                    ([key, value]: [string, any]) => {
                                      // Skip these fields
                                      if (
                                        key === "id" ||
                                        key === "label" ||
                                        value === null ||
                                        value === "" ||
                                        key.toLowerCase().includes("unit") ||
                                        (isDissoCalc &&
                                          key === "calculationResult") ||
                                        // For UC, show calculationResult summary (min, max, avg) but not individual tablet results
                                        (isUCCalc &&
                                          key === "calculationResult") ||
                                        // Skip stored preparation values (used only in formulas)
                                        key === "sw1" ||
                                        key === "sw2" ||
                                        key === "w1" ||
                                        key === "w2" ||
                                        key === "w3" ||
                                        key === "v1" ||
                                        key === "v2" ||
                                        key === "v3" ||
                                        key === "v4" ||
                                        key === "v5" ||
                                        key === "v6" ||
                                        key === "v7" ||
                                        key === "v8" ||
                                        key === "v9" ||
                                        key === "v10" ||
                                        key === "v11" ||
                                        key === "v12" ||
                                        key === "v13" ||
                                        key === "v14" ||
                                        key === "v15" ||
                                        key === "v16" ||
                                        key === "claim" ||
                                        key === "mediaVol" ||
                                        key === "dilutedVol"
                                      )
                                        return null;

                                      let displayKey = key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (c) => c.toUpperCase())
                                        .trim();

                                      const unit = findUnitForKey(
                                        calcData,
                                        key,
                                      );
                                      let displayValue = String(value);
                                      if (unit) {
                                        displayValue = `${value} ${unit}`;
                                      }

                                      return (
                                        <tr
                                          key={key}
                                          className="border-b border-black last:border-b-0"
                                        >
                                          <td className="w-2/5 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                                            {displayKey}
                                          </td>
                                          <td className="px-3 py-2">
                                            {displayValue}
                                          </td>
                                        </tr>
                                      );
                                    },
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Mathematical Derivation Section */}
                            <div className="mt-3">
                              {renderCalculationDerivation(
                                calcData,
                                calc.calculationType,
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Diluent Preparation */}
                  {param.diluentPreparation && (
                    <div className="section-container mb-6">
                      <h4 className="text-md uppercase font-bold mb-2">
                        Diluent Preparation
                      </h4>
                      <div className="text-sm">
                        {param.diluentPreparation}
                      </div>
                    </div>
                  )}

                  {/* System Suitability */}
                  {param.preparations &&
                    safeJSONParse(param.preparations, []).filter(
                      (p: any) => p.preparationCategory === "system_suitability",
                    ).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          System Suitabilities
                        </h4>
                        {safeJSONParse(param.preparations, [])
                          .filter(
                            (p: any) => p.preparationCategory === "system_suitability",
                          )
                          .map((suitability: any, idx: number) => {
                            const steps = safeJSONParse(suitability.steps, []);
                            
                            if (!steps || steps.length === 0) return null;

                            return (
                              <div key={idx} className="section-container mb-3">
                                <div className="mb-1">
                                  <p className="font-bold text-sm">
                                    {suitability.label}
                                  </p>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse border border-black text-sm">
                                    <thead>
                                      <tr className="bg-purple-50">
                                        <th className="border border-black px-4 py-2 text-left font-semibold">
                                          System Suitability
                                        </th>
                                        <th className="border border-black px-4 py-2 text-center font-semibold w-48">
                                          Value
                                        </th>
                                        <th className="border border-black px-4 py-2 text-center font-semibold w-64">
                                          Limit
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {steps.map((step: any, stepIdx: number) => {
                                        // Determine limit prefix based on parameter name
                                        let limitPrefix = "(Limit: ";
                                        if (step.name === "RSD Area") limitPrefix = "(Limit: NMT: ";
                                        else if (step.name === "RSD Retention time") limitPrefix = "(Limit: NMT: ";
                                        else if (step.name === "Tailing factor") limitPrefix = "(Limit: NMT: ";
                                        else if (step.name === "Resolution") limitPrefix = "(Limit: NLT: ";
                                        else if (step.name === "Theorital Plate count") limitPrefix = "(Limit: NLT: ";

                                        return (
                                          <tr key={stepIdx} className="hover:bg-purple-50/30">
                                            <td className="border border-black px-4 py-2 font-medium">
                                              {step.name}
                                            </td>
                                            <td className="border border-black px-4 py-2 text-center">
                                              {step.value1 || "___"}
                                            </td>
                                            <td className="border border-black px-4 py-2 text-center">
                                              {step.value2 ? `${limitPrefix}${step.value2})` : "___"}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
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
                      <div className="border border-black px-3 py-2 bg-gray-100 text-sm">
                        {param.otherInfo}
                      </div>
                    </div>
                  )}
                </div>

                {renderSignatureSection()}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PrintReport;