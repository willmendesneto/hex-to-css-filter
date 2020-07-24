# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

## [3.1.2][] - 2020-07-24

### Fixed

- Fixing UMD bundle by using Rollup. Typescript was required in the package and one of the TS functions is required in the bundle.

## [3.1.1][] - 2020-06-29

### Updated

- Updating package dependencies and devDependencies to the latest

## [3.1.0][] - 2020-06-29

### Added

- Adding boolean `cache` field into the `hexToCSSFilter()` payload;
- Adding
  ynew configuration option: `forceFilterRecalculation`. It's a boolean value that forces recalculation for CSS filter generation. Default: `false`;

### Fixed

- Fixing color generation using `maxTriesInLoop` to get the optimal color for the CSS filter

## [3.0.1][] - 2020-06-28

### Updated

- Increasing `maxChecks` from 15 to 30
- Adding private methods in classes
- Improving internal types
- Removing `any` from codebase

## [3.0.0][] - 2020-06-25

### Fixed

- CSS Filter working properly when receives `#FFF` color;
- Fixed internal issue on `hexToRgb` method when receiving `#FFF` and `#000` colors

### Updated

- Breaking change: `HexToCssConfiguration` type now is using `acceptanceLossPercentage` instead of `acceptableLossPercentage`

```
-  acceptableLossPercentage?: number;
+  acceptanceLossPercentage?: number;
```

- Better types for internal methods
- Improving package documentation
- Adding documentation for consumers to use `#000` as a container background on `README.md`

## [2.0.4][] - 2020-04-24

### Fixed

- `Solver`: Changing default target color to be white or black, based on the
  given color. It solves the issue when a color is darker and the returned CSS filter resolutions is incorrect.

E.G. https://codepen.io/willmendesneto/pen/pOVGVe

With the issue
<img width="300" alt="Screen Shot 2020-04-24 at 3 30 48 pm" src="https://user-images.githubusercontent.com/1252570/80251321-cee4ed00-864b-11ea-9a19-3d9aa1b59341.png">

Without the issue
<img width="300" alt="Screen Shot 2020-04-24 at 3 31 42 pm" src="https://user-images.githubusercontent.com/1252570/80251331-d1474700-864b-11ea-81b4-9db409efce99.png">

## [2.0.3][] - 2020-04-24

### Fixed

- Fixing bundle size
- Setting the filter to white to take effect properly. Closes https://github.com/willmendesneto/hex-to-css-filter/issues/7

Since `Solver` is forcing the stored instance of `color` to be white in rgb, the brightness should be white as well. That
means the filter is based on white, so it needs to set the filter to white to take effect.

https://github.com/willmendesneto/hex-to-css-filter/blob/996d0c78ba275b7c16ae3d87821dd044276db563/src/solver.ts#L136

E.G.

```diff
- filter: invert(39%) sepia(91%) saturate(4225%) hue-rotate(162deg) brightness(95%) contrast(101%);
+ filter: brightness(0) invert(1) invert(39%) sepia(91%) saturate(4225%) hue-rotate(162deg) brightness(95%) contrast(101%);
```

## [2.0.2][] - 2020-04-09

### Updated

- Updating description
- Removing broken link

## [2.0.1][] - 2020-04-09

### Updated

- Bumped dependencies
- Upgraded NodeJS to 12.14.1
- Updated README.md with proper docs

### Fixed

- Fixed CircleCI pipeline
- Fixed Uglify issue on build task
- Fixed bundlesize task
- Fixed ESLint issue after upgrade

## [2.0.0][] - 2020-01-09

### Updated

- Migrating package to Typescript

BREAKING CHANGE:

To improve readability, these type definitions were renamed

- `Option` was renamed to `HexToCssConfiguration`;
- `ReturnValue` was renamed to `HexToCssResult`;

## [1.0.3][] - 2019-12-18

### Added

- Adding typescript types for package

## [1.0.2][] - 2018-09-14

### Updated

- Returning RGB as an array with red, green and blue values

## [1.0.1][] - 2018-09-13

### Added

- First version of the package
- Adding memory cache to store the computed result

### Updated

- Using `Object.assign()` to return the best match object
- Changing the color to check: from white to black

### Fixed

- Fixing editorconfig code style

[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/willmendesneto/hex-to-css-filter/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/willmendesneto/hex-to-css-filter/tree/v1.0.1
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/willmendesneto/hex-to-css-filter/tree/v1.0.3
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/willmendesneto/hex-to-css-filter/tree/v2.0.0
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v2.0.2...HEAD
[2.0.2]: https://github.com/willmendesneto/hex-to-css-filter/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/willmendesneto/hex-to-css-filter/tree/v2.0.1
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v2.0.3...HEAD
[2.0.3]: https://github.com/willmendesneto/hex-to-css-filter/tree/v2.0.3
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v2.0.4...HEAD
[2.0.4]: https://github.com/willmendesneto/hex-to-css-filter/tree/v2.0.4
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/willmendesneto/hex-to-css-filter/tree/v3.0.0
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v3.0.1...HEAD
[3.0.1]: https://github.com/willmendesneto/hex-to-css-filter/tree/v3.0.1
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v3.1.0...HEAD
[3.1.0]: https://github.com/willmendesneto/hex-to-css-filter/tree/v3.1.0
[unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v3.1.1...HEAD
[3.1.1]: https://github.com/willmendesneto/hex-to-css-filter/tree/v3.1.1


[Unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v3.1.2...HEAD
[3.1.2]: https://github.com/willmendesneto/hex-to-css-filter/tree/v3.1.2