/*
  Copyright (c) 2015, Scott Motte
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const NEWLINE = "\n";
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\n|\r|\r\n/;

/**
 * Parses a string or buffer in the .env file format into an object.
 *
 * @param src - contents to be parsed
 * @returns an object with keys and values based on `src`
 */
export default function parse(
  src: string | Buffer
): { [name: string]: string } {
  const obj: any = {};

  // convert Buffers before splitting into lines and processing
  src
    .toString()
    .split(NEWLINES_MATCH)
    .forEach(line => {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      const keyValueArr = line.match(RE_INI_KEY_VAL);
      // matched?
      if (keyValueArr != null) {
        const key = keyValueArr[1];
        // default undefined or missing values to empty string
        let val = keyValueArr[2] || "";
        const end = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[end] === '"';
        const isSingleQuoted = val[0] === "'" && val[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) val = val.replace(RE_NEWLINES, NEWLINE);
        } else {
          // remove surrounding whitespace
          val = val.trim();
        }

        obj[key] = val;
      }
    });

  return obj;
}
