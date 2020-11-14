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
    <img src="https://img.shields.io/npm/l/snackables.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://www.npmjs.com/package/snackables">
    <img src="https://img.shields.io/npm/dm/snackables?style=for-the-badge&labelColor=000000">
  </a>
</p>

Heavily inspired by [dotenv](https://github.com/motdotla/dotenv) and [dotenv-expand](https://github.com/motdotla/dotenv-expand), snackables is a simple to use [zero-dependency](https://bundlephobia.com/result?p=snackables@) package module that automatically loads environment variables from a predefined `ENV_LOAD` variable. When it comes to `.env` file naming, snackables is unopinionated, so you can name them anything you'd like or you can follow the [The Twelve-Factor App](https://12factor.net/config) methodology.

## Quick Links

[Installation](#installation)

[Usage](#usage)

[CLI Options](#cli-options)
  - [ENV_LOAD](#env_load)
  - [ENV_DIR](#env_dir)
  - [ENV_ENCODE](#env_encode)
  - [ENV_OVERRIDE](#env_override)
  - [ENV_DEBUG](#env_debug)

[Preload](#preload)

[Config Method](#config-method)
  - [Argument Options](#config-argument-options)
    - [dir](#config-dir)
    - [paths](#config-paths)
    - [encoding](#config-encoding)
    - [override](#config-override)
    - [debug](#config-debug)

[Parse Method](#parse-method)
  - [Argument Options](#parse-argument-options)
    - [src](#parse-src)
    - [override](#parse-override)
  - [Rules](#parse-rules)

[Interpolation](#interpolation)
  - [Interpolation Rules](#interpolation-rules)

[FAQ](#faq)
  - [Should I commit my .env files?](#should-i-commit-my-env-files)
  - [How does snackables work and will it override already set or predefined variables?](#how-does-snackables-work-and-will-it-override-already-set-or-predefined-variables)
  - [Why doesn't the parse method automatically assign Envs?](#why-doesnt-the-parse-method-automatically-assign-envs)
  - [Is the ENV_LOAD variable required?](#is-the-env_load-variable-required)

[Contributing Guide](#contributing-guide)

[Updates Log](#updates-log)

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

or they can be loaded by their paths and filename:

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

Optionally, you can [preload](#preload) your `.env` files instead!

## CLI Options

#### ENV_LOAD

By defining an `ENV_LOAD` variable within one of your package.json scripts, this will let snackables know you'd like to immediately load some `.env` files when the package is imported. You can pass a single file name or a list of file names separated by commas. By default, snackables attempts to load them from within the project's **root** directory.

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

#### ENV_DIR

By defining an `ENV_DIR` variable within one of your package.json scripts, this will let snackables know you'd like to load `.env` files from a custom directory.

```json
{
  "scripts": {
    "dev": "ENV_DIR=custom/path/to/directory ENV_LOAD=.env.base,.env.dev node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

#### ENV_ENCODE

By defining an `ENV_ENCODE` variable within one of your package.json scripts, this will let snackables know you'd like to set the encoding type of the `.env` file(s). The following file encode types are supported:

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

#### ENV_OVERRIDE

By defining an `ENV_OVERRIDE` variable within one of your package.json scripts, this will let snackables know you'd like to override Envs in `process.env`.

For example:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=.env.dev ENV_DEBUG=true ENV_OVERRIDE=true node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

#### ENV_DEBUG

By defining an `ENV_DEBUG` variable within one of your package.json scripts, this will let snackables know you'd like to be in debug mode and output the results of extracting/loading Envs.

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

## Preload

You can use the `--require` (`-r`) [command line option](https://nodejs.org/api/cli.html#cli_r_require_module) with `snackables` to preload your `.env` files! By doing so, you do not need to `require`/`import` the snackables package within your project.

CLI:
```bash
$ ENV_LOAD=.env.dev node -r snackables app.js
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

If you wish to manaully import `.env` files, then the config method will read your `.env` files, parse the contents, assign them to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env), and return an `Object` with `parsed` and `extracted`:

```js
const result = snackables.config();

console.log("parsed", result.parsed); // process.env with loaded Envs
console.log("extracted", result.extracted); // extracted Envs within a { KEY: VALUE } object
```

Additionally, you can pass options to `config`.

### Config Argument Options

config accepts a single `Object` argument with the following properties: 
```js
{ 
  dir?: string, 
  paths?: string | string[], 
  encoding?: BufferEncoding,
  override?: string | boolean,
  debug?: boolean | string
}
```

#### Config dir

Default: `process.cwd()` (root directory)

You may specify a single directory path if your files are located elsewhere.

A single directory path as a `string`:

```js
require("snackables").config({ dir: "path/to/directory" });

// import { config } from "snackables"
// config({ dir: "path/to/directory" });
```

#### Config paths

Default: `.env`

You may specify custom paths if your files are located elsewhere (recommended to use **absolute** path(s) from your root directory).

A single file path as a `string`:

```js
require("snackables").config({ paths: "custom/path/to/.env" });

// import { config } from "snackables"
// config({ paths: "custom/path/to/.env" });
```

Multiple file paths as a single `string` separated by commas:

```js
require("snackables").config({
  paths: "custom/path/to/.env,custom/path/to/.env.base"
});

// import { config } from "snackables"
// config({ paths: "custom/path/to/.env,custom/path/to/.env.base" });
```

Or multiple file paths as an `Array` of `string`s:

```js
require("snackables").config({
  paths: ["custom/path/to/.env", "custom/path/to/.env.base"]
});

// import { config } from "snackables"
// config({ paths: ["custom/path/to/.env", "custom/path/to/.env.base"] });
```

#### Config encoding

Default: `utf-8`

You may specify the encoding [type](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) of your file containing environment variables.

```js
require("snackables").config({ encoding: "latin1" });

// import { config } from "snackables"
// config({ encoding: "latin1" });
```

#### Config override

Default: `false`

You may specify whether or not to override Envs in `process.env`. 

```js
require("snackables").config({ override: true });

// import { config } from "snackables"
// config({ override: true });
```

#### Config debug

Default: `false`

You may turn on logging to help debug file loading.

```js
require("snackables").config({ debug: process.env.DEBUG });

// import { config } from "snackables"
// config({ debug: process.env.DEBUG });
```

## Parse Method

If you wish to manually parse Envs, then parse will read a string or Buffer and parse their contents.

### Parse Argument Options

parse accepts two arguments in the following order: 
```
src: string | Buffer, 
override: string | boolean
```

#### Parse src

For most use cases, you'll want to pass parse a `string` or `Buffer` as the first argument which returns an `extracted` or `sanitized` parsed keys/values as a single `Object` (these will **NOT** be assigned to `process.env`. [Why not?](#why-doesnt-the-parse-method-automatically-assign-envs)). 

```js
const { readFileSync } = require("fs");
const { parse } = require("snackables");
// import { readFileSync } from "fs";
// import { parse } from "snackables";

const config = parse(Buffer.from("BASIC=basic")); // will return an object
console.log(typeof config, config); // object { BASIC : 'basic' }

const results = parse(readFileSync("path/to/.env.file", { encoding: "utf8" })); // will return an object
console.log(typeof results, results); // object { KEY : 'value' }
```

#### Parse override

If you wish to extract and potentially override Envs in `process.env`, then you can pass `override` as a second argument to parse (these will **NOT** be assigned to `process.env`. [Why not?](#why-doesnt-the-parse-method-automatically-assign-envs)).

```js
const { readFileSync } = require("fs");
const { parse } = require("snackables");
// import { readFileSync } from "fs";
// import { parse } from "snackables";

const config = parse(Buffer.from("BASIC=basic"), override: true); // will return an object
console.log(typeof config, config); // object { BASIC : 'basic' }

const result = parse(readFileSync("path/to/.env.file", { encoding: "utf8" }), override: true); // will return an object
console.log(typeof result, result); // object { OVERRIDEKEY : 'value' }
```

### Parse Rules

The parsing method currently supports the following rules:

- `BASIC=basic` becomes `{BASIC: 'basic'}`
- empty lines are skipped
- lines beginning with `#` are treated as comments
- empty values become empty strings (`EMPTY=` becomes `{EMPTY: ''}`)
- inner quotes are maintained (think JSON) (`JSON={"foo": "bar"}` becomes `{JSON:"{\"foo\": \"bar\"}"`)
- whitespace is removed from both ends of unquoted values (see more on [`trim`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/string/Trim)) (`FOO= some value ` becomes `{FOO: 'some value'}`)
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

No. It's **strongly** recommended not to commit your `.env` files to version control. It should only include environment-specific values such as database passwords or API keys. Your production database should have a different password than your development database.

### How does snackables work and will it override already set or predefined variables?

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

snackables will parse the files and append the Envs in the order of how they were defined in `ENV_LOAD`. In the example above, the `DB_PASS` variable within `.env.base` would be overidden by `.env.dev` because `.env.dev` file was imported last and, as a result, its `DB_PASS` will be assigned to `process.env`.

By default, Envs that are **pre-set** or **defined** within `process.env` **WILL NOT be overidden**. If you wish to override variables in `process.env` see [ENV_OVERRIDE](#env_override) or [Config Override](#config-override) or [Parse Override](#parse-override).

### Why doesn't the parse method automatically assign Envs?

In short, `parse` can not automatically assign Envs as they're extracted.

Why?

Under the hood, the `config` method utilizes the `parse` method to extract one or multiple `.env` files as it loops over the config's [paths](#config-paths) argument. The `config` method expects `parse` to return a single `Object` of `extracted` or `sanitized` Envs that will be accumulated with other files' extracted/sanitized Envs. The result of these accumulated Envs is then assigned to `process.env` **once** -- this approach has the added benefit of prioritizing Envs  without using **any** additional logic since the last set of extracted Envs automatically override any previous Envs (thanks to [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Merging_objects_with_same_properties)). While allowing Envs to be assigned multiple times to `process.env` doesn't appear to be much different in terms of performance, it requires a bit more additional overhead logic to determine which `.env` has priority and whether or not to *conditionally* apply them (including times when you might want to parse Envs, but not neccesarily assign them). A workaround to this limitation is to simply apply them yourself:

```js
const { parse } = require("snackables");
// import { parse } from "snackables";

const parsed = parse(Buffer.from("BASIC=basic")); // parse/interpolate Envs not defined in process.env
// const parsed = parse(Buffer.from("BASIC=basic"), override: true); // parse/interpolate and override any Envs in process.env

Object.assign(process.env, parsed)
```

### Is the ENV_LOAD variable required?

To be as flexible as possible, the `ENV_LOAD` variable is not required to set Envs to `process.env`. However, you will then be required to use this package similarly to how you would use dotenv.

```js
const { config } = require("snackables");
// import { config } from "snackables";

config({ ... });
```

## Contributing Guide

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Updates Log

See [UPDATESLOG.md](UPDATESLOG.md)
