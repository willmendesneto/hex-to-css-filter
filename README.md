# hex-to-css-filter

[![Greenkeeper badge](https://badges.greenkeeper.io/willmendesneto/hex-to-css-filter.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/badge/stackblitz-online-orange.svg)](https://stackblitz.com/edit/hex-to-css-filter-playground)

[![npm version](https://badge.fury.io/js/hex-to-css-filter.svg)](http://badge.fury.io/js/hex-to-css-filter) [![npm downloads](https://img.shields.io/npm/dm/hex-to-css-filter.svg)](https://npmjs.org/hex-to-css-filter)
[![MIT License](https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square)](LICENSE)

[![Build Status](https://circleci.com/gh/willmendesneto/hex-to-css-filter.svg?style=shield)](https://circleci.com/gh/willmendesneto/hex-to-css-filter)
[![Coverage Status](https://coveralls.io/repos/willmendesneto/hex-to-css-filter/badge.svg?branch=master)](https://coveralls.io/r/willmendesneto/hex-to-css-filter?branch=master)
[![Dependency Status](https://david-dm.org/willmendesneto/hex-to-css-filter.svg)](https://david-dm.org/willmendesneto/hex-to-css-filter)

[![NPM](https://nodei.co/npm/hex-to-css-filter.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/hex-to-css-filter)
[![NPM](https://nodei.co/npm-dl/hex-to-css-filter.png?height=3&months=3)](https://npmjs.org/hex-to-css-filter)

> Easy way to generate colors from HEX to CSS Filters 😎

## Contributing

Please check our [contributing.md](https://github.com/willmendesneto/hex-to-css-filter/blob/master/contributing.md) to know more about setup and how to contribute.

## Setup and installation

Make sure that you are using the NodeJS version is the same as `.nvmrc` file version. If you don't have this version please use a version manager such as `nvm` or `n` to manage your local nodejs versions.

> Please make sure that you are using NodeJS version 6.10.2

Assuming that you are using `nvm`, please run the commands inside this folder:

```bash
$ nvm install $(cat .nvmrc); # install required nodejs version
$ nvm use $(cat .nvmrc); # use nodejs version
```

In Windows, please install NodeJS using one of these options:

Via `NVM Windows` package: Dowload via [this link](https://github.com/coreybutler/nvm-windows). After that, run the commands:

```bash
$ nvm install $(cat .nvmrc); # install required nodejs version
$ nvm use $(cat .nvmrc); # use nodejs version
```

Via Chocolatey:

```bash
$ choco install nodejs.install -version 6.10.2
```

### Install yarn

We use `yarn` as our package manager instead of `npm`

[Install it following these steps](https://yarnpkg.com/lang/en/docs/install/#mac-tab)

After that, just navigate to your local repository and run

```bash
$ yarn install
```

## Demo

Try out our [demo on Stackblitz](https://hex-to-css-filter-playground.stackblitz.io)!

![Perf marks in action](./images/hex-to-css-filter-in-action.gif)

### Run the tests

```bash
$ yarn test # run the tests
```

### Run the build

```bash
$ yarn build # run the tests
```

### Run the bundlesize check

```bash
$ yarn bundlesize # run the tests
```

### Run the code lint

```bash
$ yarn lint # run the tests
```

## Usage

### Important!!!!

_Please make sure the background of the element is `#000` for better performance and color similarity_.

The reason for this is because all the calcs done by the library to generate a CSS Filter are based on the color `#000`

### Using default options

```js
import { hexToCSSFilter } from 'hex-to-css-filter';

const cssFilter = hexToCSSFilter('#00a4d6');
console.log(cssFilter);
```

### Overriding default options

You can override the default options by passing a second parameter into `hexToCSSFilter` method. You can also use `HexToCssConfiguration` for type support on it.

```js
import { hexToCSSFilter, HexToCssConfiguration } from 'hex-to-css-filter';

const config: HexToCssConfiguration = {
  acceptanceLossPercentage: 1,
  maxChecks: 10,
};

const cssFilter = hexToCSSFilter('#00a4d6', config);
console.log(cssFilter);

// Calling different colors to create CSS Filters
[
  hexToCSSFilter('#FFF'),
  hexToCSSFilter('#000'),
  hexToCSSFilter('#802e1c'),
  hexToCSSFilter('#00a4d6'),
  hexToCSSFilter('#FF0000'),
  hexToCSSFilter('#173F5E'),
  hexToCSSFilter('#24639C'),
  hexToCSSFilter('#3CAEA4'),
  hexToCSSFilter('#F6D55C'),
  hexToCSSFilter('#ED553C'),
].forEach(cssFilter => {
  console.log(`\n${cssFilter.hex}-[${cssFilter.rgb}]: ${cssFilter.filter}`);
});
```

It returns an object with the values:

- `cache`: returns a boolean to confirm if value was previously computed and is coming from local memory cache or not;
- `called`: how many times the script was called to solve the color;
- `filter`: CSS filter generated based on the HEX color;
- `hex`: the received color;
- `loss`: percentage loss value for the generated filter;
- `rgb`: HEX color in RGB;
- `values`: percentage loss per each color type organized in RGB: `red`, `green`, `blue`, `h`, `s`, `l`. Used for debug purposes - if needed;

### Options

- `acceptanceLossPercentage`: Acceptable color percentage to be lost. Default: `5`;
- `maxChecks`: Maximum checks that needs to be done to return the best value. Default: `10`;
- `forceFilterRecalculation`: Boolean value that forces recalculation for CSS filter generation. Default: `false`;

## Publish

this project is using `np` package to publish, which makes things straightforward. EX: `np <patch|minor|major>`

> For more details, [please check np package on npmjs.com](https://www.npmjs.com/package/np)

## Author

**Wilson Mendes (willmendesneto)**

- <https://twitter.com/willmendesneto>
- <http://github.com/willmendesneto>
