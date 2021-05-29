# Updates Log

All notable updates to this project will be documented in this file. See [SemVer 2.0](https://semver.org/) for commit guidelines.

## [3.0.3] - 2021-29-05

### Changed

- Make `load` synchronous due to `import`/`require` racing condition
- Remove support for importing a `.(m)js` config

## [3.0.2] - 2021-29-05

### Changed

- Fix invalid `log` import in `load` file

## [3.0.1] - 2021-29-05

### Changed

- Fix invalid `parse` import in `config` file

## [3.0.0] - 2021-28-05

### Added

- Added support for an `env.config.(m)js` file to load Env values 
- Added experimental support for ES modules
- Added node engines to `package.json` to support Node v12+

### Changed

- Folder structure to be more modular

## [2.1.0] - 2020-19-11

### Added

- Fallback values are supported using `|`
- Added fallback support to README

### Changed

- Refactored logic to increase performance by 15-25%

## [2.0.3] - 2020-15-11

### Changed

- Trim the result of interpolated Envs
- Cleaned up JSDOC

## [2.0.2] - 2020-15-11

### Changed

- Fixed README

## [2.0.1] - 2020-14-11

### Changed

- Fixed README

### Added

- Added command line substitution example

### Changed

- Reduced bundle size
- Updated source comments

## [2.0.0] - 2020-14-11

### Added

- Added support for single and multi command line substitutions
- Added support for key interpolations that may refer to command line substitutions

### Changed

- Removed cache
- Changed `path` to `paths`
- Updated README

## [1.0.4] - 2020-04-11

### Changed

- Fixed README

## [1.0.3] - 2020-04-11

### Added

- Added `index.d.ts` to `.gitignore`
- Added dotenv license to `index.ts`

### Changed

- Reduced build size
- Refactored types
- Updated LICENSE

## [1.0.2] - 2020-03-11

### Changed

- Fixed invalid links in README

## [1.0.1] - 2020-30-10

### Changed

- Updated README

## [1.0.0] - 2020-30-10

### Added
- Added an `ENV_OVERRIDE` variable to override Envs `process.env`
- Added an `override` argument to the `config` method to override Envs defined within `process.env`
- Added test for config warnings

### Changed

- **IMPROVED LOADING ENV FILES BY OVER 30%!!!!**
- Changed base64 encoded cached file contents strings to simple strings
- Made all types interfaces
- Moved out of beta testing and into release
- Swapped parsed forEach for a for loop
- Updated README

## [0.0.34] - 2020-29-10

### Added

- Deleted `process.env.ENV_LOAD` after the `.env` files have been preloaded or imported within the same process

## [0.0.33] - 2020-29-10

### Added

- Added an `ENV_DIR` variable to preload `.env` files from a custom directory
- Added a `cache` argument to the `config` method
- Updated README

## [0.0.32] - 2020-28-10

### Changed

- Reverted back to build v0.0.28 (with tweaks) due to massive performance regression

## [0.0.31] - 2020-28-10

### Changed

- Reduced bundle size

## [0.0.29 - 0.0.30] - 2020-28-10

### Changed

- Renamed `CHANGELOG.md` to `UPDATESLOG.md` to be able to exclude it from published package

## [0.0.28] - 2020-28-10

### Added

- Added Codecov CI in `publish` workflow

### Changed

- Updated README
- Reduce bundle size
- Removed shorthand `.env` file loading

## [0.0.27] - 2020-27-10

### Changed

- Fix config method to return correct `extracted` envs

## [0.0.26] - 2020-27-10

### Changed

- Config method returns cachedEnvs, all `process.env` contents, and extracted Envs as an object
- Prevented Envs in `process.env` from being overwritten
- Parse method optionally parses cached Env files and applies them to `process.env`

## [0.0.25] - 2020-23-10

### Added

- Config method returns cached file Envs and parsed Envs

## [0.0.23 - 0.0.24] - 2020-23-10

### Changed

- Refactored logic to reduce bundle size

## [0.0.22] - 2020-22-10

### Added

- Added optional internal file caching
- Introduced a `CACHE_ENV` variable that throws warnings if attempting to load the same env file

## [0.0.21] - 2020-22-10

### Changed

- Refactored config to accept a single argument
- Updated types and JSDoc descriptions

## [0.0.20] - 2020-22-10

### Changed

- Reduced bundle size
- Simplified logging
- Fixed tests typings

## [0.0.18 - 0.0.19] - 2020-21-10

### Changed

- Updated README
- Updated examples
- Updated types

## [0.0.17] - 2020-21-10

### Changed

- Compiled source to root directory

## [0.0.16] - 2020-21-10

### Changed

- Updated dependencies

## [0.0.15] - 2020-21-10

### Changed

- Fixed README

## [0.0.14] - 2020-21-10

### Added

- Added support for interpolated Envs

## [0.0.13] - 2020-20-10

### Changed

- Combined `config` and `parse` methods into main file

## [0.0.12] - 2020-20-10

### Removed

- Removed unnecessary `register` method

## [0.0.11] - 2020-20-10

### Removed

- Removed unnecessary `set` method

## [0.0.10] - 2020-20-10

### Changed

- Reduced methods and files to reduce bundle size

## [0.0.9] - 2020-20-10

### Changed

- Changed output to be compiled ES5

### Added

- Added terser to compress final ouput

## [0.0.8] - 2020-20-10

### Added

- Allowed `process.env` variables to be overriden

### Changed

- Refactored `paths` to be a string, string with commas, or array of strings

## [0.0.7] - 2020-20-10

### Added

- Added logo to README

## [0.0.6] - 2020-16-10

### Added

- Github workflows for predeploy and published

## [0.0.3 - 0.0.5] - 2020-16-10

### Added

- Refactored published structure

## [0.0.2] - 2020-16-10

### Added

- Refactored project structure to expose register to CLI

## [0.0.1] - 2020-16-10

### Added

- Typescript support
- Jest and enzyme test suites
- Added README
- Published to [npmjs](https://www.npmjs.com/package/snackables)
