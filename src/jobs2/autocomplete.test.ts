import { getOptions } from "./autocomplete";

test("getOptions filters options starting with the search lowercase", () => {
  const availableOptions = {
    "name:": [],
    "status:": [],
    "state:": [],
  };
  expect(getOptions("nam", availableOptions)).toEqual(["name:"]);
  expect(getOptions("s", availableOptions)).toEqual(["status:", "state:"]);
  expect(getOptions("statu", availableOptions)).toEqual(["status:"]);
  expect(getOptions("nAm", availableOptions)).toEqual(["name:"]);
});

test("getOptions returns list of sub options if search matches the key", () => {
  const availableOptions = {
    "name:": [],
    "status:": ["success", "error"],
    "state:": [],
  };
  expect(getOptions("status:", availableOptions)).toEqual(["status:success", "status:error"]);
});


test("getOptions returns list of sub field if dot is present", () => {
  const availableOptions = {
    "topic.": ["id", "name"]
  };
  expect(getOptions("topic.", availableOptions)).toEqual(["topic.id:", "topic.name:"]);
  expect(getOptions("Topic.", availableOptions)).toEqual(["topic.id:", "topic.name:"]);
});


test("getOptions returns remaining options when one option is present", () => {
  const availableOptions = {
    "topic.": ["id", "name"],
    "name:": []
  };
  expect(getOptions("topic.id", availableOptions)).toEqual(["topic.id:"]);
  expect(getOptions("topic.id ", availableOptions)).toEqual(["topic.id:"]);
  expect(getOptions('topic.name:RHEL-8.5 n', availableOptions)).toEqual(["name:"]);
  expect(getOptions('topic.name:RHEL-8.5 name:f', availableOptions)).toEqual([]);
});
