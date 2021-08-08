import { Color } from './color';
import { HexToCssConfiguration } from './hex-to-css-filter';

interface SPSAPayload {
  /** How many times the script was called to solve the color */
  called?: number;
  /** Percentage loss value for the generated filter */
  loss: number;
  /** Percentage loss per each color type organized in RGB: red, green, blue, h, s, l. */
  values: [number, number, number, number, number, number];
}

class Solver {
  private target: Color;
  private targetHSL: { h: number; s: number; l: number };
  private reusedColor: Color;
  private options: { acceptanceLossPercentage: number; maxChecks: number } & HexToCssConfiguration;

  constructor(target: Color, options: HexToCssConfiguration) {
    this.target = target;
    this.targetHSL = target.hsl();

    this.options = Object.assign(
      {},
      // Adding default values for options
      {
        acceptanceLossPercentage: 5,
        maxChecks: 15,
      },
      options,
    );

    // All the calcs done by the library to generate
    // a CSS Filter are based on the color `#000`
    // in this case, `rgb(0, 0, 0)`
    // Please make sure the background of the element
    // is `#000` for better performance
    // and color similarity.
    this.reusedColor = new Color(0, 0, 0);
  }

  /**
   * Returns the solved values for the
   *
   * @returns {(SPSAPayload & { filter: string; })}
   * @memberof Solver
   */
  solve(): SPSAPayload & {
    /** CSS filter generated based on the Hex color */
    filter: string;
  } {
    const result = this.solveNarrow(this.solveWide());
    return {
      values: result.values,
      called: result.called,
      loss: result.loss,
      filter: this.css(result.values),
    };
  }

  /**
   * Solve wide values based on the wide values for RGB and HSL values
   *
   * @private
   * @returns {SPSAPayload}
   * @memberof Solver
   */
  private solveWide(): SPSAPayload {
    const A = 5;
    const c = 15;
    // Wide values for RGB and HSL values
    // the values in the order: [`r`, `g`, `b`, `h`, `s`, `l`]
    const a = [60, 180, 18000, 600, 1.2, 1.2];

    let best = { loss: Infinity };
    let counter = 0;
    while (best.loss > this.options.acceptanceLossPercentage) {
      const initialFilterValues: SPSAPayload['values'] = [50, 20, 3750, 50, 100, 100];
      const result: SPSAPayload = this.spsa({
        A,
        a,
        c,
        values: initialFilterValues,
        // for wide values we should use the double of tries in
        // comparison of `solveNarrow()` method
        maxTriesInLoop: 1000,
      });

      if (result.loss < best.loss) {
        best = result;
      }

      counter += 1;
      if (counter >= this.options.maxChecks) {
        break;
      }
    }

    return Object.assign({}, best, { called: counter }) as SPSAPayload;
  }

  /**
   * Solve narrow values based on the wide values for the filter
   *
   * @private
   * @param {SPSAPayload} wide
   * @returns {SPSAPayload}
   * @memberof Solver
   */
  private solveNarrow(wide: SPSAPayload): SPSAPayload {
    const A = wide.loss;
    const c = 2;
    const A1 = A + 1;
    // Narrow values for RGB and HSL values
    // the values in the order: [`r`, `g`, `b`, `h`, `s`, `l`]
    const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
    return this.spsa({
      A,
      a,
      c,
      values: wide.values,
      maxTriesInLoop: 500,
      called: wide.called,
    });
  }

  /**
   * Returns final value based on the current filter order
   * to get the order, please check the returned value
   * in `css()` method
   *
   * @private
   * @param {number} value
   * @param {number} idx
   * @returns {number}
   * @memberof Solver
   */
  private fixValueByFilterIDX(value: number, idx: number): number {
    let max = 100;

    // Fixing max, minimum and value by filter
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
    }
    // Checking if value is below the minimum or above
    // the maximum allowed by filter
    else if (value < 0) {
      value = 0;
    } else if (value > max) {
      value = max;
    }
    return value;
  }

  private spsa({
    A,
    a,
    c,
    values,
    maxTriesInLoop = 500,
    called = 0,
  }: {
    A: number;
    a: number[];
    c: number;
    values: SPSAPayload['values'];
    maxTriesInLoop: number;
    called?: number;
  }): SPSAPayload {
    const alpha = 1;
    const gamma = 0.16666666666666666;

    let best = null;
    let bestLoss = Infinity;

    const deltas = new Array(6) as SPSAPayload['values'];
    const highArgs = new Array(6) as SPSAPayload['values'];
    const lowArgs = new Array(6) as SPSAPayload['values'];

    // Size of all CSS filters to be applied to get the correct color
    const filtersToBeAppliedSize = 6;

    for (let key = 0; key < maxTriesInLoop; key++) {
      const ck = c / Math.pow(key + 1, gamma);
      for (let i = 0; i < filtersToBeAppliedSize; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }

      const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
      for (let i = 0; i < filtersToBeAppliedSize; i++) {
        const g = (lossDiff / (2 * ck)) * deltas[i];
        const ak = a[i] / Math.pow(A + key + 1, alpha);
        values[i] = this.fixValueByFilterIDX(values[i] - ak * g, i);
      }

      const loss = this.loss(values);
      if (loss < bestLoss) {
        best = values.slice(0);
        bestLoss = loss;
      }
    }

    return { values: best, loss: bestLoss, called } as SPSAPayload;
  }

  /**
   * Checks how much is the loss for the filter in RGB and HSL colors
   *
   * @private
   * @param {SPSAPayload['values']} filters
   * @returns {number}
   * @memberof Solver
   */
  private loss(filters: SPSAPayload['values']): number {
    // Argument as an Array of percentages.
    const color = this.reusedColor;

    // Resetting the color to black in case
    // it was called more than once
    color.set(0, 0, 0);

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

  /**
   * Returns the CSS filter list for the received HEX color
   *
   * @private
   * @param {number[]} filters
   * @returns {string}
   * @memberof Solver
   */
  private css(filters: number[]): string {
    const formatCssFilterValueByMultiplier = (idx: number, multiplier = 1): number =>
      Math.round(filters[idx] * multiplier);

    return [
      `invert(${formatCssFilterValueByMultiplier(0)}%)`,
      `sepia(${formatCssFilterValueByMultiplier(1)}%)`,
      `saturate(${formatCssFilterValueByMultiplier(2)}%)`,
      `hue-rotate(${formatCssFilterValueByMultiplier(3, 3.6)}deg)`,
      `brightness(${formatCssFilterValueByMultiplier(4)}%)`,
      `contrast(${formatCssFilterValueByMultiplier(5)}%);`,
    ].join(' ');
  }
}

export { Solver };
