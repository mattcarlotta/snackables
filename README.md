![snackablesLogo](https://github.com/mattcarlotta/snackables/blob/main/snackablesLogo.png?raw=true)

<p align="center">
  <a href="https://www.npmjs.com/package/snackables">
    <img src="https://img.shields.io/npm/v/snackables.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://github.com/mattcarlotta/snackables/actions?query=workflow%3A%22Publish+Workflow%22">
    <img src="https://img.shields.io/github/workflow/status/mattcarlotta/snackables/Publish%20Workflow?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://codecov.io/gh/mattcarlotta/snackables/branch/main">
    <img src="https://img.shields.io/codecov/c/github/mattcarlotta/snackables?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://github.com/mattcarlotta/snackables/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mattcarlotta/snackables?style=for-the-badge&labelColor=000000">
  </a>
</p>

Heavily inspired by [dotenv](https://github.com/motdotla/dotenv) and [dotenv-expand](https://github.com/motdotla/dotenv-expand), snackables is a simple to use [zero-dependency](https://bundlephobia.com/result?p=snackables@) package module that automatically loads environment variables from a predefined `ENV_LOAD` variable. When it comes to `.env` file naming, snackables is unopinionated, so you can name them anything you'd like or you can follow the [The Twelve-Factor App](https://12factor.net/config) methodology.

## Quick Links

[Installation](#installation)

[Usage](#usage)

[CLI Options](#cli-options)
  - [ENV_LOAD](#env_load)
  - [ENV_DEBUG](#env_debug)
  - [ENV_ENCODE](#env_encode)
  - [ENV_CACHE](#env_cache)
  - [Preload](#preload)

[Config Method](#config-method)
  - [Config Options](#config-options)
    - [Dir](#dir)
    - [Path](#path)
    - [Encoding](#encoding)
    - [Debug](#debug)

[Parse Method](#parse-method)
  - [Parse Rules](#parse-rules)

[Interpolation](#interpolation)
  - [Interpolation Rules](#interpolation-rules)

[FAQ](#faq)
  - [Should I commit my .env files?](#should-i-commit-my-env-files)
  - [How does snackables work and will it overwrite already set or predefined variables?](#how-does-snackables-work-and-will-it-overwrite-already-set-or-predefined-variables)
  - [Is the ENV_LOAD variable required?](#is-the-env_load-variable-required)

[Contributing Guide](#contributing-guide)

[Change Log](#change-log)

## Installation

```bash
# with npm
npm install snackables

# or with Yarn
yarn add snackables
```

## Usage

In a CLI or within your package.json, under the `scripts` property, define an `ENV_LOAD` variable and either add a single file `ENV_LOAD=.env.base` or add multiple files separated by commas `ENV_LOAD=.env.base,.env.local,.env.dev,..etc` before running a process. Snackables loads `.env` files according to their defined order (left to right), where the last imported file will take precedence over any previously imported files.

For example, `.env.*` files can be loaded by their filename (assuming they're located in the projects root):

```json
{
  "scripts": {
    "dev": "ENV_LOAD=.env.base node test.js",
    "staging": "ENV_LOAD=.env.base,.env.staging node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

or they can be loaded by their path and filename:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=custom/path/to/.env.base node test.js",
    "staging": "ENV_LOAD=custom/path/to/.env.base,custom/path/to/.env.staging node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

All you need to do now is `require`/`import` the snackables base package as early as possible:

```javascript
require("snackables");
// import 'snackables';
```

Or, you can [preload](#preload) your `.env` files instead!

## CLI Options

#### ENV_LOAD

By defining an `ENV_LOAD` variable within one of your package.json scripts, this will let snackables know you'd like to immediately load some ENVs when the package is imported. You can pass a single file name or a list of file names separated by commas. By default, snackables attempts to load them from within the project's **root** directory.

For example:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=.env.base,.env.local,.env.dev node app.js",
    "prod": "ENV_LOAD=.env.prod node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

#### ENV_DEBUG

By defining an `ENV_DEBUG` variable within one of your package.json scripts, this will let snackables know you'd like to be in debug mode and output the results of extracting/loading ENVs.

For example:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=.env.dev ENV_DEBUG=true node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

#### ENV_ENCODE

By defining an `ENV_ENCODE` variable within one of your package.json scripts, this will let snackables know you'd like to set the encoding mode of the `.env` file(s). The following file encode types are supported:

```
ascii
utf8
utf-8 (default)
utf16le
ucs2
ucs-2
base64
latin1
binary
hex
```

For example:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=.env.dev ENV_ENCODE=latin1 node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```
#### ENV_CACHE

By defining `ENV_CACHE` to `true`, any `.env` file that has been previous extracted and assigned to `process.env` will be stored to temporary cache. Any attempts to reload the same file within the same running process will be skipped. 

```json
{
  "scripts": {
    "dev": "ENV_CACHE=true node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

### Preload

You can use the `--require` (`-r`) [command line option](https://nodejs.org/api/cli.html#cli_r_require_module) with `snackables` to preload your `.env` files! By doing so, you do not need to `require`/`import` the snackables package within your code.

CLI:
```bash
$ ENV_LOAD=dev node -r snackables app.js
```

Package.json:
```json
{
  "scripts": {
    "dev": "ENV_LOAD=.env.dev node -r snackables app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

## Config Method

If you wish to manaully import `.env` files, then the config method will read your `.env` files, parse the contents, assign it to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env), and return an object: `process.env` (includes loaded ENVs) as `parsed`, an object of extracted ENVs as `extracted`, and an array of cached envs paths and contents as `cachedEnvFiles`.

```js
const result = snackables.config();

console.log("parsed", result.parsed);
console.log("extracted", result.extracted);
console.log("cachedEnvFiles", result.cachedEnvFiles); // process.env.ENV_CACHE **must** be set to true
```

Additionally, you can pass options to `config`.

### Config Options

#### Dir

Default: `process.cwd()` (root directory)

You may specify a single directory path if your files are located elsewhere.

A single directory path as a `String`:

```js
require("snackables").config({ dir: "./src" });

// import { config } from "snackables"
// config({ dir: "./src" });
```

#### Path

Default: `'.env'`

You may specify custom paths if your files are located elsewhere (recommended to use **absolute** path(s) from your root directory).

A single file path as a `String`:

```js
require("snackables").config({ path: "custom/path/to/.env" });

// import { config } from "snackables"
// config({ path: "custom/path/to/.env" });
```

Multiple file paths as a single `String` separated by commas:

```js
require("snackables").config({
  path: "custom/path/to/.env,custom/path/to/.env.base"
});

// import { config } from "snackables"
// config({ path: "custom/path/to/.env,custom/path/to/.env.base" });
```

Or multiple file paths as an `Array` of `String`s:

```js
require("snackables").config({
  path: ["custom/path/to/.env", "custom/path/to/.env.base"]
});

// import { config } from "snackables"
// config({ path: ["custom/path/to/.env", "custom/path/to/.env.base"] });
```

#### Encoding

Default: `utf-8`

You may specify the encoding of your file containing environment variables.

```js
require("snackables").config({ encoding: "latin1" });

// import { config } from "snackables"
// config({ encoding: "latin1" });
```

#### Debug

Default: `false`

You may turn on logging to help debug why certain keys or values are not being set as you expect.

```js
require("snackables").config({ debug: process.env.DEBUG });

// import { config } from "snackables"
// config({ debug: process.env.DEBUG });
```

## Parse Method

The method that parses the contents of your `.env.*` file(s) is also available to use. It accepts a `String` or `Buffer` arguments and will return an `Object` with the parsed keys and values. In addition, if [ENV_CACHE](#env_cache) is set and `process.env.LOADED_CACHE` is not defined, the parse method also accepts the `cachedEnvFiles` array (see [Config Method](#config-method)) as an argument; if applicable, it will reapply cached ENVs to `process.env` and return `process.env`. 

Basic usage:
```js
const { parse } = require("snackables");
// import { parse } from "snackables";

const config = parse(Buffer.from("BASIC=basic")); // will return an object
console.log(typeof config, config); // object { BASIC : 'basic' }
```

Advanced usage (useful for scenarios where the `process.env` may be reset to a default state):
```js
const { config, parse } = require("snackables");
// import { config, parse } from "snackables";

// allows ENV files to be cached
process.env.ENV_CACHE = "true";

// loads ".env.base" and ".env.dev" to process.env and returns an array of cached env objects
// cachedEnvFiles = [{ path: "path/to/.env", contents: base64 encoded string with parsed contents }]
const { cachedEnvFiles } = config({ path: ".env.base,.env.dev" }); 

// parses and reapplies cached ENVs if the process.env.PROPERTY is undefined
// returns process.env with any reapplied ENVs from cache
const reappliedProcessEnv = parse(cachedEnvFiles); 
console.log(reappliedProcessEnv) 

// this lets snackables know not to reload from cache
process.env.LOADED_CACHE = "true"; 

// since process.env.LOADED_CACHE is defined, cache is skipped and process.env is returned as is
const originalProcessEnv = parse(cachedEnvFiles); 
console.log(originalProcessEnv) 
```

### Parse Rules

The parsing method currently supports the following rules:

- `BASIC=basic` becomes `{BASIC: 'basic'}`
- empty lines are skipped
- lines beginning with `#` are treated as comments
- empty values become empty strings (`EMPTY=` becomes `{EMPTY: ''}`)
- inner quotes are maintained (think JSON) (`JSON={"foo": "bar"}` becomes `{JSON:"{\"foo\": \"bar\"}"`)
- whitespace is removed from both ends of unquoted values (see more on [`trim`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)) (`FOO= some value ` becomes `{FOO: 'some value'}`)
- single and double quoted values are escaped (`SINGLE_QUOTE='quoted'` becomes `{SINGLE_QUOTE: "quoted"}`)
- single and double quoted values maintain whitespace from both ends (`FOO=" some value "` becomes `{FOO: ' some value '}`)
- double quoted values expand new lines (`MULTILINE="new\nline"` becomes

```
{MULTILINE: 'new
line'}
```

## Interpolation

You may want to interpolate ENV values based upon a `process.env` value or a key within the `.env` file. To interpolate a value, simply define it with `$KEY` or `${KEY}`, for example:

Input:
```dosini
MESSAGE=Hello
INTERP_MESSAGE=$MESSAGE World
INTERP_MESSAGE_BRACKETS=${MESSAGE} World
ENVIRONMENT=$NODE_ENV
```

Output:
```dosini
MESSAGE=Hello
INTERP_MESSAGE=Hello World
INTERP_MESSAGE_BRACKETS=Hello World
ENVIRONMENT=development
```

### Interpolation Rules

- Values can be interpolated based upon a `process.env` value: `BASIC=$NODE_ENV` || `BASIC=${NODE_ENV}`
- Values in `process.env` take precedence over interpolated values in `.env` files
- Interpolated values can't be referenced across multiple `.env`s, instead they must only be referenced within the same file
- The `$` character **must** be escaped when it doesn't refer to another key within the `.env` file: `\$1234`
- Do not use escaped `\$` within a value when it's key is referenced by another key: 

Input:
```dosini
A=\$example
B=$A
```

Output:
```dosini
A=$example
B=
```

Fix:
```dosini
A=example
B=\$$A
```

Output:
```dosini
A=example
B=$example
```

## FAQ

### Should I commit my `.env` files?

No. We **strongly** recommend against committing your `.env` files to version control. It should only include environment-specific values such as database passwords or API keys. Your production database should have a different password than your development database.

### How does snackables work and will it overwrite already set or predefined variables?

By default, snackables will look for the `.env.*` file(s) defined within the `ENV_LOAD` variable and append them to `process.env`.

For example, `ENV_LOAD=.env.base,.env.dev` has two files `.env.base` and `.env.dev`:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=.env.base,.env.dev ENV_DEBUG=true node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

in a local enviroment, `.env.base` may have static shared database variables:

```dosini
DB_HOST=localhost
DB_USER=root
DB_PASS=password
```

while `.env.dev` may have environment specific variables:

```dosini
DB_PASS=password123
HOST=http://localhost
PORT=3000
```

snackables will parse the files and append the ENVs in the order of how they were defined in `ENV_LOAD`. In the example above, the `DB_PASS` variables within `.env.base` would be overwritten by `.env.dev` because its file was imported last.

Any ENV variables **within** an `.env` file can be overwritten according to their imported order, where the last `.env` import takes precendence over any previous ENVs; however **defined or pre-set** ENVs within `process.env` **can NOT be overwritten**.

### Is the ENV_LOAD variable required?

To be as flexible as possible, the `ENV_LOAD` variable is not required to set ENVs to `process.env`. However, you will then be required to use this package just like you would use dotenv.

```js
const { config } = require("snackables");
// import { config } from "snackables";

config({ ... });
```

## Contributing Guide

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Change Log

See [CHANGELOG.md](CHANGELOG.md)
