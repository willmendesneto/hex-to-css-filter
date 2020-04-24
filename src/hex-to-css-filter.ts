/* eslint-disable */
import Solver from './solver';
import Color from './color';

const hexToRgb = (hex: string): [number, number, number] | [] => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const expandShorthandHexToFullForm = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(expandShorthandHexToFullForm, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [];
};

const isNumeric = (n: any): boolean => !isNaN(parseFloat(n)) && isFinite(n);

const results: {
  [k: string]: HexToCssResult;
} = {};

export interface HexToCssResult {
  /** How many times the script was called to solve the color */
  called: number;
  /** CSS filter generated based on the Hex color */
  filter: string;
  /** The received color */
  hex: string;
  /** Percentage loss value for the generated filter */
  loss: number;
  /** Hex color in RGB */
  rgb: [number, number, number];
  /** Percentage loss per each color type organized in RGB: red, green, blue, h, s, l. */
  values: [number, number, number, number, number, number];
}

export interface HexToCssConfiguration {
  /**
   * Acceptable color percentage to be lost.
   * @default 5
   */
  acceptableLossPercentage?: number;
  /**
   * Maximum checks that needs to be done to return the best value.
   * @default 10
   */
  maxChecks?: number;
}

/**
 * A function that transforms a HEX color into CSS filters
 *
 * @param colorValue string hexadecimal color
 * @param opts HexToCssConfiguration function configuration
 *
 */
const hexToCSSFilter = (colorValue: string, opts: HexToCssConfiguration = {}): HexToCssResult => {
  let red;
  let green;
  let blue;

  if (results[colorValue]) {
    return results[colorValue] as HexToCssResult;
  }

  let color: Color;
  try {
    [red, green, blue] = hexToRgb(colorValue);
    if (!isNumeric(red) || !isNumeric(green) || !isNumeric(blue)) {
      throw new Error(`hextToRgb returned an invalid value for '${colorValue}'`);
    }

    color = new Color(Number(red), Number(green), Number(blue));
  } catch (error) {
    throw new Error(`Color value should be in HEX format. ${error}`);
  }

  const defaultHexToCssConfiguration = {
    acceptanceLossPercentage: 5,
    maxChecks: 15,
  };

  const HexToCssConfiguration = Object.assign({}, defaultHexToCssConfiguration, opts);

  const solver = new Solver(color, HexToCssConfiguration);
  results[colorValue] = Object.assign({}, solver.solve(), {
    hex: colorValue,
    rgb: [red, green, blue],
  }) as HexToCssResult;

  return results[colorValue] as HexToCssResult;
};

export { hexToCSSFilter };
