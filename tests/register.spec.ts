const spy = jest.spyOn(console, "log").mockImplementation();
const root = process.cwd();

describe("Register", () => {
  afterAll(() => {
    spy.mockRestore();
  });

  it("registers ENVs once when the package is imported or registered in the CLI", () => {
    expect(process.env.BASE).toBeUndefined();
    expect(process.env.TESTING).toBeUndefined();
    process.env.ENV_LOAD = "base,test,invalid";
    process.env.ENV_DEBUG = "true";

    /* eslint-disable-next-line */
    require("../index");

    expect(spy.mock.calls[0][0]).toContain(`Loaded env from ${root}/.env.base`);

    expect(spy.mock.calls[1][0]).toContain(`Loaded env from ${root}/.env.test`);

    expect(process.env.BASE).toEqual("hello");
    expect(process.env.TESTING).toEqual("true");
  });
});
