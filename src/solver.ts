import { Color } from './color';

type FilterValues = [number, number, number, number, number, number];

interface SPSAPayload {
  /** How many times the script was called to solve the color */
  called: number;
  /** Percentage loss value for the generated filter */
  loss: number;
  /** Percentage loss per each color type organized in RGB: red, green, blue, h, s, l. */
  values: FilterValues;
}

interface SolverOptions {
  acceptanceLossPercentage: number;
  maxChecks: number;
}

// Maximum value allowed per filter, in the order applied by `css()`:
// invert, sepia, saturate, hue-rotate, brightness, contrast
const MAX_FILTER_VALUES = [100, 100, 7500, 100, 200, 200];

/**
 * Returns final value based on the current filter order.
 * Hue rotation wraps around, other filters are clamped between 0 and its max value
 *
 * @param {number} value
 * @param {number} idx
 * @returns {number}
 */
const fixValueByFilterIDX = (value: number, idx: number): number => {
  const max = MAX_FILTER_VALUES[idx];

  if (idx === 3 /* hue-rotate */) {
    if (value > max) {
      return value % max;
    }
    return value < 0 ? max + (value % max) : value;
  }

  return Math.min(Math.max(value, 0), max);
};

/**
 * Returns the CSS filter list for the given filter values
 *
 * @param {FilterValues} filters
 * @returns {string}
 */
const css = ([invert, sepia, saturate, hueRotate, brightness, contrast]: FilterValues): string =>
  `invert(${Math.round(invert)}%) sepia(${Math.round(sepia)}%) saturate(${Math.round(saturate)}%) ` +
  `hue-rotate(${Math.round(hueRotate * 3.6)}deg) brightness(${Math.round(brightness)}%) contrast(${Math.round(contrast)}%)`;

/**
 * Solves the CSS filters needed to get the target color
 *
 * @param {Color} target
 * @param {SolverOptions} options
 * @returns {(SPSAPayload & { filter: string })}
 */
export const solve = (target: Color, options: SolverOptions): SPSAPayload & { filter: string } => {
  const targetHSL = target.hsl();

  // All the calcs done by the library to generate
  // a CSS Filter are based on the color `#000`
  // in this case, `rgb(0, 0, 0)`
  // Please make sure the background of the element
  // is `#000` for better performance
  // and color similarity.
  const color = new Color(0, 0, 0);

  /**
   * Checks how much is the loss for the filter in RGB and HSL colors
   */
  const loss = (filters: FilterValues): number => {
    // Resetting the color to black in case
    // it was called more than once
    color.set(0, 0, 0);

    color.invert(filters[0] / 100);
    color.sepia(filters[1] / 100);
    color.saturate(filters[2] / 100);
    color.hueRotate(filters[3] * 3.6);
    // brightness
    color.linear(filters[4] / 100);
    // contrast
    const contrast = filters[5] / 100;
    color.linear(contrast, -(0.5 * contrast) + 0.5);

    const colorHSL = color.hsl();

    return (
      Math.abs(color.r - target.r) +
      Math.abs(color.g - target.g) +
      Math.abs(color.b - target.b) +
      Math.abs(colorHSL.h - targetHSL.h) +
      Math.abs(colorHSL.s - targetHSL.s) +
      Math.abs(colorHSL.l - targetHSL.l)
    );
  };

  const spsa = (A: number, a: number[], c: number, values: FilterValues, maxTriesInLoop: number, called: number) => {
    const alpha = 1;
    const gamma = 0.16666666666666666;

    let best = values;
    let bestLoss = Infinity;

    const deltas = new Array(6) as FilterValues;
    const highArgs = new Array(6) as FilterValues;
    const lowArgs = new Array(6) as FilterValues;

    for (let key = 0; key < maxTriesInLoop; key++) {
      const ck = c / Math.pow(key + 1, gamma);
      for (let i = 0; i < 6; i++) {
        deltas[i] = Math.random() > 0.5 ? 1 : -1;
        highArgs[i] = values[i] + ck * deltas[i];
        lowArgs[i] = values[i] - ck * deltas[i];
      }

      const lossDiff = loss(highArgs) - loss(lowArgs);
      for (let i = 0; i < 6; i++) {
        const g = (lossDiff / (2 * ck)) * deltas[i];
        const ak = a[i] / Math.pow(A + key + 1, alpha);
        values[i] = fixValueByFilterIDX(values[i] - ak * g, i);
      }

      const currentLoss = loss(values);
      if (currentLoss < bestLoss) {
        best = values.slice(0) as FilterValues;
        bestLoss = currentLoss;
      }
    }

    return { values: best, called, loss: bestLoss };
  };

  // Solve wide values based on the wide values for RGB and HSL values
  let wide = { loss: Infinity } as SPSAPayload;
  let counter = 0;
  while (wide.loss > options.acceptanceLossPercentage) {
    // Wide values for RGB and HSL values
    // the values in the order: [`r`, `g`, `b`, `h`, `s`, `l`].
    // For wide values we should use the double of tries in
    // comparison of narrow values
    const result = spsa(5, [60, 180, 18000, 600, 1.2, 1.2], 15, [50, 20, 3750, 50, 100, 100], 1000, 0);

    if (result.loss < wide.loss) {
      wide = result;
    }

    counter += 1;
    if (counter >= options.maxChecks) {
      break;
    }
  }

  // Solve narrow values based on the wide values for the filter
  const A1 = wide.loss + 1;
  const narrow = spsa(
    wide.loss,
    [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1],
    2,
    wide.values,
    500,
    counter,
  );

  return { ...narrow, filter: css(narrow.values) };
};
