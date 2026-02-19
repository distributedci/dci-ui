import { test, expect } from "vitest";
import { formatHardwareData } from "./hardwareFormatter";
import nodes from "./__tests__/fixtures/nodes.json";
import expectedFormattedNodes from "./__tests__/fixtures/expectedFormattedNodes.json";

test("formatHardwareData", () => {
  expect(formatHardwareData(nodes)).toEqual(expectedFormattedNodes);
});
