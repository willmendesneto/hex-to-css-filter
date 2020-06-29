/* eslint-disable */
import Solver from './solver';
import Color from './color';

/**
 * Transform a CSS Color from Hexadecimal to RGB color
 *
 * @param {string} hex hexadecimal color
 * @returns {([number, number, number] | [])} array with the RGB colors or empty array
 */
const hexToRgb = (hex: string): [number, number, number] | [] => {
  if (hex.length === 4) {
    return [parseInt(`0x${hex[1]}${hex[1]}`), parseInt(`0x${hex[2]}${hex[2]}`), parseInt(`0x${hex[3]}${hex[3]}`)] as [
      number,
      number,
      number,
    ];
  } else if (hex.length === 7) {
    return [parseInt(`0x${hex[1]}${hex[2]}`), parseInt(`0x${hex[3]}${hex[4]}`), parseInt(`0x${hex[5]}${hex[6]}`)] as [
      number,
      number,
      number,
    ];
  }

  return [];
};

const isNumeric = (n: unknown): boolean => !isNaN(parseFloat(n as string)) && isFinite(n as number);

// Memory cache for the computed results to avoid multiple
// calculations for the same color
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
  /** Boolean that returns true if value was previously computed.
   * So that means the returned value is coming from the in-memory cached */
  cache: boolean;
}

export interface HexToCssConfiguration {
  /**
   * Acceptable color percentage to be lost.
   * @default 5
   */
  acceptanceLossPercentage?: number;
  /**
   * Maximum checks that needs to be done to return the best value.
   * @default 10
   */
  maxChecks?: number;
  /**
   * Boolean value that forces recalculation for CSS filter generation.
   * @default false
   */
  forceFilterRecalculation?: boolean;
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

  if (results[colorValue] && !opts.forceFilterRecalculation) {
    return Object.assign({}, results[colorValue], { cache: true }) as HexToCssResult;
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
    maxChecks: 30,
    forceFilterRecalculation: false,
  };

  const HexToCssConfiguration: HexToCssConfiguration = Object.assign({}, defaultHexToCssConfiguration, opts);

  const solver = new Solver(color, HexToCssConfiguration);
  results[colorValue] = Object.assign({}, solver.solve(), {
    hex: colorValue,
    rgb: [red, green, blue],
    cache: false,
  }) as HexToCssResult;

  return results[colorValue] as HexToCssResult;
};

export { hexToCSSFilter };
