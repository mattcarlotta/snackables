import load from "../index";

describe("Load Method", () => {
  it("loads a config file and returns an config arguments", async () => {
    const config = await load("test");

    expect(config).toEqual({
      ENV_DEBUG: true,
      ENV_LOAD: ".env.base",
      ENV_DIR: "tests"
    });
  });
});
