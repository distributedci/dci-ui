import { getOptions } from "./autocomplete";

test("getOptions with empty options", () => {
  const availableOptions: string[] = [];
  expect(getOptions("s", availableOptions)).toEqual([]);
});

test("getOptions simple first level", () => {
  const availableOptions: string[] = ["name", "status", "state"];
  expect(getOptions("s", availableOptions)).toEqual(["status", "state"]);
});

test("getOptions case insensitive", () => {
  const availableOptions: string[] = ["name", "status", "state"];
  expect(getOptions("S", availableOptions)).toEqual(["status", "state"]);
});

test("getOptions second level", () => {
  const availableOptions: string[] = [
    "name",
    "status",
    "state",
    "components.name",
    "components.status",
  ];
  expect(getOptions("components.s", availableOptions)).toEqual([
    "components.status",
  ]);
});

test("getOptions is using the last part of the input", () => {
  const availableOptions: string[] = [
    "name",
    "status",
    "state",
    "components.name",
    "components.status",
  ];
  expect(getOptions("components.name s", availableOptions)).toEqual([
    "components.name status",
    "components.name state",
  ]);
});

test("getOptions trim extra space if present", () => {
  const availableOptions: string[] = ["name="];
  expect(getOptions("name= ", availableOptions)).toEqual(["name="]);
});
