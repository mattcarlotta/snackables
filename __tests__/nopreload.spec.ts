import { logMessage } from "../log";

jest.mock("../log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

it("doesn't load any Envs when the package is imported", async () => {
  expect(process.env.BASE).toBeUndefined();

  import("../index");

  expect(logMessage).toHaveBeenCalledTimes(0);

  expect(process.env.BASE).toBeUndefined();
});
