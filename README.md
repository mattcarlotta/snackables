# snackables

Heavily inspired by [dotenv](https://github.com/motdotla/dotenv), snackables is a simple, zero-dependency package module that automatically loads agnostic environment variables from a predefined `ENV_LOAD` variable. When it comes to ENV naming, snackables is unopinionated, so you can name your ENVs anything or follow the [The Twelve-Factor App](https://12factor.net/config) methodology.

[Installation](#installation)

[Usage](#usage)

[CLI Options](#cli-options)

- [ENV_LOAD](#env_load)
- [ENV_DEBUG](#env_debug)
- [ENV_ENCODE](#env_encode)
- [Preload](#preload)

[Config Method](#config-method)

- [Config Options](#config-options)
  - [Path](#path)
  - [Encoding](#encoding)
  - [Debug](#debug)

[Parse Method](#parse-method)

- [Rules](#rules)

[FAQ](#faq)

- [Should I commit my .env file?](#should-i-commit-my-env-file)
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

Within your package.json, under the `scripts` property, define a `ENV_LOAD` variable and either add a single file
`ENV_LOAD=file` or add multiple files separated by commas `ENV_LOAD=file,file,file,..etc` before running a process.

For example:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=base node test.js",
    "staging": "ENV_LOAD=base,staging node app.js"
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

## CLI Options

#### ENV_LOAD

By defining an `ENV_LOAD` variable within one of your package.json scripts, this will let snackables know you'd like to immediately load some ENVs when the package is imported. You can pass a single file name or a list of file names separated by commas. By default, snackables appends `.env.` to the file name(s) and attempts to load them from within the project's root directory.

For example:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=base,local,dev node app.js",
    "prod": "ENV_LOAD=prod node app.js"
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
    "dev": "ENV_LOAD=dev ENV_DEBUG=true node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

#### ENV_ENCODE

By defining an `ENV_ENCODE` variable within one of your package.json scripts, this will let snackables know you'd like to set the encoding mode of the file. The following file type encodes are supported:

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
    "dev": "ENV_LOAD=dev ENV_ENCODE=latin1 node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

### Preload

You can use the `--require` (`-r`) [command line option](https://nodejs.org/api/cli.html#cli_r_require_module) with `snackables/register` to preload snackables! By doing this, you do not need to require/import the snackables package within your application code.

```bash
$ ENV_LOAD=dev node -r snackables/register app.js
```

or

```json
{
  "scripts": {
    "dev": "ENV_LOAD=dev node -r snackables/register app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

## Config Method

If you wish to manaully import a config, then the config method will read your `.env` file, parse the contents, assign it to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env), and return an object with a `parsed` key containing the loaded content or an `error` key if it failed.

```js
const result = snackables.config();

if (result.error) {
  throw result.error;
}

console.log(result.parsed);
```

You can additionally, pass options to `config`.

### Config Options

#### Path

Default: `path.resolve(process.cwd(), '.env')`

You may specify a custom path if your file containing environment variables is located elsewhere.

```js
require("snackables").config({ path: "/custom/path/to/.env" });
// import { config } from "snackables"
// config({ path: "/custom/path/to/.env" });
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

The method that parses the contents of your `.env.*` file(s) is also available to use. It accepts a `String` or `Buffer` and will return an `Object` with the parsed keys and values.

```js
const { parse } = require("snackables");
// import { parse } from "snackables";
const buf = Buffer.from("BASIC=basic");
const config = parse(buf); // will return an object
console.log(typeof config, config); // object { BASIC : 'basic' }
```

### Rules

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

## FAQ

### Should I commit my `.env` file?

No. We **strongly** recommend against committing your `.env` file to version control. It should only include environment-specific values such as database passwords or API keys. Your production database should have a different password than your development database.

### How does snackables work and will it overwrite already set or predefined variables?

By default, snackables will look for the `.env.*` file(s) defined within the `ENV_LOAD` variable and append them to `process.env`.

For example, `ENV_LOAD` has two files `.env.base` and `.env.dev`:

```json
{
  "scripts": {
    "dev": "ENV_LOAD=base,dev ENV_DEBUG=true node app.js"
  },
  "dependencies": {
    "snackables": "^x.x.x"
  }
}
```

`.env.base` may have static shared database variables:

```dosini
DB_USER=root
DB_PASS=password
```

And `.env.dev` may have environment specific variables:

```dosini
DB_HOST=localhost
HOST=http://localhost
PORT=3000
```

snackables will parse the files and append the ENVs in order of how they were defined in `ENV_LOAD`; however, snackables will **NEVER** modify any predefined environment variables that have already been set to the node process on start up or there after. In short, if there is an ENV variable in your one of your `.env` files that attempts to overwrite an `process.env.XXXX` variable that has already been set to the process (either by node or by you), then that variable won't be appended.

Although it's **NOT** recommended, any ENV variables that haven't been set to the process yet can be overwritten according to their import order, where the last `.env` import takes precendence over any previous ENVs.

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
