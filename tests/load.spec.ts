import { load } from "../index";

describe("Load Method", () => {
  it("returns an object", async () => {
    const config = await load("test");
    console.log("🚀 ~ file: load.spec.ts ~ line 6 ~ it ~ config", config);
  });
});
