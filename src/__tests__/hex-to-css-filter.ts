import { clearCache } from '../hex-to-css-filter';
import { hexToCSSFilter, HexToCssConfiguration } from '../index';

describe('hexToCSSFilter', () => {
  beforeEach(() => clearCache());

  it('loss should NOT be more than the default acceptance loss percentage', () => {
    expect(hexToCSSFilter('#00a4d6').loss <= 10).toBe(true);
  });

  it('should clear all memory cache if `clearCache` is called with no arguments', () => {
    const [firstResult, secondResult, thirdResult, forthResult] = [
      hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#FF0000', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#FF0000', { forceFilterRecalculation: false } as HexToCssConfiguration),
    ].map(({ cache: _cache, ...rest }) => rest);

    expect(firstResult).toEqual(secondResult);
    expect(thirdResult).toEqual(forthResult);

    clearCache();

    const [fifthResult, sixthResult] = [
      hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#FF0000', { forceFilterRecalculation: false } as HexToCssConfiguration),
    ].map(({ cache: _cache, ...rest }) => rest);

    expect(fifthResult).not.toEqual(firstResult);
    expect(fifthResult).not.toEqual(secondResult);
    expect(sixthResult).not.toEqual(thirdResult);
    expect(sixthResult).not.toEqual(forthResult);
  });

  it('should keep memory cache as it is if `clearCache` receives value that does NOT exist in the cache', () => {
    const [firstResult, secondResult] = [
      hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration),
    ].map(({ cache: _cache, ...rest }) => rest);

    expect(firstResult).toEqual(secondResult);

    clearCache('#FF0000');

    const [thirdResult] = [hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration)].map(
      ({ cache: _cache, ...rest }) => rest,
    );

    expect(firstResult).toEqual(secondResult);
    expect(firstResult).toEqual(thirdResult);
  });

  it('should clear memory cache only for received argument if `clearCache` is called with arguments', () => {
    const [firstResult, secondResult, thirdResult, forthResult] = [
      hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#FF0000', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#FF0000', { forceFilterRecalculation: false } as HexToCssConfiguration),
    ].map(({ cache: _cache, ...rest }) => rest);

    expect(firstResult).toEqual(secondResult);
    expect(thirdResult).toEqual(forthResult);

    clearCache('#24639C');

    const [fifthResult, sixthResult] = [
      hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration),
      hexToCSSFilter('#FF0000', { forceFilterRecalculation: false } as HexToCssConfiguration),
    ].map(({ cache: _cache, ...rest }) => rest);

    expect(fifthResult).not.toEqual(firstResult);
    expect(fifthResult).not.toEqual(secondResult);
    expect(sixthResult).toEqual(thirdResult);
    expect(sixthResult).toEqual(forthResult);
  });

  it('should use cache  if `forceFilterRecalculation` is falsy via method configuration or is not configured', () => {
    expect(hexToCSSFilter('#24639C').cache).toBe(false);
    expect(hexToCSSFilter('#24639C', { forceFilterRecalculation: false } as HexToCssConfiguration).cache).toBe(true);
    expect(hexToCSSFilter('#24639C').cache).toBe(true);
  });

  it('should NOT use cache if `forceFilterRecalculation` is passed as `true` via method configuration', () => {
    expect(hexToCSSFilter('#F6D55C', { forceFilterRecalculation: true } as HexToCssConfiguration).cache).toBe(false);
    expect(hexToCSSFilter('#F6D55C', { forceFilterRecalculation: true } as HexToCssConfiguration).cache).toBe(false);
    expect(hexToCSSFilter('#F6D55C', { forceFilterRecalculation: true } as HexToCssConfiguration).cache).toBe(false);
  });

  it('loss should NOT check more than the default maximum value to check', () => {
    expect(hexToCSSFilter('#00a4d6').called <= 10).toBe(true);
  });

  it('should return RGB colors as list of values', () => {
    expect(hexToCSSFilter('#FF0000').rgb).toEqual([255, 0, 0]);
  });

  it('should work if receives a short HEX color', () => {
    expect(hexToCSSFilter('#000').hex).toBe('#000');
  });

  it('should return the same value as received in `hex` attribute', () => {
    expect(hexToCSSFilter('#FF0000').hex).toBe('#FF0000');
  });

  it('should throw an error if it receives an invalid color', () => {
    expect(() => hexToCSSFilter('invalid')).toThrowError(/Color value should be in HEX format/);
    // invalid color with more than 7 characters (one of the rules to get full HEX colors #000000)
    expect(() => hexToCSSFilter('invalid-value')).toThrowError(/Color value should be in HEX format/);
  });

  it('should return an object with the given values', () => {
    expect(Object.keys(hexToCSSFilter('#00a4d6')).sort()).toEqual([
      'cache',
      'called',
      'filter',
      'hex',
      'loss',
      'rgb',
      'values',
    ]);
  });

  it('should return an object with the given CSS Filter values', () => {
    const { filter } = hexToCSSFilter('#00a4d6');
    expect(filter.split(' ').length).toEqual(6);
    expect(filter.includes('invert')).toBe(true);
    expect(filter.includes('sepia')).toBe(true);
    expect(filter.includes('saturate')).toBe(true);
    expect(filter.includes('hue-rotate')).toBe(true);
    expect(filter.includes('brightness')).toBe(true);
    expect(filter.includes('contrast')).toBe(true);
    expect(filter.includes(';')).toBe(false);
  });

  describe('When it receives options', () => {
    it('loss should NOT be more than the given acceptance loss percentage OR should be more AND was called at allowed maxChecks', () => {
      const res = hexToCSSFilter('#ED553C', { acceptanceLossPercentage: 1, maxChecks: 5 } as HexToCssConfiguration);
      expect(res.loss <= 1 || (res.loss > 1 && res.called === 5)).toBe(true);
    });

    it('loss should NOT check more than the given maximum value to check', () => {
      expect(
        hexToCSSFilter('#F6C6CE', { acceptanceLossPercentage: 0.01, maxChecks: 1 } as HexToCssConfiguration).called < 2,
      ).toBe(true);
    });
  });
});
