export class NumberUtils {

  static init(): void {
    if (!Number.prototype.toFixedNoRound) {
      Number.prototype.toFixedNoRound = function (decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.trunc(this.valueOf() * factor) / factor;
      };
    }
  }
}
