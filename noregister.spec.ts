import { logMessage } from "./log";

jest.mock("./log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

describe("Register", () => {
  it("parses an 'env.config.js' file and registers ENVs when the package is imported", async () => {
    expect(process.env.BASE).toBeUndefined();

    import("./index");

    expect(logMessage).toHaveBeenCalledTimes(0);

    expect(process.env.BASE).toBeUndefined();
  });
});
