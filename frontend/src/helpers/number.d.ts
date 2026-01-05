export {};

declare global {
  interface Number {
    toFixedNoRound(decimals: number): number;
  }
}