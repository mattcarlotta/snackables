import { logMessage, logWarning } from "../log";

const mockLog = jest.fn();

global.console = { ...global.console, log: mockLog };

describe("Log", () => {
  afterEach(() => {
    mockLog.mockClear();
  });

  it("logs a message to the console", () => {
    logMessage("Example message.");

    expect(mockLog).toHaveBeenCalledWith(
      expect.stringContaining("Example message.")
    );
  });

  it("logs a warning message to the console", () => {
    logWarning("Example warning.");

    expect(mockLog).toHaveBeenCalledWith(
      expect.stringContaining("Example warning.")
    );
  });
});
