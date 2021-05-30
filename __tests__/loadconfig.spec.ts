import { logMessage } from "../log";

jest.mock("../log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

it("loads and parses an 'env.config.json' file and registers ENVs when the package is imported", async () => {
  expect(process.env.BASE).toBeUndefined();
  process.env.LOAD_CONFIG = "test";

  require("../index");

  expect(logMessage).toHaveBeenCalledWith(`Loaded env from tests/.env.base`);
  expect(process.env.BASE).toEqual("hello");
});
