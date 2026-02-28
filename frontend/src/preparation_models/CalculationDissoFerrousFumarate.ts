
export interface CalculationDissoFerrousFumarate {
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
  id: number;
  label: string;

  selectedSamplePreparationLabel: string | null;

  buretteReading1: string;
  buretteReading2: string;
  buretteReading3: string;
  buretteReading4: string;
  buretteReading5: string;
  buretteReading6: string;

  theoreticalMolarity: string;
  actualMolarity: string;
  factor: string;
  dissoMediaVolume: string;
  labelClaim: string;

  calculationResultTablet1: string | null;
  calculationResultTablet2: string | null;
  calculationResultTablet3: string | null;
  calculationResultTablet4: string | null;
  calculationResultTablet5: string | null;
  calculationResultTablet6: string | null;

  calculationResult: string | null;
  calculationResultUnit: string | null;

  sampleTaken: string | null;
  factorUnit: string;
}