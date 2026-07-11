export interface CalculationAssayHypromellose {
  id: number;
  label: string;
  selectedStandardPreparationLabel: string | null;
  selectedSamplePreparationLabel: string | null;

  // Reference / method inputs
  methylIodideBatchNo: string;
  isopropylIodideBatchNo: string;
  methylIodidePurity: string; // Pa
  isopropylIodidePurity: string; // Pb
  methylIodideStdWt: string; // WSa, mg
  isopropylIodideStdWt: string; // WSb, mg
  sampleWeight: string; // Wu, mg
  lodPercent: string;

  // % Area Ratio RSD replicate table (6 replicates)
  areaOfMI1: string | null;
  areaOfMI2: string | null;
  areaOfMI3: string | null;
  areaOfMI4: string | null;
  areaOfMI5: string | null;
  areaOfMI6: string | null;

  areaOfIPI1: string | null;
  areaOfIPI2: string | null;
  areaOfIPI3: string | null;
  areaOfIPI4: string | null;
  areaOfIPI5: string | null;
  areaOfIPI6: string | null;

  internalStandardArea1: string | null;
  internalStandardArea2: string | null;
  internalStandardArea3: string | null;
  internalStandardArea4: string | null;
  internalStandardArea5: string | null;
  internalStandardArea6: string | null;

  // Computed replicate stats (persisted results)
  areaRatioMIMean: string | null;
  areaRatioMISD: string | null;
  areaRatioMIRSD: string | null;
  areaRatioIPIMean: string | null;
  areaRatioIPISD: string | null;
  areaRatioIPIRSD: string | null;

  // % Area Ratio RSD replicate table (6 replicates) - Sample Preparation
  sampleAreaOfMI1: string | null;
  sampleAreaOfMI2: string | null;
  sampleAreaOfMI3: string | null;
  sampleAreaOfMI4: string | null;
  sampleAreaOfMI5: string | null;
  sampleAreaOfMI6: string | null;

  sampleAreaOfIPI1: string | null;
  sampleAreaOfIPI2: string | null;
  sampleAreaOfIPI3: string | null;
  sampleAreaOfIPI4: string | null;
  sampleAreaOfIPI5: string | null;
  sampleAreaOfIPI6: string | null;

  sampleInternalStandardArea1: string | null;
  sampleInternalStandardArea2: string | null;
  sampleInternalStandardArea3: string | null;
  sampleInternalStandardArea4: string | null;
  sampleInternalStandardArea5: string | null;
  sampleInternalStandardArea6: string | null;

  // Computed sample replicate stats (persisted results)
  areaRatioSampleMIMean: string | null;
  areaRatioSampleMISD: string | null;
  areaRatioSampleMIRSD: string | null;
  areaRatioSampleIPIMean: string | null;
  areaRatioSampleIPISD: string | null;
  areaRatioSampleIPIRSD: string | null;

  // Standard block (QSa / QSb)
  stdAreaOfMI: string;
  stdAreaOfIPI: string;
  stdInternalStandardArea: string;
  areaRatioQSa: string | null;
  areaRatioQSb: string | null;

  // Sample block (QTa / QTb)
  sampleAreaOfMI: string;
  sampleAreaOfIPI: string;
  sampleInternalStandardArea: string;
  areaRatioQTa: string | null;
  areaRatioQTb: string | null;

  // Results
  methoxyResultAsIs: string | null;
  methoxyResultDried: string | null;
  methoxyResultUnit: string | null;
  methoxyLimitMin: string;
  methoxyLimitMax: string;

  hydroxypropoxyResultAsIs: string | null;
  hydroxypropoxyResultDried: string | null;
  hydroxypropoxyResultUnit: string | null;
  hydroxypropoxyLimitMin: string;
  hydroxypropoxyLimitMax: string;
}