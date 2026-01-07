import { humanizeBytes } from "./bytes";

test("humanFileSize", () => {
  expect(humanizeBytes(0)).toEqual("0 B");
  expect(humanizeBytes(1000)).toEqual("1000 B");
  expect(humanizeBytes(6124000)).toEqual("5.84 MB");
});
