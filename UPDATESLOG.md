# Updates Log

All notable updates to this project will be documented in this file. See [SemVer 2.0](https://semver.org/) for commit guidelines.

## [0.0.29 - 0.0.30] - 2020-28-10

### Changed

- Renamed `CHANGELOG.md` to `UPDATESLOG.md` to be able to exlcude it from published package

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

- Config method returns cachedEnvs, all `process.env` contents, and extracted ENVs as an object
- Prevented ENVs in `process.env` from being overwritten
- Parse method optionally parses cached ENV files and applies them to `process.env`

## [0.0.25] - 2020-23-10

### Added

- Config method returns cached file ENVs and parsed ENVs

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

- Added support for interpolated ENVs

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