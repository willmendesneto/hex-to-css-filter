const assert = require('assert');
const hexToCSSFilter = require('./../index');

describe('hexToCSSFilter', () => {

  it('loss should NOT be more than the default acceptance loss percentage', () => {
    assert.equal(
      hexToCSSFilter('#00a4d6').loss <= 10,
      true
    );
  });

  it('loss should NOT check more than the default maximum value to check', () => {
    assert.equal(
      hexToCSSFilter('#00a4d6').called <= 10,
      true
    );
  });

  it('should return RGB colors as list of values', () => {
    assert.deepEqual(
      hexToCSSFilter('#FF0000').rgb,
      [ 255, 0, 0],
    );
  });

  it('loss should NOT check more than the default maximum value to check', () => {
    assert.equal(
      hexToCSSFilter('#FF0000').hex,
      '#FF0000'
    );
  });

  it('should throw an error if it receives an invalid color', () => {
    assert.throws(
      () => hexToCSSFilter('invalid'),
      /Color value should be in HEX format/
    );
  });

  it('should return an object with the given values', () => {
    assert.deepEqual(
      Object.keys(hexToCSSFilter('#00a4d6')).sort(),
      ['called', 'filter', 'hex', 'loss', 'rgb', 'values']
    );
  });

  it('should return an object with the given values', () => {
    const { filter } = hexToCSSFilter('#00a4d6');
    assert.equal(filter.includes('invert'), true);
    assert.equal(filter.includes('sepia'), true);
    assert.equal(filter.includes('saturate'), true);
    assert.equal(filter.includes('hue-rotate'), true);
    assert.equal(filter.includes('brightness'), true);
    assert.equal(filter.includes('contrast'), true);
  });

  describe('When it receives options', () => {

    it('loss should NOT be more than the given acceptance loss percentage', () => {
      assert.equal(
        hexToCSSFilter('#00a4d6', { acceptanceLossPercentage: 1 }).loss <= 1,
        true
      );
    });

    it('loss should NOT check more than the given maximum value to check', () => {
      assert.equal(
        hexToCSSFilter('#00a4d6', { acceptanceLossPercentage: 1, maxChecks: 5 }).called <= 5,
        true
      );
    });
  })
});
