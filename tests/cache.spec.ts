import { config, parse } from "../index";

const spy = jest.spyOn(console, "log").mockImplementation();

describe("Caching", () => {
  afterEach(() => {
    jest.resetModules();
  });

  it("prevents the same file from being loaded and throws a warning", () => {
    const { cachedEnvFiles } = config({
      path: "tests/.env.base,tests/.env.base",
      debug: true,
      cache: true
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
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  it("parses files from cache and prevents it from reloading", () => {
    const { cachedEnvFiles } = config({
      path: "tests/.env.cache",
      cache: true
    });

    delete process.env.CACHE;
    expect(process.env.CACHE).toBeUndefined();

    let parsed = parse(cachedEnvFiles);
    expect(parsed.CACHE).toBeTruthy();

    process.env.LOADED_CACHE = "true";
    delete process.env.CACHE;
    expect(process.env.CACHE).toBeUndefined();

    parsed = parse(cachedEnvFiles);
    expect(parsed.CACHE).toBeUndefined();
  });
});
