/* eslint-disable */

import Color from './color';

export default class Solver {
  target: Color;
  targetHSL: { h: number; s: number; l: number };
  reusedColor: Color;
  options: { acceptanceLossPercentage: number; maxChecks: number } = {
    acceptanceLossPercentage: 5,
    maxChecks: 15,
  };
  constructor(target: Color, options: { acceptanceLossPercentage?: number; maxChecks?: number } | null) {
    this.target = target;
    this.targetHSL = target.hsl();
    this.reusedColor = new Color(0, 0, 0);
    if (options) {
      this.options = Object.assign({}, this.options, options);
    }
  }

  solve() {
    const result = this.solveNarrow(this.solveWide());
    return {
      values: result.values,
      called: result.called,
      loss: result.loss,
      filter: this.css(result.values),
    };
  }

  solveWide(): any {
    const A = 5;
    const c = 15;
    const a = [60, 180, 18000, 600, 1.2, 1.2];

    let best = { loss: Infinity };
    let counter = 0;
    while (best.loss > this.options.acceptanceLossPercentage) {
      const initial = [50, 20, 3750, 50, 100, 100];
      const result = this.spsa(A, a, c, initial, 1000);
      if (result.loss < best.loss) {
        best = result;
      }

      counter += 1;
      if (counter >= this.options.maxChecks) {
        break;
      }
    }

    return Object.assign({}, best, { called: counter });
  }

  solveNarrow(wide: {
    values: [number, number, number, number, number, number];
    loss: number;
    called?: number;
  }): { values: [number, number, number, number, number, number]; loss: number; called?: number } {
    const A = wide.loss;
    const c = 2;
    const A1 = A + 1;
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return this.spsa(A, a, c, wide.values, 500, wide.called);
  }

  spsa(
    A: number,
    a: number[],
    c: number,
    // TODO: check this any
    values: any,
    iters: number,
    called: number = 0,
  ): { values: [number, number, number, number, number, number]; loss: number; called?: number } {
    const alpha = 1;
    const gamma = 0.16666666666666666;

    let best = null;
    let bestLoss = Infinity;

    const deltas = new Array(6);
    const highArgs = new Array(6);
    const lowArgs = new Array(6);

    function fix(value: number, idx: number): number {
      let max = 100;
      if (idx === 2 /* saturate */) {
        max = 7500;
      } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
        max = 200;
      }

      if (idx === 3 /* hue-rotate */) {
        if (value > max) {
          value %= max;
        } else if (value < 0) {
          value = max + (value % max);
        }
      } else if (value < 0) {
        value = 0;
      } else if (value > max) {
        value = max;
      }
      return value;
    }

    for (let k = 0; k < iters; k++) {
      const ck = c / Math.pow(k + 1, gamma);
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }

      const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
      for (let i = 0; i < 6; i++) {
        const g = (lossDiff / (2 * ck)) * deltas[i];
        const ak = a[i] / Math.pow(A + k + 1, alpha);
        values[i] = fix(values[i] - ak * g, i);
      }

      const loss = this.loss(values);
      if (loss < bestLoss) {
        best = values.slice(0);
        bestLoss = loss;
      }
    }

    return { values: best, loss: bestLoss, called };
  }

  loss(filters: number[]): number {
    // Argument as an Array of percentages.
    const color = this.reusedColor;
    color.set(255, 255, 255);

    color.invert(filters[0] / 100);
    color.sepia(filters[1] / 100);
    color.saturate(filters[2] / 100);
    color.hueRotate(filters[3] * 3.6);
    color.brightness(filters[4] / 100);
    color.contrast(filters[5] / 100);

    const colorHSL = color.hsl();

    return (
      Math.abs(color.r - this.target.r) +
      Math.abs(color.g - this.target.g) +
      Math.abs(color.b - this.target.b) +
      Math.abs(colorHSL.h - this.targetHSL.h) +
      Math.abs(colorHSL.s - this.targetHSL.s) +
      Math.abs(colorHSL.l - this.targetHSL.l)
    );
  }

  css(filters: number[]): string {
    const formatCssFilterValue = (idx: number, multiplier = 1) => {
      return Math.round(filters[idx] * multiplier);
    };

    return [
      `invert(${formatCssFilterValue(0)}%)`,
      `sepia(${formatCssFilterValue(1)}%)`,
      `saturate(${formatCssFilterValue(2)}%)`,
      `hue-rotate(${formatCssFilterValue(3, 3.6)}deg)`,
      `brightness(${formatCssFilterValue(4)}%)`,
      `contrast(${formatCssFilterValue(5)}%);`,
    ].join(' ');
  }
}
