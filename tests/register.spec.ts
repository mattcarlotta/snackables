const spy = jest.spyOn(console, "log").mockImplementation();

describe("Register", () => {
  afterAll(() => {
    spy.mockRestore();
  });

  it("registers ENVs once when the package is imported or registered in the CLI", () => {
    expect(process.env.BASE).toBeUndefined();
    expect(process.env.TESTING).toBeUndefined();
    process.env.ENV_DIR = "tests";
    process.env.ENV_LOAD = ".env.base,.env.test";
    process.env.ENV_DEBUG = "true";

    expect(process.env.BASE).toBeUndefined();
    expect(process.env.TESTING).toBeUndefined();

    /* eslint-disable-next-line */
    require("../index");

    expect(spy.mock.calls[0][0]).toContain(
      `Loaded env from ${process.env.ENV_DIR}/.env.base`
    );

    expect(spy.mock.calls[1][0]).toContain(
      `Loaded env from ${process.env.ENV_DIR}/.env.test`
    );

    expect(process.env.BASE).toEqual("hello");
    expect(process.env.TESTING).toEqual("true");
  });
});
