# hex-to-css-filter

[![Greenkeeper badge](https://badges.greenkeeper.io/willmendesneto/hex-to-css-filter.svg)](https://greenkeeper.io/)

[![Build Status](https://circleci.com/gh/willmendesneto/hex-to-css-filter.svg?style=shield)](https://circleci.com/gh/willmendesneto/hex-to-css-filter)
[![Coverage Status](https://coveralls.io/repos/github/willmendesneto/hex-to-css-filter/badge.svg?branch=master)](https://coveralls.io/github/willmendesneto/hex-to-css-filter?branch=master)

> Easy way to generate colors from HEX to CSS Filters 😎

[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]


A script to transform a HEX color into CSS filters.

## Usage

### Using default options
```js
const hexToCSSFilter = require('hex-to-css-filter');

const cssFilter = hexToCSSFilter('#00a4d6')

console.log(cssFilter);
```

### Overriding default options
```js
const hexToCSSFilter = require('hex-to-css-filter');

const cssFilter = hexToCSSFilter('#00a4d6', {
  acceptanceLossPercentage: 1,
  maxChecks: 10,
});

console.log(cssFilter);
```

It returns an object with the values: 

- 'called': how many times the script was called to solve the color;
- 'filter': CSS filter generated based on the HEX color;
- 'hex': the received color;
- 'loss': percentage loss value for the generated filter;
- 'rgb': HEX color in RGB;
- 'values': percentage loss per each color type organized in RGB: red, green, blue, h, s, l. Used for debug purposes;


### Options

- `acceptanceLossPercentage`: Acceptable color percentage to be lost. Default: `5`;
- `maxChecks`: Maximum checks that needs to be done to return the best value. Default: `10`;


## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>


[license-badge]: https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square
[license]: https://github.com/willmendesneto/hex-to-css-filter/blob/master/LICENSE

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com

[github-watch-badge]: https://img.shields.io/github/watchers/willmendesneto/hex-to-css-filter.svg?style=social
[github-watch]: https://github.com/willmendesneto/hex-to-css-filter/watchers

[github-star-badge]: https://img.shields.io/github/stars/willmendesneto/hex-to-css-filter.svg?style=social
[github-star]: https://github.com/willmendesneto/hex-to-css-filter/stargazers

[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20hex-to-css-filter%20by%20@willmendesneto%20https://goo.gl/sqZ8dh%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/willmendesneto/hex-to-css-filter.svg?style=social
