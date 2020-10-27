import { config } from "../index";

process.env.ENV_CACHE = "true";

const spy = jest.spyOn(console, "log").mockImplementation();

describe("Caching", () => {
  it("prevents the same file from being loaded and throws a warning", () => {
    const { parsed, cachedENVFiles } = config({
      path: "tests/.env.base,tests/.env.base",
      debug: true
    });

    const envPath = `${process.cwd()}/tests/.env.base`;

    expect(spy.mock.calls[0][0]).toContain(`Extracted '${envPath}' ENVs`);

    expect(spy.mock.calls[1][0]).toContain(
      'Assigned {"BASE":"hello"} to process.env'
    );

    expect(cachedENVFiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: envPath,
          contents: JSON.stringify(parsed)
        })
      ])
    );

    spy.mockRestore();
  });
});
