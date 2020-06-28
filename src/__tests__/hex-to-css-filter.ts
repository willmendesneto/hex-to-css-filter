import { hexToCSSFilter, HexToCssConfiguration } from '../index';

describe('hexToCSSFilter', () => {
  it('loss should NOT be more than the default acceptance loss percentage', () => {
    expect(hexToCSSFilter('#00a4d6').loss <= 10).toBe(true);
  });

  it('loss should NOT check more than the default maximum value to check', () => {
    expect(hexToCSSFilter('#00a4d6').called <= 10).toBe(true);
  });

  it('should return RGB colors as list of values', () => {
    expect(hexToCSSFilter('#FF0000').rgb).toEqual([255, 0, 0]);
  });

  it('should return the same value as received in `hex` attribute', () => {
    expect(hexToCSSFilter('#FF0000').hex).toBe('#FF0000');
  });

  it('should throw an error if it receives an invalid color', () => {
    expect(() => hexToCSSFilter('invalid')).toThrowError(/Color value should be in HEX format/);
  });

  it('should return an object with the given values', () => {
    expect(Object.keys(hexToCSSFilter('#00a4d6')).sort()).toEqual(['called', 'filter', 'hex', 'loss', 'rgb', 'values']);
  });

  it('should return an object with the given values', () => {
    const { filter } = hexToCSSFilter('#00a4d6');
    expect(filter.includes('invert')).toBe(true);
    expect(filter.includes('sepia')).toBe(true);
    expect(filter.includes('saturate')).toBe(true);
    expect(filter.includes('hue-rotate')).toBe(true);
    expect(filter.includes('brightness')).toBe(true);
    expect(filter.includes('contrast')).toBe(true);
  });

  describe('When it receives options', () => {
    it('loss should NOT be more than the given acceptance loss percentage OR should be more AND was called at allowed maxChecks', () => {
      const res = hexToCSSFilter('#00a4d6', { acceptanceLossPercentage: 1, maxChecks: 5 } as HexToCssConfiguration);
      expect(res.loss <= 1 || (res.loss > 1 && res.called === 5)).toBe(true);
    });

    it('loss should NOT check more than the given maximum value to check', () => {
      expect(
        hexToCSSFilter('#00a4d6', { acceptanceLossPercentage: 0.01, maxChecks: 1 } as HexToCssConfiguration).called <=
          5,
      ).toBe(true);
    });
  });
});
