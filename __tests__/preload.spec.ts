import { logMessage } from "../log";

jest.mock("../log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

it("parses and assigns Envs within ENV_LOAD once the package is either imported or preloaded in the CLI", async () => {
  expect(process.env.PRELOAD).toBeUndefined();
  expect(process.env.EXAMPLE).toBeUndefined();
  process.env.ENV_DIR = "tests";
  process.env.ENV_LOAD = ".env.preload,.env.example";
  process.env.ENV_DEBUG = "true";

  require("../index");

  expect(logMessage).toHaveBeenCalledWith(
    `Loaded env from ${process.env.ENV_DIR}/.env.preload`
  );

  expect(logMessage).toHaveBeenCalledWith(
    `Loaded env from ${process.env.ENV_DIR}/.env.example`
  );

  expect(process.env.PRELOAD).toEqual("true");
  expect(process.env.EXAMPLE).toEqual("hello");
});
