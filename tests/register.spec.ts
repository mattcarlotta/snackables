const spy = jest.spyOn(global.console, "log").mockImplementation();

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

    expect(spy.mock.calls[0][0]).toContain(`Extracted '.env.base' ENVs`);

    expect(spy.mock.calls[1][0]).toContain(`Extracted '.env.test' ENVs`);

    expect(spy.mock.calls[2][0]).toContain(
      `Unable to extract '.env.invalid': ENOENT: no such file or directory`
    );

    expect(spy.mock.calls[3][0]).toContain(
      'Assigned {"BASE":"hello","TESTING":"true"} to process.env'
    );

    expect(process.env.BASE).toEqual("hello");
    expect(process.env.TESTING).toEqual("true");
  });
});
