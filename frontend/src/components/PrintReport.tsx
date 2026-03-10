import React, { useEffect, useRef, useState } from "react";
import { Printer, X, ArrowLeft } from "lucide-react";
import type { SampleData } from "../preparation_models/SampleData";
import type { WorksheetDetail } from "../models/WorksheetDetail";
import type { Analyst } from "../models/Analyst";
import type { Instrument } from "../preparation_models/Instrument";
import type { Chemical } from "../preparation_models/Chemical";
import type { Standard } from "../preparation_models/Standard";
import type { ParameterDetail } from "../models/ParameterDetail";

// ── PDF page-by-page renderer using PDF.js ───────────────────────────────────
// Loads PDF.js from CDN, renders every page as a canvas, so the pages appear
// inline in the report exactly like a merged PDF.
const PdfPageRenderer: React.FC<{ base64: string; fileName: string }> = ({ base64, fileName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      try {
        // Load PDF.js if not already present
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load PDF.js"));
            document.head.appendChild(script);
          });
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }

        const pdfjsLib = (window as any).pdfjsLib;

        // Decode base64 → Uint8Array
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        if (cancelled) return;

        setPageCount(pdf.numPages);

        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          // Use a scale that fills A4 width (595pt × 1.5 ≈ 892px, suitable for print)
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.display = "block";
          canvas.style.pageBreakBefore = pageNum === 1 ? "always" : "auto";
          canvas.style.pageBreakAfter = "auto";
          canvas.style.pageBreakInside = "avoid";

          const ctx = canvas.getContext("2d")!;
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (cancelled) return;

          if (containerRef.current) {
            containerRef.current.appendChild(canvas);
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to render PDF");
      }
    };

    renderPdf();
    return () => { cancelled = true; };
  }, [base64]);

  if (error) {
    return (
      <div className="p-3 text-xs text-red-600 text-center border border-red-300 bg-red-50">
        Could not render {fileName}: {error}
      </div>
    );
  }

  return (
    <div>
      {pageCount === 0 && (
        <div className="p-4 text-xs text-gray-500 text-center">
          Loading {fileName}…
        </div>
      )}
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
};

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
  instruments,
  chemicals,
  standards,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  console.log('sample', sampleData);

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



  // Converts a snake_case calc/prep type to a readable label,
  // with special casing for ferrous fumarate variants.
  const formatCalcType = (type: string | null | undefined): string => {
    if (!type) return "";
    const t = type.toLowerCase();
    if (t === "roi") return "ROI";
    if (t === "lod") return "LOD";
    if (t === "assay_ferrous_fumarate") return "Assay of Ferrous Fumarate";
    if (t === "dissolution_ferrous_fumarate") return "Dissolution of Ferrous Fumarate";
    return type
      .split("_")
      .filter(Boolean)
      .map((w: string) => w[0].toUpperCase() + w.slice(1))
      .join(" ")
      .replace(/\bOf\b/g, "of");
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
            if (preparationType !== "dissolution" && preparationType !== "dissolution_profile") {
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
          )} Syringe filter.`;
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

        case "Weighing/Measuring":
          stepText = `${["ml", "L", "µL"].includes(step.unit1!) ? "Measure accurately" : "Weigh accurately"} ${boldValue(
            step.value1,
            step.unit1,
          )} of ${step.solventChemical || `_____________`}${
            step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""
          }.`;
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
                    Date of Receipt: {sampleData.recieptDate || ""}
                  </td>
                </tr>

                <tr>
                  <td className="border border-black px-3 py-2" colSpan={2}>
                    Sample Name: {worksheetInfo.sample.sampleName}
                  </td>
                  <td className="border border-black px-3 py-2" colSpan={2}>
                    Due Date: {sampleData.tatDate || ""}
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
                  sample to be entered)
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
                  Test(s) required (all tests and condition to be entered)
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

  const renderSignatureSection = (param: ParameterDetail) => {
    const formatDt = (raw: string | null | undefined): string => {
      if (!raw) return "N/A";
      const s = String(raw).trim();
      let d = new Date(s);
      if (isNaN(d.getTime())) {
        const parts = s.split(" ");
        const segs = parts[0].split("-");
        if (segs.length === 3 && segs[0].length <= 2) {
          const iso = `${segs[2]}-${segs[1]}-${segs[0]}`;
          d = new Date(parts[1] ? `${iso}T${parts[1]}` : `${iso}T00:00:00`);
        }
      }
      if (isNaN(d.getTime())) return s || "N/A";
      return d.toLocaleString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: false,
      });
    };

    return (
      <div className="mb-6">
        <table className="w-full border border-black text-sm">
          <tbody>
            {/* Row 1 — Analyst */}
            <tr className="border-b border-black">
              <td className="px-3 py-1 border-r border-black w-1/4">Analyzed By</td>
              <td className="px-3 py-1 font-bold border-r border-black w-1/4">
                {(param as any).analyzedByName || "---"}
              </td>
              <td className="px-3 py-1 border-r border-black w-1/4">Analysis Completed On</td>
              <td className="px-3 py-1 font-bold w-1/4">
                {formatDt((param as any).analysisCompletionDate)}
              </td>
            </tr>

            {/* Row 2 — Reviewer */}
            <tr className="border-b border-black">
              <td className="px-3 py-1 border-r border-black">Approved By (Reviewer)</td>
              <td className="px-3 py-1 font-bold border-r border-black">
                {(param as any).approvedByReviewerName || "---"}
              </td>
              <td className="px-3 py-1 border-r border-black">Reviewer Approved On</td>
              <td className="px-3 py-1 font-bold">
                {formatDt((param as any).approvedAtReviewer)}
              </td>
            </tr>

            {/* Row 3 — QA */}
            <tr>
              <td className="px-3 py-0.5 border-r border-black">Approved By (QA)</td>
              <td className="px-3 py-0.5 font-bold border-r border-black">
                {(param as any).approvedByQAName || "---"}
              </td>
              <td className="px-3 py-0.5 border-r border-black">QA Approved On</td>
              <td className="px-3 py-0.5 font-bold">
                {formatDt((param as any).approvedAtQA)}
              </td>
            </tr>
          </tbody>
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
          average: ((nr1 + nr2 + nr3 + nr4 + nr5 + nr6) / 6)
            .toFixedNoRound(4)
            .toFixed(3),
          minimum: Math.min(nr1, nr2, nr3, nr4, nr5, nr6)
            .toFixedNoRound(4)
            .toFixed(3),
          maximum: Math.max(nr1, nr2, nr3, nr4, nr5, nr6)
            .toFixedNoRound(4)
            .toFixed(3),
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
    const allResults = [
      calcData.calculationResultTablet1,
      calcData.calculationResultTablet2,
      calcData.calculationResultTablet3,
      calcData.calculationResultTablet4,
      calcData.calculationResultTablet5,
      calcData.calculationResultTablet6,
      calcData.calculationResultTablet7,
      calcData.calculationResultTablet8,
      calcData.calculationResultTablet9,
      calcData.calculationResultTablet10,
    ];

    const allMgResults = [
      calcData.mgPerTabletResultTablet1,
      calcData.mgPerTabletResultTablet2,
      calcData.mgPerTabletResultTablet3,
      calcData.mgPerTabletResultTablet4,
      calcData.mgPerTabletResultTablet5,
      calcData.mgPerTabletResultTablet6,
      calcData.mgPerTabletResultTablet7,
      calcData.mgPerTabletResultTablet8,
      calcData.mgPerTabletResultTablet9,
      calcData.mgPerTabletResultTablet10,
    ];

    const allAreas = [
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
    ];

    const validEntries: { idx: number; result: number; mgResult: number | null; area: string }[] = [];

    allResults.forEach((r, idx) => {
      if (r !== null && r !== undefined && String(r).trim() !== "") {
        const n = parseFloat(String(r));
        if (!isNaN(n) && isFinite(n)) {
          const mg = allMgResults[idx];
          const mgNum = mg !== null && mg !== undefined && String(mg).trim() !== ""
            ? parseFloat(String(mg))
            : null;
          validEntries.push({
            idx,
            result: n,
            mgResult: mgNum !== null && !isNaN(mgNum as number) ? mgNum : null,
            area: allAreas[idx] || "___",
          });
        }
      }
    });

    if (validEntries.length === 0) return null;

    const nums = validEntries.map((e) => e.result);
    const sum = nums.reduce((a, b) => a + b, 0);

    return {
      average: (sum / nums.length).toFixedNoRound(4).toFixed(3),
      minimum: Math.min(...nums).toFixedNoRound(4).toFixed(3),
      maximum: Math.max(...nums).toFixedNoRound(4).toFixed(3),
      unit: calcData.calculationResultUnit || "% of LC",
      entries: validEntries,
    };
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
    result?: string | null,
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
            <div className="text-xs font-bold"> {result !== null && (`= ${result}`)} {resultUnit}</div>
          )}
        </div>
      </div>
    );
  };

  // Generate formula derivation for each calculation type
  const renderCalculationDerivation = (calcData: any, calcType: string) => {
    const type = calcType.toLowerCase();

    if (type.includes("assay") && !type.includes("ferrous_fumarate")) {
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
      ]
        .filter((v) => v !== "___")
        .join(" × ");

      const denominatorValues = [
        areaStd,
        ...stdVolsDenomValues,
        sw2,
        ...smpVolsDenomValues,
        mwSalt,
        "100",
      ]
        .filter((v) => v !== "___")
        .join(" × ");

      // ── Dry / Anhydrous basis (Raw material assay only) ──────────────────
      const assayLodType  = calcData.lodWaterType  || "";
      const assayLodValue = calcData.lodWaterValue || "";
      const assayLodBasis = calcData.lodWaterBasisResult || null;
      // Rule: lodWaterType === "water" → Anhydrous Basis; "lod" → Dry Basis
      const assayBasisLabel = assayLodType === "water" ? "Anhydrous Basis" : assayLodType === "lod" ? "Dry Basis" : null;

      return (
        <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
          <p className="font-bold text-sm mb-2">Formula :</p>
          {renderMathFormula(
            numeratorSymbolic,
            denominatorSymbolic,
            calcData.calculationResultUnit,
          )}

          {/* Dry/Anhydrous formula — shown only when lod/water adjustment is present */}
          {assayBasisLabel && (
            <>
              <p className="text-xs font-semibold text-gray-700 mb-1 mt-3">
                Result ({assayBasisLabel})
              </p>
              {renderMathFormula(
                "Result (as such Basis) × 100",
                `100 − ${assayLodType === "water" ? "Water" : "LOD"} (%)`,
                null,
                `% (${assayBasisLabel})`,
              )}
            </>
          )}

          <p className="font-bold text-sm mb-2 mt-4">Derivation :</p>
          {renderMathFormula(numeratorValues, denominatorValues, calcData.calculationResult, calcData.calculationResultUnit)}

          {/* Dry/Anhydrous derivation */}
          {assayBasisLabel && assayLodBasis && (
            <>
              <p className="text-xs font-semibold text-gray-700 mb-1 mt-3">
                Result ({assayBasisLabel})
              </p>
              {renderMathFormula(
                `${calcData.calculationResult || "Result"} × 100`,
                assayLodValue ? `100 − ${assayLodValue}` : `100 − ${assayLodType === "water" ? "Water" : "LOD"}(%)`,
                assayLodBasis,
                `% (${assayBasisLabel})`,
              )}
            </>
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
      ]
        .filter((v) => v !== "___")
        .join(" × ");

      const denominatorValues = [areaStd, ...denVolsValues, sw2, "100"]
        .filter((v) => v !== "___")
        .join(" × ");

      return (
        <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
          <p className="font-bold text-sm mb-2">Formula :</p>
          {renderMathFormula(numeratorSymbolic, denominatorSymbolic, "ppm")}

          <p className="font-bold text-sm mb-2 mt-4">Derivation :</p>
          {renderMathFormula(numeratorValues, denominatorValues)}

          {calcData.calculationResult && (
            <p className="text-center font-bold text-sm mt-3">
              Result = {calcData.calculationResult}{" "}
              {calcData.calculationResultUnit}
            </p>
          )}
        </div>
      );
    } else if (type === "dissolution_profile") {
      // ── shared values ────────────────────────────────────────────────────
      const dpAreaStd = calcData.areaOfStandard || "___";
      const dpSw1     = calcData.sw1            || "___";
      const dpMwBase  = calcData.mWBase         || "___";
      const dpMwSalt  = calcData.mWSalt         || "___";
      const dpPurity  = calcData.purity         || "___";
      const dpClaim   = calcData.claim          || "___";
      const dpNTP     = Number(calcData.numberOfTimePoints) || 0;
      const dpVolWith = calcData.volumeWithdraw  || "___";
      const dpVolRepl = calcData.volumeReplaced  || "___";
      const dpStdLabel = calcData.selectedStandardPreparationLabel || "";
      const dpSmpLabel = calcData.selectedSamplePreparationLabel   || "";

      // ── dilution volumes ─────────────────────────────────────────────────
      const dpV1  = calcData.v1  || "___"; const dpV2  = calcData.v2  || "___";
      const dpV3  = calcData.v3  || "___"; const dpV4  = calcData.v4  || "___";
      const dpV5  = calcData.v5  || "___"; const dpV6  = calcData.v6  || "___";
      const dpV7  = calcData.v7  || "___";
      const dpV9  = calcData.v9  || "___"; const dpV10 = calcData.v10 || "___";
      const dpV11 = calcData.v11 || "___"; const dpV12 = calcData.v12 || "___";
      const dpV13 = calcData.v13 || "___"; const dpV14 = calcData.v14 || "___";

      // ── build formula symbolic & value arrays ────────────────────────────
      const dpStdNumSym: string[] = []; const dpStdDenSym: string[] = [];
      const dpStdNumVal: string[] = []; const dpStdDenVal: string[] = [];
      const dpSmpNumSym: string[] = []; const dpSmpDenSym: string[] = [];
      const dpSmpNumVal: string[] = []; const dpSmpDenVal: string[] = [];

      if (dpV1  !== "___" && dpV1  !== "0") { dpStdDenSym.push("V1");  dpStdDenVal.push(dpV1);  }
      if (dpV2  !== "___" && dpV2  !== "0") { dpStdNumSym.push("V2");  dpStdNumVal.push(dpV2);  }
      if (dpV3  !== "___" && dpV3  !== "0") { dpStdDenSym.push("V3");  dpStdDenVal.push(dpV3);  }
      if (dpV4  !== "___" && dpV4  !== "0") { dpStdNumSym.push("V4");  dpStdNumVal.push(dpV4);  }
      if (dpV5  !== "___" && dpV5  !== "0") { dpStdDenSym.push("V5");  dpStdDenVal.push(dpV5);  }
      if (dpV6  !== "___" && dpV6  !== "0") { dpStdNumSym.push("V6");  dpStdNumVal.push(dpV6);  }
      if (dpV7  !== "___" && dpV7  !== "0") { dpStdDenSym.push("V7");  dpStdDenVal.push(dpV7);  }
      if (dpV9  !== "___" && dpV9  !== "0") { dpSmpDenSym.push("V9");  dpSmpDenVal.push(dpV9);  }
      if (dpV10 !== "___" && dpV10 !== "0") { dpSmpNumSym.push("V10"); dpSmpNumVal.push(dpV10); }
      if (dpV11 !== "___" && dpV11 !== "0") { dpSmpDenSym.push("V11"); dpSmpDenVal.push(dpV11); }
      if (dpV12 !== "___" && dpV12 !== "0") { dpSmpNumSym.push("V12"); dpSmpNumVal.push(dpV12); }
      if (dpV13 !== "___" && dpV13 !== "0") { dpSmpDenSym.push("V13"); dpSmpDenVal.push(dpV13); }
      if (dpV14 !== "___" && dpV14 !== "0") { dpSmpNumSym.push("V14"); dpSmpNumVal.push(dpV14); }

      const dpSymNum = [
        "Area/ABS of Sample", "× SW1",
        ...dpStdNumSym.map((v: string) => `× ${v}`),
        "× V8(Tn)",
        ...dpSmpNumSym.map((v: string) => `× ${v}`),
        "× MW Base", "× Purity %", "× 100",
      ].join(" ");
      const dpSymDen = [
        "Area/ABS of Standard",
        ...dpStdDenSym.map((v: string) => `× ${v}`),
        "× Claim",
        ...dpSmpDenSym.map((v: string) => `× ${v}`),
        "× MW Salt", "× 100",
      ].join(" ");

      // ── helper: parse stored JSON array ──────────────────────────────────
      const dpParseArr = (raw: any): number[] => {
        if (!raw) return [];
        try {
          const p = typeof raw === "string" ? JSON.parse(raw) : raw;
          return Array.isArray(p) ? p.map(Number) : [];
        } catch { return []; }
      };

      // ── build per-TP data ────────────────────────────────────────────────
      const dpTpData: Array<{
        tpNum: number; label: string; v8: number;
        results: number[]; areas: string[];
        cfs: number[]; racs: number[];
        min: number; avg: number; max: number;
      }> = [];
      for (let tp = 1; tp <= dpNTP; tp++) {
        const results = dpParseArr(calcData[`sampleResultsT${tp}`]);
        if (results.length === 0) break;
        dpTpData.push({
          tpNum: tp,
          label: calcData[`timePointDetail${tp}`] || `T${tp}`,
          v8:    Number(calcData[`v8TimePoint${tp}`]) || 0,
          results,
          areas: [1,2,3,4,5,6].map((s: number) => calcData[`areaOfSampleT${tp}S${s}`] || "___"),
          cfs:   dpParseArr(calcData[`correctionFactorsT${tp}`]),
          racs:  dpParseArr(calcData[`resultsAfterCorrectionT${tp}`]),
          min:   Number(calcData[`minT${tp}`]) || 0,
          avg:   Number(calcData[`avgT${tp}`]) || 0,
          max:   Number(calcData[`maxT${tp}`]) || 0,
        });
      }

      const dpFmt = (n: number) => isNaN(n) ? "—" : n.toFixedNoRound(4).toFixed(3);

      // ── reusable table-row renderer (same style as dissolution) ──────────
      const dpRow = (label: string, value: string) => (
        <tr className="border-b border-black last:border-b-0">
          <td className="w-2/5 px-3 py-2 font-bold bg-gray-100 border-r border-black">{label}</td>
          <td className="px-3 py-2">{value}</td>
        </tr>
      );

      return (
        <div className="mb-3">

          {/* ══ PER-TIME-POINT: details table + formula block ══ */}
          {dpTpData.map((tp) => {
            const hasCorrection = tp.tpNum > 1;
            const prevTp        = dpTpData[tp.tpNum - 2];
            const dpV8str       = dpFmt(tp.v8);

            // V8 display value — show derivation inline for T2+
            const v8Display = `${dpV8str} ml `;

            return (
              <div key={tp.tpNum}>

                {/* ── 1. CALCULATION DETAILS TABLE — same style as dissolution ── */}
                <div className="mb-3">
                  <p className="font-bold text-sm mb-1">
                    {(["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"])[tp.tpNum - 1] || `${tp.tpNum}th`} Time Point {tp.label && tp.label !== `T${tp.tpNum}` ? ` (${tp.label} hr)` : ""}
                  </p>
                  <table className="w-full text-sm">
                    <tbody>
                      {dpStdLabel && dpRow("Selected Standard Preparation", dpStdLabel)}
                      {dpSmpLabel && dpRow("Selected Sample Preparation",   dpSmpLabel)}
                      {tp.areas.map((area: string, i: number) =>
                        area && area !== "___"
                          ? dpRow(`Area of Sample ${i + 1}`, area)
                          : null
                      )}
                      {dpAreaStd !== "___" && dpRow("Area of Standard", dpAreaStd)}
                      {dpMwBase  !== "___" && dpRow("M W Base",         dpMwBase)}
                      {dpMwSalt  !== "___" && dpRow("M W Salt",         dpMwSalt)}
                      {dpPurity  !== "___" && dpRow("Purity",           `${dpPurity} %`)}
                      {dpVolWith !== "___" && dpRow("Volume Withdrawn", `${dpVolWith} ml`)}
                      {dpVolRepl !== "___" && dpRow("Volume Replaced",  `${dpVolRepl} ml`)}
                      {dpRow(hasCorrection ? "Updated Media Volume" : "Media Volume", v8Display)}
                      {hasCorrection && tp.cfs.map((cf: number, i: number) =>
                        cf != null && !isNaN(cf)
                          ? dpRow(`CF(T${tp.tpNum - 1}) Tablet ${i + 1}`, dpFmt(cf))
                          : null
                      )}
                      {/* Result per tablet */}
                      {tp.results.map((res: number, i: number) =>
                        dpRow(
                          hasCorrection
                            ? `Calculation Result Tablet ${i + 1}`
                            : `Calculation Result Tablet ${i + 1}`,
                          `${dpFmt(res)} % of LC`
                        )
                      )}
                      {/* Corrected Result per tablet (T2+) */}
                      {hasCorrection && tp.racs.map((rac: number, i: number) =>
                        rac != null && !isNaN(rac)
                          ? dpRow(`Corrected Result Tablet ${i + 1}`, `${dpFmt(rac)} % of LC`)
                          : null
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ── 2. FORMULA (once per TP) ── */}
                <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
                  <p className="font-bold text-sm mb-2">Formula :</p>
                  {renderMathFormula(dpSymNum, dpSymDen, "% of LC")}
                  {hasCorrection && (
                    <div className="mt-2 pt-2 border-t border-gray-300 text-xs space-y-0.5">
                      <p><strong>CF =</strong> &nbsp; [Prev. Result × Vol. Withdrawn] / V8(Tn)</p>
                      <p><strong>Corrected Result =</strong> &nbsp;Result(Tn) + CF(T1) + CF(T2) + ... + CF(Tn-1)</p>
                    </div>
                  )}
                </div>

                {/* ── 3. PER-TABLET DERIVATIONS — each in own keep-together block ── */}
                {tp.results.map((res: number, idx: number) => {
                  const sNum  = idx + 1;
                  const area  = tp.areas[idx] || "___";
                  const cf    = tp.cfs[idx];
                  const rac   = tp.racs[idx];
                  const prevRes = prevTp
                    ? (prevTp.results[idx] != null && !isNaN(prevTp.results[idx])
                        ? prevTp.results[idx]
                        : 0)
                    : 0;

                  const numVals = [
                    area, dpSw1,
                    ...dpStdNumVal, dpV8str, ...dpSmpNumVal,
                    dpMwBase, dpPurity, "100",
                  ].filter((v: string) => v !== "___").join(" × ");

                  const denVals = [
                    dpAreaStd, ...dpStdDenVal,
                    dpClaim,   ...dpSmpDenVal,
                    dpMwSalt, "100",
                  ].filter((v: string) => v !== "___").join(" × ");

                  // Build CF expression string for corrected result line
                  const allCFs: number[] = [];
                  for (let tIdx = 1; tIdx < dpTpData.length; tIdx++) {
                    const pastTp = dpTpData[tIdx];
                    if (pastTp.tpNum > tp.tpNum) break;
                    const pastCf = pastTp.cfs[idx];
                    if (pastCf != null && !isNaN(pastCf)) allCFs.push(pastCf);
                  }
                  const cfExpression = allCFs.length > 0
                    ? allCFs.map(c => dpFmt(c)).join(" + ")
                    : (cf != null && !isNaN(cf) ? dpFmt(cf) : "");

                  return (
                    <div
                      key={sNum}
                      className="bg-gray-100 border border-black p-3 mb-3 keep-together"
                    >
                      {/* Single heading for the whole tablet block */}
                      <p className="font-bold text-sm mb-3">
                        Derivation (Tablet {sNum}) :
                      </p>

                      {/* CF line — single inline row (T2+) */}
                      {hasCorrection && cf != null && !isNaN(cf) && (
                        <p className="text-center text-xs mb-2">
                          <strong>CF</strong> = ({dpFmt(prevRes)} × {dpVolWith}) / {dpV8str} = <strong>{dpFmt(cf)}</strong>
                        </p>
                      )}

                      {/* Result line — single inline row */}
                      <p className="text-center text-xs mb-2">
                        <strong>Result</strong> = ({numVals}) / ({denVals}) = <strong>{dpFmt(res)} % of LC</strong>
                      </p>

                      {/* Corrected Result line (T2+) */}
                      {hasCorrection && cf != null && !isNaN(cf) && rac != null && !isNaN(rac) && (
                        <p className="text-center font-bold text-xs mt-1">
                          Corrected Result = {dpFmt(res)} + {cfExpression} = {dpFmt(rac)} % of LC
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* ── 4. SUMMARY — Min / Avg / Max ── */}
                <div className="mt-1 keep-together mb-4">
                  <table className="w-full border border-black">
                    <tbody>
                      <tr className="bg-gray-100">
                        <td colSpan={3} className="p-3 border-b border-black">
                          <p className="font-bold text-sm">
                            Calculation Summary
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center p-3 border-r border-black">
                          <p className="font-semibold text-xs">Minimum</p>
                          <p className="text-lg font-bold">{dpFmt(tp.min)} % of LC</p>
                        </td>
                        <td className="text-center p-3 border-r border-black">
                          <p className="font-semibold text-xs">Average</p>
                          <p className="text-lg font-bold">{dpFmt(tp.avg)} % of LC</p>
                        </td>
                        <td className="text-center p-3">
                          <p className="font-semibold text-xs">Maximum</p>
                          <p className="text-lg font-bold">{dpFmt(tp.max)} % of LC</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            );
          })}

        </div>
      );

    } else if (type.includes("dissolution") && !type.includes("ferrous_fumarate")) {
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
            <p className="font-bold text-sm mb-2">Formula :</p>
            {renderMathFormula(
              numeratorSymbolic,
              denominatorSymbolic,
              "% of LC",
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
                ]
                  .filter((v) => v !== "___")
                  .join(" × ");

                const denominatorValues = [
                  areaStd,
                  ...stdVolsDenomValues,
                  claim,
                  ...smpVolsDenomValues,
                  mwSalt,
                  "100",
                ]
                  .filter((v) => v !== "___")
                  .join(" × ");

                return (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-black p-3 mb-3 keep-together"
                  >
                    <p className="font-bold text-sm  mb-2">
                      Derivation (Tablet {idx + 1}) :
                    </p>
                    {renderMathFormula(numeratorValues, denominatorValues)}
                    <p className="text-center font-bold text-xs mt-2">
                      Result = {result.toFixedNoRound(4).toFixed(3)} % of LC
                    </p>
                  </div>
                );
              })}

              <div className="mt-4 keep-together">
                <table className="w-full">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td colSpan={3} className="p-3 border-b border-black">
                        <p className="font-bold text-sm">Calculation Summary</p>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="text-center p-3 border-r border-black">
                        <p className="font-semibold text-xs">Minimum</p>
                        <p className="text-lg font-bold">
                          {stats.minimum} {stats.unit}
                        </p>
                      </td>
                      <td className="text-center p-3 border-r border-black">
                        <p className="font-semibold text-xs">Average</p>
                        <p className="text-lg font-bold">
                          {stats.average} {stats.unit}
                        </p>
                      </td>
                      <td className="text-center p-3">
                        <p className="font-semibold text-xs">Maximum</p>
                        <p className="text-lg font-bold">
                          {stats.maximum} {stats.unit}
                        </p>
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

      const numeratorValues =
        w2 !== "___" && w3 !== "___" ? `(${w2} - ${w3})` : "";
      const denominatorValues =
        w2 !== "___" && w1 !== "___" ? `(${w2} - ${w1})` : "";

      return (
        <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
          <p className="font-bold text-sm mb-2">Formula :</p>
          <div className="rounded p-3 mb-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-mono">
                {numeratorSymbolic} / {denominatorSymbolic} × 100 %
              </span>
            </div>
          </div>

          <p className="font-bold text-sm mb-2 mt-4">Derivation :</p>
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

      // Build volume symbolic/value arrays
      const stdVolsNumSymbolic: string[] = [];
      const stdVolsDenomSymbolic: string[] = [];
      const stdVolsNumValues: string[] = [];
      const stdVolsDenomValues: string[] = [];

      if (v1 !== "___" && v1 !== "0") { stdVolsDenomSymbolic.push("V1"); stdVolsDenomValues.push(v1); }
      if (v2 !== "___" && v2 !== "0") { stdVolsNumSymbolic.push("V2");   stdVolsNumValues.push(v2); }
      if (v3 !== "___" && v3 !== "0") { stdVolsDenomSymbolic.push("V3"); stdVolsDenomValues.push(v3); }
      if (v4 !== "___" && v4 !== "0") { stdVolsNumSymbolic.push("V4");   stdVolsNumValues.push(v4); }
      if (v5 !== "___" && v5 !== "0") { stdVolsDenomSymbolic.push("V5"); stdVolsDenomValues.push(v5); }
      if (v6 !== "___" && v6 !== "0") { stdVolsNumSymbolic.push("V6");   stdVolsNumValues.push(v6); }
      if (v7 !== "___" && v7 !== "0") { stdVolsDenomSymbolic.push("V7"); stdVolsDenomValues.push(v7); }

      const smpVolsNumSymbolic: string[] = [];
      const smpVolsDenomSymbolic: string[] = [];
      const smpVolsNumValues: string[] = [];
      const smpVolsDenomValues: string[] = [];

      if (v8  !== "___" && v8  !== "0") { smpVolsNumSymbolic.push("V8");    smpVolsNumValues.push(v8); }
      if (v9  !== "___" && v9  !== "0") { smpVolsDenomSymbolic.push("V9");  smpVolsDenomValues.push(v9); }
      if (v10 !== "___" && v10 !== "0") { smpVolsNumSymbolic.push("V10");   smpVolsNumValues.push(v10); }
      if (v11 !== "___" && v11 !== "0") { smpVolsDenomSymbolic.push("V11"); smpVolsDenomValues.push(v11); }
      if (v12 !== "___" && v12 !== "0") { smpVolsNumSymbolic.push("V12");   smpVolsNumValues.push(v12); }
      if (v13 !== "___" && v13 !== "0") { smpVolsDenomSymbolic.push("V13"); smpVolsDenomValues.push(v13); }
      if (v14 !== "___" && v14 !== "0") { smpVolsNumSymbolic.push("V14");   smpVolsNumValues.push(v14); }

      // Step 1 symbolic (mg/Tablet — no Claim in denominator)
      const step1NumSymbolic = [
        "Area/ABS of Sample", "× SW1",
        ...stdVolsNumSymbolic.map((v: string) => `× ${v}`),
        ...smpVolsNumSymbolic.map((v: string) => `× ${v}`),
        "× MW Base", "× Purity %",
      ].join(" ");

      const step1DenSymbolic = [
        "Area/ABS of Standard",
        ...stdVolsDenomSymbolic.map((v: string) => `× ${v}`),
        ...smpVolsDenomSymbolic.map((v: string) => `× ${v}`),
        "× MW Salt", "× 100",
      ].join(" ");

      const stats = calculateUCStats(calcData);

      return (
        <div className="mb-3">

          {/* ── Single "Formula" box containing both Step 1 and Step 2 ── */}
          <div className="bg-gray-100 border border-black p-3 mb-1 keep-together">
            <p className="font-bold text-sm mb-3">Formula :</p>

            {renderMathFormula(step1NumSymbolic, step1DenSymbolic, null, "mg/Tablet")}
            {renderMathFormula("Result (mg/Tablet) × 100", "Claim (mg)", null, "% of LC")}
          </div>

          {/* ── Per-tablet derivations ── */}
          {stats && stats.entries && stats.entries.map((entry) => {
            const step1NumValues = [
              entry.area,
              sw1,
              ...stdVolsNumValues,
              ...smpVolsNumValues,
              mwBase,
              purity,
            ].filter((v) => v !== "___").join(" × ");

            const step1DenValues = [
              areaStd,
              ...stdVolsDenomValues,
              ...smpVolsDenomValues,
              mwSalt,
              "100",
            ].filter((v) => v !== "___").join(" × ");

            const mgDisplay = entry.mgResult !== null
              ? `${entry.mgResult}`
              : "Result (mg/Tablet)";

            const step2NumValues = entry.mgResult !== null
              ? `${entry.mgResult} × 100`
              : "Result (mg/Tablet) × 100";

            const mgResult = entry.mgResult !== null
              ? `${entry.mgResult} mg/Tablet`
              : null;
            const lcResult = `${entry.result.toFixedNoRound(3).toFixed(2)} % of LC`;

            return (
              <div
                key={entry.idx}
                className="bg-gray-100 border border-black p-3 mb-1 keep-together"
              >
                <p className="font-bold text-sm mb-3">
                  Derivation (Tablet {entry.idx + 1}) :
                </p>

                {/* Two-step derivation — each fraction paired with its result on the same line */}
                <div className="flex flex-col items-center gap-3">
                  {/* Step 1: fraction + mg/Tablet result on same line */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="formula-fraction text-center">
                      <div className="numerator px-4 py-1 border-b border-black text-xs">
                        {step1NumValues}
                      </div>
                      <div className="denominator px-4 py-1 text-xs">
                        {step1DenValues}
                      </div>
                    </div>
                    {mgResult && (
                      <div className="text-xs font-bold whitespace-nowrap">
                        = {mgResult}
                      </div>
                    )}
                  </div>

                  {/* Step 2: fraction + % of LC result on same line */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="formula-fraction text-center">
                      <div className="numerator px-4 py-1 border-b border-black text-xs">
                        {step2NumValues}
                      </div>
                      <div className="denominator px-4 py-1 text-xs">
                        {claim}
                      </div>
                    </div>
                    <div className="text-xs font-bold whitespace-nowrap">
                      = {lcResult}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── Summary ── */}
          {stats && (
            <div className="mt-4 keep-together">
              <table className="w-full">
                <tbody>
                  <tr className="bg-gray-100">
                    <td colSpan={3} className="p-3 border-b border-black">
                      <p className="font-bold text-sm">Calculation Summary</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center p-3 border-r border-black">
                      <p className="font-semibold text-xs">Minimum</p>
                      <p className="text-lg font-bold">{stats.minimum} {stats.unit}</p>
                    </td>
                    <td className="text-center p-3 border-r border-black">
                      <p className="font-semibold text-xs">Average</p>
                      <p className="text-lg font-bold">{stats.average} {stats.unit}</p>
                    </td>
                    <td className="text-center p-3">
                      <p className="font-semibold text-xs">Maximum</p>
                      <p className="text-lg font-bold">{stats.maximum} {stats.unit}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    } else if (type.includes("assay_ferrous_fumarate")) {
      // ── Ferrous Fumarate Assay (Titration) ───────────────────────────────────
      const br      = calcData.buretteReading      || "___";
      const am      = calcData.actualMolarity      || "___";
      const tm      = calcData.theoreticalMolarity || "___";
      const fac     = calcData.factor              || "___";
      const facU    = calcData.factorUnit          || "g";
      const sw      = calcData.sw                  || "___";
      const aw      = calcData.avgWeight           || "___";
      const awU     = calcData.avgWeightUnit       || "mg";
      const lc      = calcData.labelClaim          || "___";
      const lcU     = calcData.labelClaimUnit      || "mg";
      const lod     = calcData.lodWaterValue       || "___";
      const lodType = calcData.lodWaterType        || "water";
      const calcFor = calcData.calculationFor      || "";
      const isFinishedProduct = calcFor.toLowerCase().includes("finish");

      // Acceptance limit helpers removed — shown in detail table
      const renderAcceptanceLimit = (_resultVal: string | null) => null;

      // ════════════════════════════════════════════════════════════════════════
      // FINISHED PRODUCT path
      // ════════════════════════════════════════════════════════════════════════
      if (isFinishedProduct) {
        // Formula 1: Result (mg/Tablet)
        const f1NumSym = `Burette Reading × Actual Molarity × Factor(${facU}) × Average Weight (${awU})`;
        const f1DenSym = `Sample Weight (mg) × Theoretical Molarity`;
        const f1Unit   = "mg/Tablet";

        // Formula 2: Result (% of LC)
        const f2NumSym = "Result (mg/Tablet) × 100";
        const f2DenSym = `Label Claim (${lcU})`;
        const f2Unit   = "% of LC";

        // Derivation 1
        const d1Num = [br, am, fac, aw !== "___" ? `${aw} ${awU}` : "___"]
          .filter(v => v !== "___").join(" × ") || "___";
        const d1Den = [sw, tm].filter(v => v !== "___").join(" × ") || "___";

        // Derivation 2
        const d2Num = `${calcData.calculationResult || "Result (mg/Tablet)"} × 100`;
        const d2Den = lc !== "___" ? `${lc} ${lcU}` : "___";

        return (
          <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
            <p className="font-bold text-sm mb-2">Formula :</p>
            {renderMathFormula(f1NumSym, f1DenSym, null, f1Unit)}
            {renderMathFormula(f2NumSym, f2DenSym, null, f2Unit)}

            <p className="font-bold text-sm mb-2 mt-4">Derivation :</p>
            {renderMathFormula(d1Num, d1Den, calcData.calculationResult, calcData.calculationResultUnit)}
            {renderMathFormula(d2Num, d2Den, calcData.labelClaimPercent, "% of LC")}

            {renderAcceptanceLimit(calcData.calculationResult)}
          </div>
        );
      }

      // ════════════════════════════════════════════════════════════════════════
      // RAW PRODUCT path — two formulas + two results
      // ════════════════════════════════════════════════════════════════════════

      // Rule: lodWaterType === "water" → Anhydrous Basis; "lod" → Dry Basis
      const basisLabel = lodType === "water" ? "Anhydrous Basis" : "Dry Basis";

      // ── Formula 1: Result (as such Basis) ────────────────────────────────
      const f1RawNumSym = "Burette Reading × Actual Molarity × Factor(mg) × 100";
      const f1RawDenSym = "Sample Weight (mg) × Theoretical Molarity";
      const f1RawUnit   = "% (as such Basis)";

      // ── Formula 2: Result (Dry / Anhydrous Basis) ────────────────────────
      const f2RawNumSym = "Result (as such Basis) × 100";
      const f2RawDenSym = `100 − ${lodType === "lod" ? "LOD" : "Water"} (%)`;
      const f2RawUnit   = `% (${basisLabel})`;

      // ── Derivation 1 ─────────────────────────────────────────────────────
      const d1RawNum = [br, am, fac, "100"].filter(v => v !== "___").join(" × ") || "___";
      const d1RawDen = [sw, tm].filter(v => v !== "___").join(" × ") || "___";

      // ── Derivation 2 ─────────────────────────────────────────────────────
      const asIsResult = calcData.calculationResult || "Result (as such Basis)";
      const d2RawNum = `${asIsResult} × 100`;
      const d2RawDen = lod !== "___" ? `100 − ${lod}` : `100 − ${lodType === "lod" ? "LOD" : "Water"}(%)`;

      return (
        <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
          <p className="font-bold text-sm mb-1">
            Calculation Type: <span className="font-normal">Raw Product</span>
          </p>

          {/* ── Formulas ── */}
          <p className="font-bold text-sm mb-2 mt-3">Formula :</p>
          {renderMathFormula(f1RawNumSym, f1RawDenSym, null, f1RawUnit)}
          {renderMathFormula(f2RawNumSym, f2RawDenSym, null, f2RawUnit)}

          {/* ── Derivations ── */}
          <p className="font-bold text-sm mb-2 mt-4">Derivation :</p>
          {renderMathFormula(d1RawNum, d1RawDen, calcData.calculationResult, "% (as such Basis)")}
          {renderMathFormula(d2RawNum, d2RawDen, calcData.dryBasisResult, `% (${basisLabel})`)}

          {renderAcceptanceLimit(calcData.calculationResult)}
        </div>
      );

    } else if (type.includes("dissolution_ferrous_fumarate")) {
      // ── Ferrous Fumarate Dissolution (Titration) ─────────────────────────────
      const am   = calcData.actualMolarity        || "___";
      const fac  = calcData.factor                || "___";
      const facU = calcData.factorUnit            || "mg";
      const dv   = calcData.dissoMediaVolume      || "___";
      const dvU  = calcData.dissoMediaVolumeUnit  || "ml";
      const lc   = calcData.labelClaim            || "___";
      const lcU  = calcData.labelClaimUnit        || "mg";
      const st   = calcData.sampleTaken           || "___";
      const stU  = calcData.sampleTakenUnit       || "ml";
      const resultUnit = calcData.calculationResultUnit || "% of LC";

      const tabletResults: { num: number; br: string; result: string }[] = [];
      for (let i = 1; i <= 6; i++) {
        const br  = calcData[`buretteReading${i}`];
        const res = calcData[`calculationResultTablet${i}`];
        if (br || res) tabletResults.push({ num: i, br: br || "___", result: res || "___" });
      }

      // Single combined formula:
      // Numerator:   BR × Actual Molarity × Factor(facU) × Dissolution Media Volume(dvU)
      // Denominator: Label Claim(lcU) × Sample Taken(stU) × 100
      const symNum = `Burette Reading × Actual Molarity × Factor (${facU}) × Dissolution Media Volume (${dvU})`;
      const symDen = `Label Claim (${lcU}) × Sample Taken (${stU}) × 100`;

      return (
        <div className="mb-3">
          {/* ── Formula box ── */}
          <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
            <p className="font-bold text-sm mb-2">Formula :</p>
            {renderMathFormula(symNum, symDen, null, resultUnit)}
          </div>

          {/* ── Per-tablet derivation blocks ── */}
          {tabletResults.length > 0 && (
            <div>
              {tabletResults.map(({ num, br, result }) => {
                const valNum = [
                  br,
                  am,
                  fac !== "___" ? `${fac} ${facU}` : "___",
                  dv !== "___" ? `${dv} ${dvU}` : "___",
                ].filter(v => v !== "___").join(" × ") || "___";

                const valDen = [
                  lc !== "___" ? `${lc} ${lcU}` : "___",
                  st !== "___" ? `${st} ${stU}` : "___",
                  "100",
                ].filter(v => v !== "___").join(" × ") || "___";

                return (
                  <div key={num} className="bg-gray-100 border border-black p-3 mb-2 keep-together">
                    <p className="font-bold text-sm mb-2">Derivation (Tablet {num}) :</p>
                    {renderMathFormula(valNum, valDen, result !== "___" ? result : null, resultUnit)}
                  </div>
                );
              })}

              {/* ── Summary Stats ── */}
              {(() => {
                const vals = tabletResults.map(r => parseFloat(r.result)).filter(v => !isNaN(v));
                if (vals.length === 0) return null;
                const min = Math.min(...vals);
                const max = Math.max(...vals);
                const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

                return (
                  <div className="mt-2 keep-together">
                    <table className="w-full border border-black">
                      <tbody>
                        <tr className="bg-gray-100">
                          <td colSpan={3} className="p-3 border-b border-black">
                            <p className="font-bold text-sm">Calculation Summary</p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center p-3 border-r border-black">
                            <p className="font-semibold text-xs">Minimum</p>
                            <p className="text-lg font-bold">{min.toFixed(3)} {resultUnit}</p>
                          </td>
                          <td className="text-center p-3 border-r border-black">
                            <p className="font-semibold text-xs">Average</p>
                            <p className="text-lg font-bold">{avg.toFixed(3)} {resultUnit}</p>
                          </td>
                          <td className="text-center p-3">
                            <p className="font-semibold text-xs">Maximum</p>
                            <p className="text-lg font-bold">{max.toFixed(3)} {resultUnit}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      );

    } else if (type.includes("related_substance")) {
      // ── Related Substance — same layout as normal Assay ──────────────────────
      const areaSample = calcData.areaOfSample || "___";
      const areaStd    = calcData.areaOfStandard || "___";
      const mwBase     = calcData.mWBase         || "___";
      const mwSalt     = calcData.mWSalt         || "___";
      const purity     = calcData.purity         || "___";
      const sw1        = calcData.sw1 || calcData.sw || "___";
      const sw2        = calcData.sw2            || "___";
      const calcFor    = calcData.calculationFor || "";

      const v1  = calcData.v1  || "___"; const v2  = calcData.v2  || "___";
      const v3  = calcData.v3  || "___"; const v4  = calcData.v4  || "___";
      const v5  = calcData.v5  || "___"; const v6  = calcData.v6  || "___";
      const v7  = calcData.v7  || "___"; const v8  = calcData.v8  || "___";
      const v9  = calcData.v9  || "___"; const v10 = calcData.v10 || "___";
      const v11 = calcData.v11 || "___"; const v12 = calcData.v12 || "___";
      const v13 = calcData.v13 || "___"; const v14 = calcData.v14 || "___";

      // ── Build volume arrays (same V1-V14 convention as normal assay) ─────────
      const stdNumSym: string[] = []; const stdDenSym: string[] = [];
      const stdNumVal: string[] = []; const stdDenVal: string[] = [];

      if (v1  !== "___" && v1  !== "0") { stdDenSym.push("V1");  stdDenVal.push(v1);  }
      if (v2  !== "___" && v2  !== "0") { stdNumSym.push("V2");  stdNumVal.push(v2);  }
      if (v3  !== "___" && v3  !== "0") { stdDenSym.push("V3");  stdDenVal.push(v3);  }
      if (v4  !== "___" && v4  !== "0") { stdNumSym.push("V4");  stdNumVal.push(v4);  }
      if (v5  !== "___" && v5  !== "0") { stdDenSym.push("V5");  stdDenVal.push(v5);  }
      if (v6  !== "___" && v6  !== "0") { stdNumSym.push("V6");  stdNumVal.push(v6);  }
      if (v7  !== "___" && v7  !== "0") { stdDenSym.push("V7");  stdDenVal.push(v7);  }

      const smpNumSym: string[] = []; const smpDenSym: string[] = [];
      const smpNumVal: string[] = []; const smpDenVal: string[] = [];

      if (v8  !== "___" && v8  !== "0") { smpNumSym.push("V8");  smpNumVal.push(v8);  }
      if (v9  !== "___" && v9  !== "0") { smpDenSym.push("V9");  smpDenVal.push(v9);  }
      if (v10 !== "___" && v10 !== "0") { smpNumSym.push("V10"); smpNumVal.push(v10); }
      if (v11 !== "___" && v11 !== "0") { smpDenSym.push("V11"); smpDenVal.push(v11); }
      if (v12 !== "___" && v12 !== "0") { smpNumSym.push("V12"); smpNumVal.push(v12); }
      if (v13 !== "___" && v13 !== "0") { smpDenSym.push("V13"); smpDenVal.push(v13); }
      if (v14 !== "___" && v14 !== "0") { smpNumSym.push("V14"); smpNumVal.push(v14); }

      const hasExternal = areaStd !== "___";
      const resultUnit  = calcData.calculationResultUnit || "%";

      // ── Symbolic formula parts ────────────────────────────────────────────────
      // Extra formula terms depending on calculationFor
      const extraNumSym: string[] = [];
      const extraDenSym: string[] = [];
      const labelClaim = calcData.labelClaim || "___";
      const avgWeight  = calcData.avgWeight  || "___";
      const avgWeightU = calcData.avgWeightUnit || "mg";
      const doseVolume = calcData.doseVolume  || "___";
      const weightPerMl = calcData.weightPerMl || "___";
      const weightPerMlU = calcData.weightPerMlUnit || "mg";
      const rf         = calcData.responseFactor || "___";
      const rfUnit     = calcData.responseFactorUnit || "";

      if (calcFor === "Tablets" || calcFor === "Capsule" || calcFor === "Injection Vial") {
        extraNumSym.push(`× Avg Wt (${avgWeightU})`, "× 100");
        extraDenSym.push("× Label Claim");
      } else if (calcFor === "Oral Suspension") {
        extraNumSym.push(`× Wt/ml (${weightPerMlU})`, "× Dose Volume", "× 100");
        extraDenSym.push("× Label Claim");
      } else if (calcFor === "Oral Liquid") {
        extraNumSym.push("× Dose Volume", "× 100");
        extraDenSym.push("× Label Claim");
      } else {
        // Raw Material
        extraNumSym.push("× 100");
      }
      if (rf !== "___") extraNumSym.push(`× RF${rfUnit ? ` (${rfUnit})` : ""}`);

      const numeratorSymbolic = [
        "Area/ABS of Sample", "× SW1",
        ...stdNumSym.map(v => `× ${v}`),
        ...smpNumSym.map(v => `× ${v}`),
        "× MW Base", "× Purity %",
        ...extraNumSym,
      ].join(" ");

      const denominatorSymbolic = hasExternal ? [
        "Area/ABS of Standard",
        ...stdDenSym.map(v => `× ${v}`),
        "× SW2",
        ...smpDenSym.map(v => `× ${v}`),
        "× MW Salt", "× 100",
        ...extraDenSym,
      ].join(" ") : "Total Peak Area × 100";

      // ── Derivation value arrays ───────────────────────────────────────────────
      const buildNumVal = (areaVal: string) => [
        areaVal, sw1,
        ...stdNumVal, ...smpNumVal,
        mwBase, purity,
        ...(calcFor === "Tablets" || calcFor === "Capsule" || calcFor === "Injection Vial"
          ? [avgWeight !== "___" ? `${avgWeight} ${avgWeightU}` : "___", "100"]
          : calcFor === "Oral Suspension"
            ? [weightPerMl !== "___" ? `${weightPerMl} ${weightPerMlU}` : "___", doseVolume, "100"]
            : calcFor === "Oral Liquid"
              ? [doseVolume, "100"]
              : ["100"]),
        ...(rf !== "___" ? [rf] : []),
      ].filter(v => v !== "___").join(" × ");

      const derivationDen = hasExternal ? [
        areaStd,
        ...stdDenVal, sw2, ...smpDenVal,
        mwSalt, "100",
        ...(labelClaim !== "___" && extraDenSym.length > 0 ? [labelClaim] : []),
      ].filter(v => v !== "___").join(" × ") : "Total Peak Area × 100";

      const singleResult    = calcData.calculationResult;
      const totalArea       = calcData.totalPeakArea || calcData.totalArea || "___";

      // Impurity entries
      const impurityEntries: { name: string; area: string; result: string }[] = [];
      for (let i = 1; i <= 20; i++) {
        const area   = calcData[`impurityPeakArea${i}`] || calcData[`impurityArea${i}`];
        const name   = calcData[`impurityName${i}`]     || `Impurity ${i}`;
        const result = calcData[`impurityResult${i}`];
        if (area) impurityEntries.push({ name, area, result: result || "___" });
      }

      return (
        <div className="bg-gray-100 border border-black p-3 mb-3 keep-together">
          <p className="font-bold text-sm mb-2">Formula :</p>

          {hasExternal ? (
            renderMathFormula(numeratorSymbolic, denominatorSymbolic, null, resultUnit)
          ) : (
            <p className="text-xs text-center font-mono my-2">
              % Impurity = (Area of Impurity Peak / Total Peak Area) × 100
            </p>
          )}

          <p className="font-bold text-sm mb-2 mt-4">Derivation :</p>

          {/* Multiple impurity entries */}
          {impurityEntries.length > 0 && impurityEntries.map((imp, idx) => (
            <div key={idx} className="mb-3">
              <p className="text-xs font-semibold text-gray-700 mb-1">{imp.name}</p>
              {hasExternal
                ? renderMathFormula(
                    buildNumVal(imp.area),
                    derivationDen,
                    imp.result !== "___" ? imp.result : null,
                    resultUnit,
                  )
                : <p className="text-xs text-center font-mono">
                    ({imp.area} / {totalArea}) × 100
                    {imp.result !== "___" ? ` = ${imp.result} ${resultUnit}` : ""}
                  </p>
              }
            </div>
          ))}

          {/* Single result mode */}
          {impurityEntries.length === 0 && (
            hasExternal
              ? renderMathFormula(buildNumVal(areaSample), derivationDen, singleResult, resultUnit)
              : <p className="text-xs text-center font-mono">
                  ({areaSample} / {totalArea}) × 100
                  {singleResult ? ` = ${singleResult} ${resultUnit}` : ""}
                </p>
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
            
            /* Table page break handling */
            table {
              page-break-inside: auto;
            }
            
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            
            thead {
              display: table-header-group;
            }
            
            tfoot {
              display: table-footer-group;
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

            /* Border around each attached file only in preview */
            .attached-file-preview-border {
              border: 1px solid #ccc;
              margin-bottom: 8px;
            }
          }

          @media print {
            /* No border on attached files in print */
            .attached-file-preview-border {
              border: none !important;
              margin-bottom: 0 !important;
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
          
          /* Styles for tables in HTML content (like blank preparation) */
          table {
            border-collapse: collapse;
            width: 100%;
          }
          
          table td {
            border: 1px solid black;
            padding: 8px;
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
                              Instrument Id
                            </th>
                            <th className="border border-black px-3 py-2 text-left font-bold">
                              Instrument Name
                            </th>
                            <th className="border border-black px-3 py-2 text-left font-bold">
                              Calibration Done On
                            </th>
                            <th className="border border-black px-3 py-2 text-left font-bold">
                              Calibration Due On
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

                  {/* Buffer Preparations */}
                  {param.preparations &&
                    safeJSONParse(param.preparations, []).filter(
                      (p: any) => p.preparationCategory === "buffer",
                    ).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          Buffer Preparations
                        </h4>
                        {safeJSONParse(param.preparations, [])
                          .filter(
                            (p: any) => p.preparationCategory === "buffer",
                          )
                          .map((prep: any, idx: number) => {
                            const steps = safeJSONParse(prep.steps, []);
                            const validSteps = steps.filter((s: any) =>
                              s.value1 || s.logBookID || s.solventChemical
                            );
                            if (validSteps.length === 0) return null;
                            return (
                              <div key={idx} className="section-container mb-3">
                                <div className="mb-1">
                                  <p className="font-bold text-sm">{prep.label}</p>
                                </div>
                                <table className="w-full border border-black text-sm">
                                  <tbody>
                                    {validSteps.map((step: any, sIdx: number) => {
                                      let stepText = "";
                                      if (step.name === "Weighing/Measuring") {
                                        stepText = `${["ml", "L", "µL"].includes(step.unit1) ? "Measure accurately" : "Weigh accurately"} ${step.value1 || "___"} ${step.unit1 || ""} of ${step.solventChemical || "_____________"}${step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""}.`;
                                      } else if (step.name === "PH") {
                                        stepText = `Adjust pH to ${step.value1 || "___"}${step.logBookID ? ` (Log Book ID: ${step.logBookID})` : ""}.`;
                                      } else {
                                        stepText = `${step.name}: ${step.value1 || ""} ${step.unit1 || ""}`.trim();
                                      }
                                      return (
                                        <tr key={sIdx} className="border-b border-black last:border-b-0">
                                          <td className="w-1/3 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                                            {step.name}
                                          </td>
                                          <td className="px-3 py-2">{stepText}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })}
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
                            (p: any) =>
                              p.preparationCategory === "mobile_phase",
                          )
                          .map((prep: any, idx: number) => {
                            const steps = safeJSONParse(prep.steps, []);
                            const stepsTable = renderPreparationStepsTable(
                              steps,
                              "mobile_phase",
                              prep.preparationType || "mobile_phase",
                              prep.assignedStandardId,
                            );
                            const hasContent = !!(prep.content && prep.content.trim());

                            // Show step table if available, fall back to content, skip if neither
                            if (!stepsTable && !hasContent) return null;

                            return (
                              <div key={idx} className="section-container mb-3">
                                <div className="mb-1">
                                  <p className="font-bold text-sm">
                                    {prep.label}
                                  </p>
                                </div>
                                {stepsTable ? (
                                  <div className="p-0">{stepsTable}</div>
                                ) : (
                                  <div
                                    className="prose prose-sm max-w-none text-sm"
                                    dangerouslySetInnerHTML={{ __html: prep.content }}
                                    style={{ lineHeight: "1.6", fontSize: "13px" }}
                                  />
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}

                  {/* Dissolution Media Preparations */}
                  {(() => {
                    const dissoMediaPreps = param.preparations
                      ? safeJSONParse(param.preparations, []).filter(
                          (p: any) =>
                            p.preparationCategory === "dissolution_media" ||
                            p.preparationCategory === "dissolution_media_profile",
                        )
                      : [];

                    // Build rendered prep items — only include ones with valid step data
                    const renderedPreps = dissoMediaPreps.map((prep: any, idx: number) => {
                      const steps = safeJSONParse(prep.steps, []);
                      const stepsTable = renderPreparationStepsTable(
                        steps,
                        "dissolution_media",
                        prep.preparationType || "dissolution_media",
                        prep.assignedStandardId,
                      );
                      if (!stepsTable) return null;

                      // Format preparationType for display in brackets
                      const prepTypeLabel = prep.preparationType
                        ? formatCalcType(prep.preparationType)
                        : null;

                      return (
                        <div key={idx} className="section-container mb-3">
                          <div className="mb-1">
                            <p className="font-bold text-sm">
                              {prep.label}
                              {prepTypeLabel ? ` (${prepTypeLabel})` : ""}
                            </p>
                          </div>
                          <div className="p-0">{stepsTable}</div>
                        </div>
                      );
                    }).filter(Boolean);

                    // Only render the whole block (including title) if at least one prep has valid steps
                    if (renderedPreps.length === 0) return null;

                    return (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          Dissolution Media Preparations
                        </h4>
                        {renderedPreps}
                      </div>
                    );
                  })()}

                  {/* Diluent Preparations */}
                  {param.preparations &&
                    safeJSONParse(param.preparations, []).filter(
                      (p: any) => p.preparationCategory === "diluent",
                    ).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          Diluent Preparations
                        </h4>
                        {safeJSONParse(param.preparations, [])
                          .filter(
                            (p: any) => p.preparationCategory === "diluent",
                          )
                          .map((prep: any, idx: number) => {
                            return (
                              <div key={idx} className="section-container mb-3">
                                <div className="mb-1">
                                  <p className="font-bold text-sm">{prep.label}</p>
                                </div>
                                {prep.content ? (
                                  <div
                                    className="prose prose-sm max-w-none text-sm"
                                    dangerouslySetInnerHTML={{ __html: prep.content }}
                                    style={{ lineHeight: "1.6", fontSize: "13px" }}
                                  />
                                ) : (
                                  <p className="text-sm text-gray-500 italic">No content available.</p>
                                )}
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
                              <div
                                key={`new-${idx}`}
                                className="section-container mb-3"
                              >
                                <div className="mb-1">
                                  <p className="font-bold text-sm">
                                    {prep.label} ({formatCalcType(prep.preparationType)})
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
                              <div
                                key={`new-${idx}`}
                                className="section-container mb-3"
                              >
                                <div className="mb-1">
                                  <p className="font-bold text-sm">
                                    {prep.label} ({formatCalcType(prep.preparationType)})
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
                        const isDissoProfileCalc = calc.calculationType?.toLowerCase() === "dissolution_profile";
                        const isDissoCalc = calc.calculationType
                          ?.toLowerCase()
                          .includes("disso");
                        const isUCCalc = calc.calculationType
                          ?.toLowerCase()
                          .includes("uniformity_of_content");

                        return (
                          <div key={idx}>
                            <div className="section-container mb-4 page-break-inside-avoid">
                              <div className="mb-1">
                                <p className="font-bold text-sm">
                                  {calc.label} ({formatCalcType(calc.calculationType)})
                                </p>
                              </div>

                              {/* Calculation Details Table — hidden for dissolution_profile (all shown in derivation) */}
                              {!isDissoProfileCalc && (
                              <div>
                                <table className="w-full text-sm">
                                  <tbody>
                                    {Object.entries(calcData).map(
                                      ([key, value]: [string, any]) => {
                                        if (key.includes("mgPerTabletResult")) return null;

                                        if (
                                          key === "id" ||
                                          key === "label" ||
                                          value === null ||
                                          value === "" ||
                                          key.toLowerCase().includes("unit") ||
                                          // Hide lodWaterType — we show the value with a smarter label instead
                                          key === "lodWaterType" ||
                                          (isDissoCalc &&
                                            key === "calculationResult") ||
                                          (isUCCalc &&
                                            key === "calculationResult") ||
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
                                          key === "dilutedVol" ||
                                          // Hide individual limit keys — rendered as combined row
                                          key === "acceptanceLimitMin" ||
                                          key === "acceptanceLimitMax"
                                        )
                                          return null;

                                        // Smart label for lodWaterValue — show "LOD Value" or "Water Value"
                                        let displayKey: string;
                                        if (key === "lodWaterValue") {
                                          const lodType = calcData["lodWaterType"] || "";
                                          displayKey = lodType === "lod" ? "LOD Value" : "Water Value";
                                        } else if (key === "lodWaterBasisResult") {
                                          const lodType = calcData["lodWaterType"] || "";
                                          displayKey = lodType === "water" ? "Anhydrous Basis Result" : "Dry Basis Result";
                                        } else {
                                          displayKey = key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (c) => c.toUpperCase())
                                            .trim()
                                            .replace(/(\d+)/g, " $1")
                                            .replace(/\s+/g, " ")
                                            .replace(/\bOf\b/g, "of");
                                        }

                                        const unit = findUnitForKey(
                                          calcData,
                                          key,
                                        );
                                        let displayValue = String(value);
                                        if (unit) {
                                          displayValue = `${value} ${unit}`;
                                        }

                                        // Add % for purity values
                                        if (key.toLowerCase() === "purity") {
                                          displayValue = unit
                                            ? displayValue
                                            : `${value} %`;
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
                                    {/* Combined Acceptance Limit row */}
                                    {(() => {
                                      const rawMin = calcData.acceptanceLimitMin;
                                      const rawMax = calcData.acceptanceLimitMax;
                                      const lMin = rawMin != null && rawMin !== "" ? parseFloat(String(rawMin)) : null;
                                      const lMax = rawMax != null && rawMax !== "" ? parseFloat(String(rawMax)) : null;
                                      const hasMin = lMin !== null && !isNaN(lMin);
                                      const hasMax = lMax !== null && !isNaN(lMax);
                                      if (!hasMin && !hasMax) return null;
                                      const display = hasMin && hasMax
                                        ? `${lMin} ≤ Result ≤ ${lMax}`
                                        : hasMin
                                          ? `${lMin} ≤ Result`
                                          : `Result ≤ ${lMax}`;
                                      return (
                                        <tr key="acceptance-limit" className="border-b border-black last:border-b-0">
                                          <td className="w-2/5 px-3 py-2 font-bold bg-gray-100 border-r border-black">
                                            Acceptance Limit
                                          </td>
                                          <td className="px-3 py-2">{display}</td>
                                        </tr>
                                      );
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                              )}

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
                      <div className="text-sm">{param.diluentPreparation}</div>
                    </div>
                  )}

                  {/* Blank Preparation */}
                  {param.preparations &&
                    safeJSONParse(param.preparations, []).filter(
                      (p: any) => p.preparationCategory === "blank",
                    ).length > 0 && (
                      <div className="mb-6">
                        {safeJSONParse(param.preparations, [])
                          .filter((p: any) => p.preparationCategory === "blank")
                          .map((prep: any, idx: number) => {
                            return (
                              <div key={idx} className="section-container mb-3">
                                <div className="mb-1">
                                  <p className="text-md uppercase font-bold mb-2">
                                    {prep.label}
                                  </p>
                                </div>
                                <div
                                  className="text-sm"
                                  dangerouslySetInnerHTML={{
                                    __html: prep.content || "",
                                  }}
                                />
                              </div>
                            );
                          })}
                      </div>
                    )}

                  {/* System Suitability */}
                  {param.preparations &&
                    safeJSONParse(param.preparations, []).filter(
                      (p: any) =>
                        p.preparationCategory === "system_suitability",
                    ).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md uppercase font-bold mb-2">
                          System Suitabilities
                        </h4>
                        {safeJSONParse(param.preparations, [])
                          .filter(
                            (p: any) =>
                              p.preparationCategory === "system_suitability",
                          )
                          .map((suitability: any, idx: number) => {
                            const steps = safeJSONParse(suitability.steps, []);

                            if (!steps || steps.length === 0) return null;

                            // Helper function to get limit prefix
                            const getLimitPrefix = (
                              stepName: string,
                              limitType?: string,
                            ) => {
                              // For custom steps with limitType, use that
                              if (limitType) {
                                return limitType;
                              }

                              // For default steps, use hardcoded values
                              switch (stepName) {
                                case "RSD Area":
                                case "RSD Retention time":
                                case "Tailing factor":
                                  return "NMT";
                                case "Resolution":
                                case "Theorital Plate count":
                                case "Peak to Valley ratio":
                                  return "NLT";
                                default:
                                  return "NLT"; // Default for unknown steps
                              }
                            };

                            // Helper function to check if step uses two values (Peak A and Peak B)
                            const isTwoValueStep = (stepName: string) => {
                              return (
                                stepName === "Resolution" ||
                                stepName === "Peak to Valley ratio"
                              );
                            };

                            // Helper function to check if step has any values
                            const stepHasAnyValue = (step: any) => {
                              return !!(
                                step.value1 ||
                                step.value2 ||
                                step.value3
                              );
                            };

                            // Filter steps with at least one value
                            const validSteps = steps.filter(stepHasAnyValue);

                            // If no valid steps after filtering, don't render this suitability
                            if (validSteps.length === 0) return null;

                            // Helper function to get step description
                            const getStepDescription = (stepName: string) => {
                              switch (stepName) {
                                case "RSD Area":
                                  return "The RSD of area of";
                                case "RSD Retention time":
                                  return "The RSD of Retention time of";
                                case "Tailing factor":
                                  return "The Tailing factor of";
                                case "Resolution":
                                  return "The Resolution between";
                                case "Peak to Valley ratio":
                                  return "The Peak to Valley ratio between";
                                case "Theorital Plate count":
                                  return "The Theoretical Plate count of";
                                default:
                                  return stepName; // For custom steps, use the step name as is
                              }
                            };

                            return (
                              <div key={idx} className="section-container mb-3">
                                <div className="mb-1">
                                  <p className="font-bold text-sm">
                                    {suitability.label}
                                  </p>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse border border-black text-sm">
                                    <tbody>
                                      {validSteps.map(
                                        (step: any, stepIdx: number) => {
                                          const limitPrefix = getLimitPrefix(
                                            step.name,
                                            step.limitType,
                                          );
                                          const stepDesc = getStepDescription(
                                            step.name,
                                          );
                                          const needsTwoValues = isTwoValueStep(
                                            step.name,
                                          );

                                          // Build the specification text
                                          let specification = stepDesc;

                                          // Add Peak A
                                          if (step.value1) {
                                            specification += ` <strong>${step.value1}</strong>`;
                                          } else {
                                            specification += ` ___________`;
                                          }

                                          // Add Peak B if needed
                                          if (needsTwoValues) {
                                            specification += " and";
                                            if (step.value2) {
                                              specification += ` <strong>${step.value2}</strong>`;
                                            } else {
                                              specification += ` ___________`;
                                            }
                                          }

                                          // Add limit only if value3 exists
                                          if (step.value3) {
                                            specification += ` should ${limitPrefix} <strong>${step.value3}</strong>`;
                                          }

                                          return (
                                            <tr key={stepIdx}>
                                              <td className="bg-purple-100 border border-black px-4 py-2 font-medium">
                                                {step.name}
                                              </td>
                                              <td
                                                className="border border-black px-4 py-2"
                                                dangerouslySetInnerHTML={{
                                                  __html: specification,
                                                }}
                                              />
                                            </tr>
                                          );
                                        },
                                      )}
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

                  {/* Digital Signature */}
                  {renderSignatureSection(param)}

                  {/* Attached Files — PDF pages rendered inline via PDF.js, no filename/border chrome */}
                  {param.files && Array.isArray(param.files) && param.files.filter((f: any) => f.fileDataBase64).length > 0 && (
                    <div className="section-container mb-4">
                      <h4 className="text-md uppercase font-bold mb-2 no-print">Attached Files</h4>
                      {(() => {
                        // Group: prep-type files first (keyed by preparationType), then param-level = "Other Files"
                        const groups: Record<string, { slotLabel: string; sortOrder: number; files: any[] }> = {};
                        for (const f of param.files) {
                          if (!f.fileDataBase64) continue;
                          let slotKey: string;
                          let slotLabel: string;
                          let sortOrder: number;
                          if (f.preparationType) {
                            slotKey = f.preparationType;
                            slotLabel = formatCalcType(f.preparationType);
                            sortOrder = 0;
                          } else {
                            slotKey = "__other__";
                            slotLabel = "Other Files";
                            sortOrder = 1;
                          }
                          if (!groups[slotKey]) groups[slotKey] = { slotLabel, sortOrder, files: [] };
                          groups[slotKey].files.push(f);
                        }

                        return Object.entries(groups)
                          .sort(([, a], [, b]) => a.sortOrder - b.sortOrder)
                          .map(([slotKey, group]) => (
                            <div key={slotKey} className="mb-4">
                              {group.files.map((f: any, fi: number) => {
                                const isPdf =
                                  f.fileName?.toLowerCase().endsWith(".pdf") ||
                                  f.fileDataBase64?.startsWith("JVBER");
                                const isImage = /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(f.fileName || "");
                                return (
                                  <div key={fi} className="attached-file-preview-border">
                                    {isPdf ? (
                                      <PdfPageRenderer
                                        base64={f.fileDataBase64}
                                        fileName={f.fileName || `file_${fi + 1}.pdf`}
                                      />
                                    ) : isImage ? (
                                      <img
                                        src={`data:image/${f.fileName?.split(".").pop()?.toLowerCase() || "jpeg"};base64,${f.fileDataBase64}`}
                                        alt={f.fileName}
                                        className="max-w-full block"
                                        style={{ objectFit: "contain" }}
                                      />
                                    ) : (
                                      <p className="text-xs text-gray-500 text-center py-2">
                                        {f.fileName} (preview not available)
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ));
                      })()}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PrintReport;