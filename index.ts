/*
  BSD 2-Clause "Simplified" License
 
  Copyright (c) 2015, Scott Motte
 
  All rights reserved.
 
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
 
  Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
 
  Redistributions in binary form must reproduce the above copyright notice,
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
import config from "./config";
import parse from "./parse";
import load from "./load";
import assignEnvs from "./assignEnvs";

/**
 * Immediately loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} when the package is preloaded or imported.
 */
(async function (): Promise<void> {
  const { env } = process;
  const { LOAD_CONFIG } = env;

  // checks if LOAD_CONFIG is defined and assigns process with Env variables
  if (LOAD_CONFIG) {
    const config = await load(LOAD_CONFIG);

    assignEnvs(config);

    // prevents the IFFE from reloading the config file
    delete process.env.LOAD_CONFIG;
  }

  const { ENV_DIR, ENV_LOAD, ENV_DEBUG, ENV_ENCODE, ENV_OVERRIDE } = env;

  // checks if ENV_LOAD is defined and automatically calls config with Env variables
  if (ENV_LOAD) {
    config({
      dir: ENV_DIR,
      paths: ENV_LOAD,
      debug: ENV_DEBUG,
      encoding: ENV_ENCODE as BufferEncoding,
      override: ENV_OVERRIDE
    });

    // prevents the IFFE from reloading the .env files
    delete process.env.ENV_LOAD;
  }
})();

export { config, load, parse };

const snackables = {
  config,
  load,
  parse
};

export default snackables;
