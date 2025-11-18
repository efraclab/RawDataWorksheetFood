import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const X = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Printer = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const Download = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PrintPreviewDialog = ({ isOpen, onClose, data }) => {
  const printRef = useRef(null);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      const element = printRef.current;
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: [15, 10, 15, 10],
        filename: `Raw_Data_Worksheet_${data.registrationInfo.registrationNo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export requires html2pdf.js library. Falling back to print dialog.');
      handlePrint();
    }
  };

  const renderInstrumentsTable = (instruments) => {
    if (!instruments || instruments.length === 0) return null;
    
    return (
      <div className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          Instruments Details:
        </h4>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 text-left font-bold">Instrument Name</th>
              <th className="border border-black px-2 py-1 text-left font-bold">Calibration Done</th>
              <th className="border border-black px-2 py-1 text-left font-bold">Calibration Due</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((inst, idx) => (
              <tr key={idx}>
                <td className="border border-black px-2 py-1">{inst.name || '---'}</td>
                <td className="border border-black px-2 py-1">{inst.calibrationDoneDate || '---'}</td>
                <td className="border border-black px-2 py-1">{inst.calibrationDueDate || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderChemicalsTable = (chemicals) => {
    if (!chemicals || chemicals.length === 0) return null;
    
    return (
      <div className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          Reagents and Chemicals Details:
        </h4>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 text-left font-bold">Name of Solvents</th>
              <th className="border border-black px-2 py-1 text-left font-bold">Make</th>
              <th className="border border-black px-2 py-1 text-left font-bold">Batch No.</th>
              <th className="border border-black px-2 py-1 text-left font-bold">Validity</th>
            </tr>
          </thead>
          <tbody>
            {chemicals.map((chem, idx) => (
              <tr key={idx}>
                <td className="border border-black px-2 py-1">{chem.name || '---'}</td>
                <td className="border border-black px-2 py-1">{chem.make || '---'}</td>
                <td className="border border-black px-2 py-1">{chem.batchNo || '---'}</td>
                <td className="border border-black px-2 py-1">{chem.validity || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStandardsTable = (standards) => {
    if (!standards || standards.length === 0) return null;
    
    return (
      <div className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          Standards Details:
        </h4>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 text-left font-bold">Name of Standard</th>
              <th className="border border-black px-2 py-1 text-left font-bold">Purity</th>
              <th className="border border-black px-2 py-1 text-left font-bold">Make</th>
              <th className="border border-black px-2 py-1 text-left font-bold">Batch No.</th>
            </tr>
          </thead>
          <tbody>
            {standards.map((std, idx) => (
              <tr key={idx}>
                <td className="border border-black px-2 py-1">{std.name || '---'}</td>
                <td className="border border-black px-2 py-1">{std.purity || '---'}</td>
                <td className="border border-black px-2 py-1">{std.make || '---'}</td>
                <td className="border border-black px-2 py-1">{std.batchNo || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMobilePhasePreparation = (mobilePhases) => {
    if (!mobilePhases || mobilePhases.length === 0) return null;

    return mobilePhases.map((mp, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {mp.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {mp.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name === "Weighing" && (
                    <>
                      {step.value} {step.unit} | Chemical: {step.solventChemical || '---'} | Log: {step.logBookID || '---'}
                    </>
                  )}
                  {step.name === "PH" && (
                    <>Value: {step.value || '---'} | Log: {step.logBookID || '---'}</>
                  )}
                  {step.name === "Filtration" && (
                    <>{step.value} {step.unit}</>
                  )}
                  {step.name === "Sonication" && (
                    <>{step.value} {step.unit} | Mobile Phase ID: {step.mobilePhaseID || '---'}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderDissoMediaPreparation = (dissoMedia) => {
    if (!dissoMedia || dissoMedia.length === 0) return null;

    return dissoMedia.map((dm, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {dm.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {dm.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name === "Weighing" && (
                    <>
                      {step.value} {step.unit} | Chemical: {step.solventChemical || '---'} | Log: {step.logBookID || '---'}
                    </>
                  )}
                  {step.name === "PH" && (
                    <>Value: {step.value || '---'} | Log: {step.logBookID || '---'}</>
                  )}
                  {step.name === "Filtration" && (
                    <>{step.value} {step.unit}</>
                  )}
                  {step.name === "Sonication" && (
                    <>{step.value} {step.unit}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderStandardPreparation = (standardPrep) => {
    if (!standardPrep || standardPrep.length === 0) return null;

    return standardPrep.map((sp, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {sp.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {sp.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name === "Weighing" && (
                    <>
                      {step.value} {step.unit} | Chemical: {step.solventChemical || '---'} | Log: {step.logBookID || '---'}
                    </>
                  )}
                  {step.name.includes("Dilution") && (
                    <>{step.vol1} {step.unit1} to {step.vol2} {step.unit2}</>
                  )}
                  {step.name === "Filtration" && (
                    <>{step.value} {step.unit}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderSamplePreparation = (samplePrep) => {
    if (!samplePrep || samplePrep.length === 0) return null;

    return samplePrep.map((sp, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {sp.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {sp.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name === "Weighing" && (
                    <>
                      {step.value} {step.unit} | Chemical: {step.solventChemical || '---'} | Log: {step.logBookID || '---'}
                    </>
                  )}
                  {step.name.includes("Dilution") && (
                    <>{step.vol1} {step.unit1} to {step.vol2} {step.unit2}</>
                  )}
                  {step.name === "Filtration" && (
                    <>{step.value} {step.unit}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderSamplePreparationDisso = (samplePrepDisso) => {
    if (!samplePrepDisso || samplePrepDisso.length === 0) return null;

    return samplePrepDisso.map((spd, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {spd.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {spd.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name === "Instrument Details" && (
                    <>ID: {step.id || '---'} | RPM: {step.rpm || '---'} | Temp: {step.temp} {step.tempUnit}</>
                  )}
                  {step.name === "Tablet Details" && (
                    <>Claim: {step.claim || '---'} | Media Vol: {step.mediaVol} {step.unit} | Time: {step.time} {step.timeUnit}</>
                  )}
                  {step.name.includes("Dilution") && (
                    <>{step.vol1} {step.unit1} to {step.vol2} {step.unit2}</>
                  )}
                  {step.name === "Filtration" && (
                    <>{step.value} {step.unit}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderSamplePreparationTitration = (samplePrepTitration) => {
    if (!samplePrepTitration || samplePrepTitration.length === 0) return null;

    return samplePrepTitration.map((spt, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {spt.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {spt.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name === "Weighing" && (
                    <>
                      {step.value} {step.unit} | Chemical: {step.solventChemical || '---'} | Log: {step.logBookID || '---'}
                    </>
                  )}
                  {step.name === "1st Dilution" && (
                    <>{step.value} {step.unit}</>
                  )}
                  {step.name === "End Point Determination" && (
                    <>{step.value || '---'}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderSamplePreparationLOD = (samplePrepLOD) => {
    if (!samplePrepLOD || samplePrepLOD.length === 0) return null;

    return samplePrepLOD.map((spl, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {spl.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {spl.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name.includes("Weighing") && (
                    <>{step.value} {step.unit} | Log: {step.logBookID || '---'}</>
                  )}
                  {step.name === "Drying" && (
                    <>Temp: {step.temp} {step.tempUnit} | Time: {step.time} {step.timeUnit} | Log: {step.logBookID || '---'}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderSamplePreparationSulphatedAsh = (samplePrepSA) => {
    if (!samplePrepSA || samplePrepSA.length === 0) return null;

    return samplePrepSA.map((sps, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {sps.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {sps.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name.includes("Weighing") && (
                    <>{step.value} {step.unit} | Log: {step.logBookID || '---'}</>
                  )}
                  {step.name === "Drying" && (
                    <>Temp: {step.temp} {step.tempUnit} | Time: {step.time} {step.timeUnit} | Log: {step.logBookID || '---'}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderSamplePreparationLossOnIgnation = (samplePrepLOI) => {
    if (!samplePrepLOI || samplePrepLOI.length === 0) return null;

    return samplePrepLOI.map((spl, idx) => (
      <div key={idx} className="mb-4 page-break-inside-avoid">
        <h4 className="text-xs font-bold mb-2 text-black underline">
          {spl.label}:
        </h4>
        <table className="w-full border-collapse text-xs">
          <tbody>
            {spl.steps.map((step, stepIdx) => (
              <tr key={stepIdx}>
                <td className="border border-black px-2 py-1 font-bold w-1/3">
                  {step.name}:
                </td>
                <td className="border border-black px-2 py-1">
                  {step.name.includes("Weighing") && (
                    <>{step.value} {step.unit} | Log: {step.logBookID || '---'}</>
                  )}
                  {step.name === "Drying" && (
                    <>Temp: {step.temp} {step.tempUnit} | Time: {step.time} {step.timeUnit} | Log: {step.logBookID || '---'}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        >
          {/* Dialog Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white no-print">
            <h2 className="text-xl font-bold text-gray-800">Print Preview - Raw Data Work Sheet</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 no-print">
            <div ref={printRef} className="bg-white shadow-lg mx-auto print-container" style={{ width: '210mm' }}>
              {/* Print Styles */}
              <style>{`
                @media print {
                  * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  .no-print {
                    display: none !important;
                  }

                  body {
                    margin: 0;
                    padding: 0;
                  }

                  .print-container {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                  }
                  
                  @page {
                    size: A4;
                    margin: 12mm 10mm 12mm 10mm;
                  }

                  thead {
                    display: table-header-group;
                  }

                  tfoot {
                    display: table-footer-group;
                  }

                  .print-header {
                    position: running(header);
                  }

                  .print-footer {
                    position: running(footer);
                  }

                  @page {
                    @top-center {
                      content: element(header);
                    }
                    @bottom-center {
                      content: element(footer);
                    }
                  }
                  
                  .page-break {
                    page-break-before: always;
                  }
                  
                  .page-break-inside-avoid {
                    page-break-inside: avoid;
                    break-inside: avoid;
                  }

                  table {
                    page-break-inside: auto;
                  }

                  tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                  }

                  .print-content {
                    margin-top: 0;
                  }
                }

                @media screen {
                  .print-header {
                    margin-bottom: 1.5rem;
                  }
                  .print-footer {
                    margin-top: 2rem;
                  }
                }
              `}</style>

              <div className="p-8">
                {/* Header */}
                <div className="print-header mb-6">
                  <div className="flex justify-between items-start pb-3 border-b-2 border-black">
                    <div className="text-xs">
                      <div className="font-bold">Document Code: EFRAC/QC/F/001</div>
                      <div className="font-bold">Revision: 00</div>
                    </div>
                    <img src="./ic_efrac.png" alt="EFRAC Logo" className="h-14" />
                  </div>
                  <div className="mt-3 text-center border-2 border-black py-2">
                    <h1 className="text-base font-bold">
                      EDWARD FOOD RESEARCH & ANALYSIS CENTRE LTD
                    </h1>
                    <p className="text-sm font-bold mt-1">RAW DATA WORK SHEET</p>
                  </div>
                </div>

                <div className="print-content">
                  {/* Registration Info */}
                  <div className="mb-5 border-2 border-black page-break-inside-avoid">
                    <table className="w-full border-collapse text-xs">
                      <tbody>
                        <tr>
                          <td className="border border-black px-2 py-1.5 font-bold w-1/4">Registration No:</td>
                          <td className="border border-black px-2 py-1.5">{data.registrationInfo.registrationNo}</td>
                          <td className="border border-black px-2 py-1.5 font-bold w-1/4">Date of Receipt:</td>
                          <td className="border border-black px-2 py-1.5">{data.registrationInfo.dateOfReceipt}</td>
                        </tr>
                        <tr>
                          <td className="border border-black px-2 py-1.5 font-bold">Sample Name:</td>
                          <td className="border border-black px-2 py-1.5">{data.registrationInfo.sampleName}</td>
                          <td className="border border-black px-2 py-1.5 font-bold">No. of Parameters:</td>
                          <td className="border border-black px-2 py-1.5">{data.registrationInfo.numberOfParameters}</td>
                        </tr>
                        <tr>
                          <td className="border border-black px-2 py-1.5 font-bold">Due Date:</td>
                          <td className="border border-black px-2 py-1.5">{data.registrationInfo.dueDate}</td>
                          <td className="border border-black px-2 py-1.5 font-bold">Analysis Started:</td>
                          <td className="border border-black px-2 py-1.5">{data.registrationInfo.analysisStartDate}</td>
                        </tr>
                        <tr>
                          <td className="border border-black px-2 py-1.5 font-bold" colSpan={2}></td>
                          <td className="border border-black px-2 py-1.5 font-bold">Analysis Completed:</td>
                          <td className="border border-black px-2 py-1.5">{data.registrationInfo.analysisCompletionDate}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Parameters */}
                  {data.parameters.map((param, idx) => (
                    <div key={idx} className={idx > 0 ? "mb-6 page-break" : "mb-6"}>
                      <div className="border-2 border-black px-3 py-2 mb-4">
                        <h3 className="text-sm font-bold">
                          Parameter {idx + 1}: {param.parameterName}
                        </h3>
                        <p className="text-xs mt-1">Code: {param.paraCode} | Method: {param.methodName} ({param.methodCode})</p>
                      </div>

                      {/* Parameter Tables */}
                      {renderInstrumentsTable(param.instruments)}
                      {renderChemicalsTable(param.chemicals)}
                      {renderStandardsTable(param.standards)}

                      {/* Column Details */}
                      {param.columnDetails && (
                        <div className="mb-4 page-break-inside-avoid">
                          <h4 className="text-xs font-bold mb-2 text-black underline">
                            Column Details:
                          </h4>
                          <table className="w-full border-collapse text-xs">
                            <tbody>
                              <tr>
                                <td className="border border-black px-2 py-1 font-bold w-1/3">Column ID:</td>
                                <td className="border border-black px-2 py-1">{param.columnDetails.id}</td>
                              </tr>
                              <tr>
                                <td className="border border-black px-2 py-1 font-bold">Column Name:</td>
                                <td className="border border-black px-2 py-1">{param.columnDetails.name}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Diluent Preparation */}
                      {param.diluentPreparation && (
                        <div className="mb-4 page-break-inside-avoid">
                          <h4 className="text-xs font-bold mb-2 text-black underline">
                            Preparation of Diluent:
                          </h4>
                          <div className="border-2 border-black px-3 py-2 text-xs whitespace-pre-wrap">
                            {param.diluentPreparation}
                          </div>
                        </div>
                      )}

                      {/* Mobile Phases */}
                      {renderMobilePhasePreparation(param.mobilePhases)}

                      {/* Disso Media */}
                      {renderDissoMediaPreparation(param.dissoMedia)}

                      {/* Standard Preparation */}
                      {renderStandardPreparation(param.standardPreparation)}

                      {/* Sample Preparation */}
                      {renderSamplePreparation(param.samplePreparation)}

                      {/* Sample Preparation Disso */}
                      {renderSamplePreparationDisso(param.samplePreparationDisso)}

                      {/* Sample Preparation Titration */}
                      {renderSamplePreparationTitration(param.samplePreparationTitration)}

                      {/* Sample Preparation LOD */}
                      {renderSamplePreparationLOD(param.samplePreparationLod)}

                      {/* Sample Preparation Sulphated Ash */}
                      {renderSamplePreparationSulphatedAsh(param.samplePreparationSulphatedAsh)}

                      {/* Sample Preparation Loss on Ignation */}
                      {renderSamplePreparationLossOnIgnation(param.samplePreparationLossOnIgnation)}

                      {/* Test Solution Preparation */}
                      {param.testSolutionPreparation && (
                        <div className="mb-4 page-break-inside-avoid">
                          <h4 className="text-xs font-bold mb-2 text-black underline">
                            Preparation of Test Solution / Sample Solution:
                          </h4>
                          <div className="border-2 border-black px-3 py-2 text-xs whitespace-pre-wrap">
                            {param.testSolutionPreparation}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="print-footer mt-8">
                  <div className="border-2 border-black">
                    <div className="grid grid-cols-3 border-b-2 border-black text-xs font-bold text-center">
                      <div className="border-r-2 border-black p-2">
                        <div>REVIEWED BY (QC)</div>
                        <div className="font-normal text-xs mt-1">(Sign & Date)</div>
                        <div className="h-10 border-b border-black mb-1"></div>
                      </div>
                      <div className="border-r-2 border-black p-2">
                        <div>REVIEWED BY (QA)</div>
                        <div className="font-normal text-xs mt-1">(Sign & Date)</div>
                        <div className="h-10 border-b border-black mb-1"></div>
                      </div>
                      <div className="p-2">
                        <div>APPROVED BY (QA)</div>
                        <div className="font-normal text-xs mt-1">(Sign & Date)</div>
                        <div className="h-10 border-b border-black mb-1"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black text-xs">
                      <div className="border-r border-black px-2 py-1">
                        <span className="font-bold">Prepared By: </span>
                        <span>{data.documentInfo.preparedBy}</span>
                      </div>
                      <div className="border-r border-black px-2 py-1">
                        <span className="font-bold">Issued By: </span>
                        <span>{data.documentInfo.issuedApprovedBy}</span>
                      </div>
                      <div className="px-2 py-1">
                        <span className="font-bold">Effective Date: </span>
                        <span>{data.documentInfo.effectiveIssueDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 text-xs">
                      <div className="border-r border-black px-2 py-1">
                        <span className="font-bold">Approved By: </span>
                        <span>{data.documentInfo.approvedBy}</span>
                      </div>
                      <div className="border-r border-black px-2 py-1">
                        <span className="font-bold">Classified: </span>
                        <span>{data.documentInfo.classified}</span>
                      </div>
                      <div className="px-2 py-1">
                        <span className="font-bold">Revision Date: </span>
                        <span>{data.documentInfo.revisionDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-center text-xs border-t border-black pt-2">
                    <p>Printed: {new Date().toLocaleString('en-GB')} | Document: {data.registrationInfo.registrationNo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrintPreviewDialog;