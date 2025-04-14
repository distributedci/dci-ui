import {
  getCompletions,
  applyCompletion,
  AutoCompletionOptions,
} from "./autocompletion";

type TestStep =
  | {
      type: string;
      cursor?: number;
      input: string;
      autocomplete: string[];
    }
  | {
      select: string;
      input: string;
      autocomplete: string[];
    };

export function runAutocompleteTest(
  steps: TestStep[],
  options: AutoCompletionOptions = {
    fields: [
      { name: "name", type: "string" },
      { name: "duration", type: "number" },
      { name: "tags", type: "list" },
      { name: "topic.name", type: "string" },
      { name: "team.name", type: "string" },
    ],
    operators: {
      comparison: {
        string: ["=", "!=", "in", "not_in"],
        number: ["=", "!=", "in", "not_in", ">", "<"],
        boolean: ["=", "!="],
        list: ["in", "not_in"],
      },
      logical: ["and", "or"],
    },
  },
) {
  let input = "";
  let cursor = 0;
  for (const step of steps) {
    if ("type" in step) {
      input += step.type;
      if (step.cursor) {
        cursor = step.cursor;
      } else {
        cursor += step.type.length;
      }
    }
    if ("select" in step) {
      const completions = getCompletions(input, cursor, options);
      const selected = completions.find((c) => c.value === step.select);
      expect(selected).toBeDefined();
      if (selected) {
        const { newValue, newCursor } = applyCompletion({
          value: input,
          cursor: cursor,
          completion: selected,
        });
        input = newValue;
        cursor = newCursor;
      }
    }
    const completions = getCompletions(input, cursor, options);
    expect(completions.map((c) => c.value)).toEqual(step.autocomplete);
    expect(input).toEqual(step.input);
  }
}

describe("getCompletions: input", () => {
  test("is empty", () => {
    runAutocompleteTest([{ type: "", input: "", autocomplete: [] }]);
  });
  test("starts with a paranthesis", () => {
    runAutocompleteTest([
      {
        type: "(",
        input: "(",
        autocomplete: ["name", "duration", "tags", "topic.name", "team.name"],
      },
    ]);
  });
  test("one letter matching field", () => {
    runAutocompleteTest([
      {
        type: "(t",
        input: "(t",
        autocomplete: ["tags", "topic.name", "team.name"],
      },
    ]);
  });
  test("two letters matching field", () => {
    runAutocompleteTest([
      {
        type: "(to",
        input: "(to",
        autocomplete: ["topic.name"],
      },
    ]);
  });
  test("two letters no match", () => {
    runAutocompleteTest([
      {
        type: "(tz",
        input: "(tz",
        autocomplete: [],
      },
    ]);
  });
  test("more complex autocomplete scenario", () => {
    runAutocompleteTest([
      {
        type: "(",
        input: "(",
        autocomplete: ["name", "duration", "tags", "topic.name", "team.name"],
      },
      {
        type: "t",
        input: "(t",
        autocomplete: ["tags", "topic.name", "team.name"],
      },
      {
        type: "o",
        input: "(to",
        autocomplete: ["topic.name"],
      },
      {
        select: "topic.name",
        input: "(topic.name ",
        autocomplete: ["=", "!=", "in", "not_in"],
      },
      {
        select: "not_in",
        input: "(topic.name not_in ['",
        autocomplete: [],
      },
      { type: "t", input: "(topic.name not_in ['t", autocomplete: [] },
    ]);
  });
  test("logical operator", () => {
    runAutocompleteTest([
      {
        type: "(name='test')",
        input: "(name='test')",
        autocomplete: ["and", "or"],
      },
      {
        select: "and",
        input: "(name='test') and (",
        autocomplete: ["name", "duration", "tags", "topic.name", "team.name"],
      },
    ]);
  });
  test("nrt user write closing parenthesis but move cursor before", () => {
    runAutocompleteTest([
      {
        type: "(components.name = '')",
        cursor: 20,
        input: "(components.name = '')",
        autocomplete: [],
      },
    ]);
  });
});

describe("applyCompletion", () => {
  test("partial field", () => {
    expect(
      applyCompletion({
        value: "(to",
        cursor: 3,
        completion: {
          value: "topic.name",
          insertText: "topic.name ",
        },
      }),
    ).toEqual({
      newCursor: 12,
      newValue: "(topic.name ",
    });
  });

  test("with field", () => {
    expect(
      applyCompletion({
        value: "(topic.name ",
        cursor: 12,
        completion: { value: "not_in", insertText: "not_in ['" },
      }),
    ).toEqual({
      newCursor: 21,
      newValue: "(topic.name not_in ['",
    });
  });

  test("with field and operator", () => {
    expect(
      applyCompletion({
        value: "(status in ",
        cursor: 11,
        completion: {
          value: "success",
          insertText: "['success'] ",
        },
      }),
    ).toEqual({
      newCursor: 23,
      newValue: "(status in ['success'] ",
    });
  });

  test("with logical operator", () => {
    expect(
      applyCompletion({
        value: "(name='test')",
        cursor: 13,
        completion: { value: "and", insertText: " and (" },
      }),
    ).toEqual({
      newCursor: 19,
      newValue: "(name='test') and (",
    });
  });

  test("nrt nested field applied", () => {
    expect(
      applyCompletion({
        value: "(components.",
        cursor: 12,
        completion: {
          value: "components.name",
          insertText: "components.name ",
        },
      }),
    ).toEqual({
      newCursor: 17,
      newValue: "(components.name ",
    });
  });
});
