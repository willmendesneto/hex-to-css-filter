interface HSLData {
  h: number;
  s: number;
  l: number;
}

/**
 * Normalize the value to follow the min and max for RGB colors
 * min: 0
 * max: 255
 *
 * @param {number} value
 * @returns {number}
 */
const clamp = (value: number): number => Math.min(Math.max(value, 0), 255);

class Color {
  r = 0;
  g = 0;
  b = 0;

  constructor(r: number, g: number, b: number) {
    this.set(r, g, b);
  }

  set(r: number, g: number, b: number): void {
    this.r = clamp(r);
    this.g = clamp(g);
    this.b = clamp(b);
  }

  /**
   * Applying cals to get CSS filter for hue-rotate
   *
   * @param {number} angle
   * @memberof Color
   */
  hueRotate(angle: number): void {
    angle = (angle / 180) * Math.PI;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    this.multiply([
      0.213 + cos * 0.787 - sin * 0.213,
      0.715 - cos * 0.715 - sin * 0.715,
      0.072 - cos * 0.072 + sin * 0.928,
      0.213 - cos * 0.213 + sin * 0.143,
      0.715 + cos * 0.285 + sin * 0.14,
      0.072 - cos * 0.072 - sin * 0.283,
      0.213 - cos * 0.213 - sin * 0.787,
      0.715 - cos * 0.715 + sin * 0.715,
      0.072 + cos * 0.928 + sin * 0.072,
    ]);
  }

  /**
   * Applying cals to get CSS filter for sepia
   *
   * @param {number} value
   * @memberof Color
   */
  sepia(value: number): void {
    this.multiply([
      0.393 + 0.607 * (1 - value),
      0.769 - 0.769 * (1 - value),
      0.189 - 0.189 * (1 - value),
      0.349 - 0.349 * (1 - value),
      0.686 + 0.314 * (1 - value),
      0.168 - 0.168 * (1 - value),
      0.272 - 0.272 * (1 - value),
      0.534 - 0.534 * (1 - value),
      0.131 + 0.869 * (1 - value),
    ]);
  }

  /**
   * Applying cals to get CSS filter for saturate
   *
   * @param {number} value
   * @memberof Color
   */
  saturate(value: number): void {
    this.multiply([
      0.213 + 0.787 * value,
      0.715 - 0.715 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 + 0.285 * value,
      0.072 - 0.072 * value,
      0.213 - 0.213 * value,
      0.715 - 0.715 * value,
      0.072 + 0.928 * value,
    ]);
  }

  private multiply(matrix: number[]): void {
    // These values are needed. It's correct because the returned values will change
    const newR = clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
    const newG = clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
    const newB = clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
    this.r = newR;
    this.g = newG;
    this.b = newB;
  }

  /**
   * Applying cals to get CSS filter for brightness and contrast
   *
   * @param {number} slope
   * @param {number} [intercept=0]
   * @memberof Color
   */
  linear(slope: number, intercept = 0): void {
    this.r = clamp(this.r * slope + intercept * 255);
    this.g = clamp(this.g * slope + intercept * 255);
    this.b = clamp(this.b * slope + intercept * 255);
  }

  /**
   * Applying cals to get CSS filter for invert
   *
   * @param {number} value
   * @memberof Color
   */
  invert(value: number): void {
    this.r = clamp((value + (this.r / 255) * (1 - 2 * value)) * 255);
    this.g = clamp((value + (this.g / 255) * (1 - 2 * value)) * 255);
    this.b = clamp((value + (this.b / 255) * (1 - 2 * value)) * 255);
  }

  /**
   * transform RGB into HSL values
   *
   * @returns {HSLData}
   * @memberof Color
   */
  hsl(): HSLData {
    const red = this.r / 255;
    const green = this.g / 255;
    const blue = this.b / 255;

    // find greatest and smallest channel values
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    let hue = 0;
    const lightness = (max + min) / 2;

    // If min and max have the same values, it means
    // the given color is achromatic
    if (max === min) {
      return {
        h: 0,
        s: 0,
        l: lightness * 100,
      };
    }

    // Adding delta value of greatest and smallest channel values
    const delta = max - min;

    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === red) {
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else if (max === blue) {
      hue = (red - green) / delta + 4;
    }

    hue /= 6;

    return {
      h: hue * 100,
      s: saturation * 100,
      l: lightness * 100,
    };
  }
}

export { Color };
