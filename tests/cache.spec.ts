import { config } from "../index";

process.env.ENV_CACHE = "true";

const spy = jest.spyOn(console, "log").mockImplementation();

describe("Caching", () => {
  it("prevents the same file from being loaded and throws a warning", () => {
    config({ path: "tests/.env.base,tests/.env.base", debug: true });

    expect(spy.mock.calls[0][0]).toContain(
      `Extracted '${process.cwd()}/tests/.env.base' ENVs`
    );

    expect(spy.mock.calls[1][0]).toContain(
      'Assigned {"BASE":"hello"} to process.env'
    );

    spy.mockRestore();
  });
});
