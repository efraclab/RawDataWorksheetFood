// Unit conversion helpers for SamplePreparationMetal step values.
//
// The metal calculation formulas always expect:
//   - sample weight (SW) in grams
//   - all dilution volumes (V1..V7) in millilitres
//
// Sample preparation lets the user enter any of:
//   - weight: mg | g | kg
//   - volume: µL | ml | L
//
// These helpers normalise a (value, unit) pair from a prep step into the
// canonical unit (g or ml) before the calculation consumes it.

export const WEIGHT_CANONICAL = "g";
export const VOLUME_CANONICAL = "ml";

const WEIGHT_TO_G: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
};

const VOLUME_TO_ML: Record<string, number> = {
  // accept both µL spellings used in the UI
  "µL": 0.001,
  "μL": 0.001,
  uL: 0.001,
  ml: 1,
  mL: 1,
  L: 1000,
  l: 1000,
};

const parseOrNull = (v: string | null | undefined): number | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

// Trim trailing zeros from a fixed-decimal string ("0.1000" -> "0.1") so converted
// values don't pollute the UI with insignificant precision while preserving exactness.
const trimTrail = (s: string): string =>
  s.indexOf(".") < 0 ? s : s.replace(/0+$/, "").replace(/\.$/, "");

// Convert a weight (mg | g | kg) to grams. Returns null when the value is blank or invalid.
export const toCanonicalWeightG = (
  value: string | null | undefined,
  unit: string | null | undefined,
): string | null => {
  const n = parseOrNull(value);
  if (n === null) return null;
  const u = (unit ?? "").trim();
  // Default to g when no unit chosen — preserves prior behaviour for legacy entries.
  const factor = u === "" ? 1 : WEIGHT_TO_G[u] ?? 1;
  const grams = n * factor;
  if (!Number.isFinite(grams)) return null;
  return trimTrail(grams.toFixed(6));
};

// Convert a volume (µL | ml | L) to millilitres. Returns null when the value is blank or invalid.
export const toCanonicalVolumeMl = (
  value: string | null | undefined,
  unit: string | null | undefined,
): string | null => {
  const n = parseOrNull(value);
  if (n === null) return null;
  const u = (unit ?? "").trim();
  const factor = u === "" ? 1 : VOLUME_TO_ML[u] ?? 1;
  const ml = n * factor;
  if (!Number.isFinite(ml)) return null;
  return trimTrail(ml.toFixed(6));
};
