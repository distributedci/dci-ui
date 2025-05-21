import { groupByKeys, groupByKeysWithLabel } from "./types";

describe("types groupByKeys config", () => {
  it("does not include the results key", () => {
    expect(groupByKeys).not.toContain("results");
  });
});

describe("types groupByKeysWithLabel config", () => {
  it("does not have a results label", () => {
    expect(groupByKeysWithLabel).not.toHaveProperty("results");
  });
});
