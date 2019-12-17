declare module 'hex-to-css-filter' {
  export interface Options {
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

  export interface ReturnValue {
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

  function hexToCSSFilter(colorValue: string, options?: Options): ReturnValue;

  export default hexToCSSFilter;
}

