# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

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


[Unreleased]: https://github.com/willmendesneto/hex-to-css-filter/compare/v2.0.2...HEAD
[2.0.2]: https://github.com/willmendesneto/hex-to-css-filter/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/willmendesneto/hex-to-css-filter/tree/v2.0.1