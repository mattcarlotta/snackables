import { config } from "../index";

process.env.ENV_CACHE = "true";

const spy = jest.spyOn(console, "log").mockImplementation();

describe("Caching", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("prevents the same file from being loaded and throws a warning", () => {
    const { cachedEnvFiles } = config({
      path: "tests/.env.base,tests/.env.base",
      debug: true
    });

    const envPath = `${process.cwd()}/tests/.env.base`;

    expect(spy.mock.calls[0][0]).toContain(`Loaded env from ${envPath}`);

    const expectedCached = expect.arrayContaining([
      expect.objectContaining({
        path: envPath,
        contents: cachedEnvFiles[0].contents
      })
    ]);

    expect(cachedEnvFiles).toEqual(expectedCached);

    spy.mockRestore();
  });
});
