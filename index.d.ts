import config from "./config";
import parse from "./parse";
import load from "./load";
export { config, load, parse };
declare const snackables: {
    config: typeof config;
    load: typeof load;
    parse: typeof parse;
};
export default snackables;
