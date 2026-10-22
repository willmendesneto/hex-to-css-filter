import { Color } from './color';
import { solve } from './solver';

/**
 * Transform a CSS Color from Hexadecimal to RGB color
 *
 * @param {string} hex hexadecimal color
 * @returns {number[]} array with the RGB colors or empty array
 */
const hexToRgb = (hex: string): number[] => {
  // Expanding short HEX colors. E.G. `#09f` -> `#0099ff`
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  return hex.length === 7 ? [1, 3, 5].map(i => parseInt(`0x${hex.slice(i, i + 2)}`)) : [];
};

// Memory cache for the computed results to avoid multiple
// calculations for the same color
const results = new Map<string, HexToCssResult>();

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
   * @default 30
   */
  maxChecks?: number;
  /**
   * Boolean value that forces recalculation for CSS filter generation.
   * @default false
   */
  forceFilterRecalculation?: boolean;
}

// Returning copies of the arrays, so that consumers changing
// the returned values won't change the cached results
const copyResult = (result: HexToCssResult, cache: boolean): HexToCssResult => ({
  ...result,
  rgb: [...result.rgb],
  values: [...result.values],
  cache,
});

/**
 * A function that transforms a HEX color into CSS filters
 *
 * @param colorValue string hexadecimal color
 * @param opts HexToCssConfiguration function configuration
 *
 */
export const hexToCSSFilter = (colorValue: string, opts: HexToCssConfiguration = {}): HexToCssResult => {
  const cachedResult = results.get(colorValue);
  if (cachedResult && !opts.forceFilterRecalculation) {
    return copyResult(cachedResult, true);
  }

  const rgb = hexToRgb(colorValue);
  if (rgb.length !== 3 || rgb.some(isNaN)) {
    throw new Error(`Color value should be in HEX format. hextToRgb returned an invalid value for '${colorValue}'`);
  }

  const [red, green, blue] = rgb;
  const result: HexToCssResult = {
    // `HexToCssConfiguration` Defaults.
    // Using `??` so options explicitly passed as `undefined` don't override the defaults
    ...solve(new Color(red, green, blue), {
      acceptanceLossPercentage: opts.acceptanceLossPercentage ?? 5,
      maxChecks: opts.maxChecks ?? 30,
    }),
    hex: colorValue,
    rgb: [red, green, blue],
    cache: false,
  };
  results.set(colorValue, result);

  return copyResult(result, false);
};

/**
 * A function that clears cached results
 *
 * @param  {string} key? HEX string value passed previously `#24639C`. If not passed, it clears all cached results
 * @returns void
 */
export const clearCache = (key?: string): void => {
  if (!key) {
    results.clear();
  } else {
    results.delete(key);
  }
};
