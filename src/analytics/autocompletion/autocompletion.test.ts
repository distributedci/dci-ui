import {
  _parseSyntax,
  applyCompletion,
  defaultOptions,
  getCompletions,
  type AutoCompletionHistory,
  type AutoCompletionOptions,
  type AutoCompletionValues,
  type Completion,
  type CompletionContext,
} from "./autocompletion";

class AutocompleteTestBuilder {
  private input: string = "";
  private cursor: number = 0;
  private focusedIndex: number = -1;
  private options: AutoCompletionOptions;
  private values: AutoCompletionValues;
  private history: AutoCompletionHistory;
  private completionContext: CompletionContext = {
    input: "",
    cursor: 0,
    values: {},
    history: { queries: [], maxSuggestions: 2 },
    completions: [],
    syntax: null,
  };

  constructor(
    options: Partial<AutoCompletionOptions> = {},
    values: AutoCompletionValues = {},
    history: AutoCompletionHistory = { queries: [], maxSuggestions: 2 },
  ) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.values = values;
    this.history = history;
    this.updateCompletions();
  }

  private updateCompletions(): void {
    this.completionContext = getCompletions({
      input: this.input,
      cursor: this.cursor,
      options: this.options,
      values: this.values,
      history: this.history,
      completions: [],
      syntax: null,
    });
  }

  private get completions(): Completion[] {
    return this.completionContext.completions;
  }

  type(chars: string): this {
    const before = this.input.slice(0, this.cursor);
    const after = this.input.slice(this.cursor);
    this.input = before + chars + after;
    this.cursor += chars.length;
    this.updateCompletions();
    return this;
  }

  arrowDown(count: number = 1): this {
    if (this.completions.length === 0) {
      this.focusedIndex = -1;
      return this;
    }

    this.focusedIndex = (this.focusedIndex + count) % this.completions.length;
    return this;
  }

  arrowRight(count: number = 1): this {
    const newCursor = this.cursor + count;
    if (newCursor >= this.input.length) {
      this.cursor = this.input.length;
    } else {
      this.cursor = newCursor;
    }
    return this;
  }

  arrowLeft(count: number = 1): this {
    const newCursor = this.cursor - count;
    if (newCursor < 0) {
      this.cursor = 0;
    } else {
      this.cursor = newCursor;
    }
    return this;
  }

  arrowUp(count: number = 1): this {
    if (this.completions.length === 0) {
      this.focusedIndex = -1;
      return this;
    }

    this.focusedIndex = this.focusedIndex - count;
    if (this.focusedIndex < 0) {
      this.focusedIndex =
        this.completions.length + (this.focusedIndex % this.completions.length);
    }
    return this;
  }

  enter(): this {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.completions.length) {
      const completion = this.completions[this.focusedIndex];
      return this._applyCompletion(completion);
    }
    return this;
  }

  selectCompletion(value: string): this {
    const completion = this.completions.find((c) => c.value === value);
    if (!completion) {
      throw new Error(
        `Completion with value "${value}" not found. Available: [${this.completions.map((c) => c.value).join(", ")}]`,
      );
    }
    return this._applyCompletion(completion);
  }

  clickCompletion(value: string): this {
    return this.selectCompletion(value);
  }

  private _applyCompletion(completion: Completion): this {
    this.completionContext = applyCompletion(
      this.completionContext,
      completion,
    );
    this.completionContext = getCompletions(this.completionContext);
    this.input = this.completionContext.input;
    this.cursor = this.completionContext.cursor;
    this.focusedIndex = -1;
    return this;
  }

  expectInput(expected: string): this {
    expect(this.input).toBe(expected);
    return this;
  }

  expectCursor(position: number): this {
    expect(this.cursor).toBe(position);
    return this;
  }

  expectCompletions(expected: string[]): this {
    const actual = this.completions.map((c) => c.value);
    expect(actual).toEqual(expected);
    return this;
  }
}

export function autocomplete(
  options?: Partial<AutoCompletionOptions>,
  values?: AutoCompletionValues,
  history?: AutoCompletionHistory,
): AutocompleteTestBuilder {
  return new AutocompleteTestBuilder(options, values, history);
}

describe("Autocomplete no completion", () => {
  test("empty input has no completions", () => {
    autocomplete().expectInput("").expectCursor(0).expectCompletions([]);
  });
  test("typing partial field without parenthesis has no completions", () => {
    autocomplete()
      .type("t")
      .expectCompletions([])
      .expectCursor(1)
      .expectInput("t");
  });
  test("typing non-matching characters shows no completions", () => {
    autocomplete()
      .type("(tz")
      .expectCompletions([])
      .expectCursor(3)
      .expectInput("(tz");
  });
  test("no beginning parenthesis shows no completion", () => {
    autocomplete().type("name ").expectCompletions([]).expectCursor(5);
  });

  test("no space shows no completion", () => {
    autocomplete().type("(name").expectCompletions([]).expectCursor(5);
  });
});

describe("Autocomplete basic typing", () => {
  test("typing opening parenthesis shows field completions", () => {
    autocomplete()
      .type("(")
      .expectCompletions([
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
        "remoteci.name",
        "pipeline.name",
        "id",
      ])
      .expectCursor(1)
      .expectInput("(");
  });
  test("typing partial field filters completions", () => {
    autocomplete()
      .type("(t")
      .expectCompletions([
        "tags",
        "team.name",
        "topic.name",
        "team.id",
        "tests.name",
        "tests.testsuites.testcases.name",
        "tests.testsuites.testcases.action",
        "tests.testsuites.testcases.classname",
      ])
      .expectCursor(2)
      .expectInput("(t");
  });

  test("typing more characters further filters completions", () => {
    autocomplete()
      .type("(to")
      .expectCompletions(["topic.name"])
      .expectCursor(3)
      .expectInput("(to");
  });

  test("shows completions after first parenthesis complete", () => {
    autocomplete()
      .type("(topic.name='RHEL-9.4') or (to")
      .expectCompletions(["topic.name"])
      .expectCursor(30)
      .expectInput("(topic.name='RHEL-9.4') or (to");
  });
});

describe("Autocomplete arrow navigation", () => {
  test("arrow down fills input after user it enter", () => {
    autocomplete()
      .type("(")
      .expectCompletions([
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
        "remoteci.name",
        "pipeline.name",
        "id",
      ])
      .arrowDown()
      .expectCursor(1)
      .expectInput("(")
      .enter()
      .expectCursor(5)
      .expectInput("(tags ")
      .expectCompletions(["in", "not_in"]);
  });
  test("arrow down twice shows second completion", () => {
    autocomplete()
      .type("(")
      .expectCompletions([
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
        "remoteci.name",
        "pipeline.name",
        "id",
      ])
      .arrowDown(2)
      .enter()
      .expectCursor(16)
      .expectInput("(components.name ")
      .expectCompletions(["=", "!=", "in", "not_in", "=~"]);
  });
  test("arrow down 11 times return on first choice", () => {
    autocomplete()
      .type("(")
      .expectCompletions([
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
        "remoteci.name",
        "pipeline.name",
        "id",
      ])
      .arrowDown(11)
      .enter()
      .expectCursor(5)
      .expectInput("(tags ")
      .expectCompletions(["in", "not_in"]);
  });
});

describe("Autocomplete operators", () => {
  test("list operator", () => {
    autocomplete().type("(tags ").expectCompletions(["in", "not_in"]);
  });
  test("select list operator add spaces, single quotes and brackets", () => {
    autocomplete()
      .type("(tags ")
      .selectCompletion("not_in")
      .expectInput("(tags not_in [''])")
      .expectCursor(15);
  });
  test("string operator", () => {
    autocomplete()
      .type("(name ")
      .expectCompletions(["=", "!=", "in", "not_in", "=~"]);
  });
  test("select comparison operator add spaces and single quote", () => {
    autocomplete()
      .type("(name ")
      .selectCompletion("=")
      .expectInput("(name = '')")
      .expectCursor(9);
  });
  test("number operator", () => {
    autocomplete()
      .type("(duration ")
      .expectCompletions(["=", "!=", ">", "<", "<=", ">="]);
  });
  test("select number operator add spaces and parenthesis", () => {
    autocomplete()
      .type("(duration ")
      .selectCompletion(">")
      .expectInput("(duration > )")
      .expectCursor(12);
  });
  test("logic operator", () => {
    autocomplete().type("(name = 'foo') ").expectCompletions(["and", "or"]);
  });
  test("select logic operator spaces and single quote", () => {
    autocomplete()
      .type("(duration ")
      .selectCompletion(">")
      .expectInput("(duration > )")
      .expectCursor(12);
  });
  test("regex operator", () => {
    autocomplete()
      .type("(name ")
      .expectCompletions(["=", "!=", "in", "not_in", "=~"])
      .selectCompletion("=~")
      .expectInput("(name =~ '')")
      .expectCursor(10);
  });
});

describe("Autocomplete completionValues", () => {
  test("shows completion values for string field with = operator", () => {
    autocomplete({}, { status: ["success", "failure", "error"] })
      .type("(status='")
      .expectCompletions(["success", "failure", "error"]);
  });

  test("shows completion values for string field with in operator", () => {
    autocomplete({}, { "topic.name": ["RHEL-9.4", "RHEL-9.3", "RHEL-8.9"] })
      .type("(topic.name in ['")
      .expectCompletions(["RHEL-9.4", "RHEL-9.3", "RHEL-8.9"]);
  });

  test("filters completion values by prefix", () => {
    autocomplete({}, { status: ["success", "failure", "error", "skipped"] })
      .type("(status='s")
      .expectCompletions(["success", "skipped"]);
  });
});

describe("AutocompleteTestBuilder complex scenarios", () => {
  test("completion are displayed when user type space", () => {
    autocomplete()
      .type("(tags")
      .expectCompletions([])
      .expectCursor(5)
      .expectInput("(tags")
      .type(" ")
      .expectCursor(6)
      .expectInput("(tags ")
      .expectCompletions(["in", "not_in"]);
  });

  test("complete filter expression with dynamic values", () => {
    autocomplete({}, { "topic.name": ["topic 1", "topic 2"] })
      .type("(")
      .type("t")
      .type("o")
      .selectCompletion("topic.name")
      .selectCompletion("not_in")
      .expectCompletions(["topic 1", "topic 2"])
      .selectCompletion("topic 1")
      .expectInput("(topic.name not_in ['topic 1'])")
      .type(" ")
      .expectCompletions(["and", "or"]);
  });

  test("logical operator after complete expression", () => {
    autocomplete()
      .type("(name='test') ")
      .expectCompletions(["and", "or"])
      .selectCompletion("and")
      .expectInput("(name='test') and (")
      .expectCompletions([
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
        "remoteci.name",
        "pipeline.name",
        "id",
      ]);
  });

  test("progressive typing scenario", () => {
    autocomplete()
      .type("(")
      .expectCompletions([
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
        "remoteci.name",
        "pipeline.name",
        "id",
      ])
      .type("t")
      .expectInput("(t")
      .expectCompletions([
        "tags",
        "team.name",
        "topic.name",
        "team.id",
        "tests.name",
        "tests.testsuites.testcases.name",
        "tests.testsuites.testcases.action",
        "tests.testsuites.testcases.classname",
      ])
      .type("o")
      .expectInput("(to")
      .expectCompletions(["topic.name"])
      .selectCompletion("topic.name")
      .expectInput("(topic.name ")
      .expectCompletions(["=", "!=", "in", "not_in", "=~"])
      .selectCompletion("not_in")
      .expectInput("(topic.name not_in [''])")
      .type("t")
      .expectInput("(topic.name not_in ['t'])")
      .expectCompletions([]);
  });

  test("nested field autocomplete", () => {
    autocomplete()
      .type("(tes")
      .expectCompletions([
        "tests.name",
        "tests.testsuites.testcases.name",
        "tests.testsuites.testcases.action",
        "tests.testsuites.testcases.classname",
      ]);
  });

  test("nodes hardware network interfaces autocomplete", () => {
    autocomplete()
      .type("(nodes.hardware.ne")
      .expectCompletions([
        "nodes.hardware.network_interfaces.model",
        "nodes.hardware.network_interfaces.autonegotiation",
        "nodes.hardware.network_interfaces.businfo",
        "nodes.hardware.network_interfaces.description",
        "nodes.hardware.network_interfaces.device_id",
        "nodes.hardware.network_interfaces.driver",
        "nodes.hardware.network_interfaces.driver_version",
        "nodes.hardware.network_interfaces.duplex",
        "nodes.hardware.network_interfaces.firmware",
        "nodes.hardware.network_interfaces.firmware_ncsi",
      ]);
  });

  test("and operator after close parenthesis", () => {
    autocomplete()
      .type("(name='test')")
      .expectCompletions([])
      .type(" ")
      .expectCompletions(["and", "or"])
      .selectCompletion("and")
      .expectInput("(name='test') and (")
      .expectCompletions([
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
        "remoteci.name",
        "pipeline.name",
        "id",
      ]);
  });

  test("Select two values doesn't add extra bracket and parenthesis", () => {
    autocomplete({}, { "topic.name": ["RHEL-9.4", "RHEL-9.3", "RHEL-8.9"] })
      .type("(topic.name ")
      .expectCompletions(["=", "!=", "in", "not_in", "=~"])
      .selectCompletion("not_in")
      .expectInput("(topic.name not_in [''])")
      .expectCompletions(["RHEL-9.4", "RHEL-9.3", "RHEL-8.9"])
      .selectCompletion("RHEL-9.4")
      .expectInput("(topic.name not_in ['RHEL-9.4'])")
      .expectCursor(32)
      .arrowLeft(2)
      .expectCursor(30)
      .type(", '")
      .expectCompletions(["RHEL-9.4", "RHEL-9.3", "RHEL-8.9"])
      .selectCompletion("RHEL-9.3")
      .expectInput("(topic.name not_in ['RHEL-9.4', 'RHEL-9.3'])");
  });
});

describe("Autocomplete history", () => {
  test("historical queries appear first max 2", () => {
    autocomplete(
      {},
      {},
      {
        queries: ["(status='success')", "(name='test')"],
        maxSuggestions: 2,
      },
    )
      .type("(")
      .expectCompletions([
        "(status='success')",
        "(name='test')",
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
        "remoteci.name",
      ]);
  });

  test("historical queries are limited by maxSuggestions", () => {
    autocomplete(
      {},
      {},
      {
        queries: [
          "(status='success')",
          "(name='test')",
          "(team.name='QE')",
          "(topic.name='RHEL-9.4')",
        ],
        maxSuggestions: 3,
      },
    )
      .type("(")
      .expectCompletions([
        "(status='success')",
        "(name='test')",
        "(team.name='QE')",
        "tags",
        "components.name",
        "status",
        "team.name",
        "components.type",
        "topic.name",
        "name",
      ]);
  });

  test("historical queries are filtered and should match the query", () => {
    autocomplete(
      {},
      {},
      {
        queries: [
          "(status='success')",
          "(name='test')",
          "(component.name='R2D2')",
          "(topic.name='RHEL-9.4')",
        ],
        maxSuggestions: 3,
      },
    )
      .type("R2D2")
      .expectCompletions(["(component.name='R2D2')"]);
  });
  test("historical queries are filtered", () => {
    autocomplete(
      {},
      {},
      {
        queries: [
          "(status='success') and (name='foo')",
          "(status='error') and (name='foo')",
          "(status='success') and (name='bar')",
        ],
        maxSuggestions: 2,
      },
    )
      .type("(status='success')")
      .expectCompletions([
        "(status='success') and (name='foo')",
        "(status='success') and (name='bar')",
      ]);
  });
  test("historical exact queries are not returned", () => {
    autocomplete(
      {},
      {},
      {
        queries: ["(status='success')"],
        maxSuggestions: 2,
      },
    )
      .type("(status='success')")
      .expectCompletions([]);
  });
  test("apply completion replace when history", () => {
    autocomplete(
      {},
      {},
      {
        queries: ["(status='success')"],
        maxSuggestions: 2,
      },
    )
      .type("(status='")
      .expectCompletions(["(status='success')"])
      .clickCompletion("(status='success')")
      .expectInput("(status='success')");
  });
});

describe("_parseInput", () => {
  test("empty", () => {
    expect(_parseSyntax("", 0)).toEqual({
      type: "field",
      prefix: "",
      replaceStart: 0,
      replaceEnd: 0,
    });
  });

  test("(name='", () => {
    expect(_parseSyntax("(name='", 7)).toEqual({
      type: "value",
      fieldName: "name",
      operator: "=",
      prefix: "",
      replaceStart: 7,
      replaceEnd: 7,
    });
  });

  test("(name='tot", () => {
    expect(_parseSyntax("(name='tot", 10)).toEqual({
      type: "value",
      fieldName: "name",
      operator: "=",
      prefix: "tot",
      replaceStart: 7,
      replaceEnd: 10,
    });
  });

  test("(name in ['", () => {
    expect(_parseSyntax("(name in ['", 11)).toEqual({
      type: "value",
      fieldName: "name",
      operator: "in",
      prefix: "",
      replaceStart: 11,
      replaceEnd: 11,
    });
  });

  test("(name in ['tot", () => {
    expect(_parseSyntax("(name in ['tot", 14)).toEqual({
      type: "value",
      fieldName: "name",
      operator: "in",
      prefix: "tot",
      replaceStart: 11,
      replaceEnd: 14,
    });
  });

  test("(team.name='foo", () => {
    expect(_parseSyntax("(team.name='foo", 15)).toEqual({
      type: "value",
      fieldName: "team.name",
      operator: "=",
      prefix: "foo",
      replaceStart: 12,
      replaceEnd: 15,
    });
  });

  test("(name ", () => {
    expect(_parseSyntax("(name ", 6)).toEqual({
      type: "operator",
      fieldName: "name",
    });
  });

  test("(tags ", () => {
    expect(_parseSyntax("(tags ", 6)).toEqual({
      type: "operator",
      fieldName: "tags",
    });
  });

  test("name ", () => {
    expect(_parseSyntax("name ", 5)).toEqual({
      type: "operator",
      fieldName: "name",
    });
  });

  test("(name='test')", () => {
    expect(_parseSyntax("(name='test')", 13)).toEqual({
      type: "logical",
    });
  });

  test("(name='test') ", () => {
    expect(_parseSyntax("(name='test') ", 14)).toEqual({
      type: "logical",
    });
  });

  test("(topic.name='RHEL-9.4') or (to", () => {
    expect(_parseSyntax("(topic.name='RHEL-9.4') or (to", 30)).toEqual({
      type: "field",
      prefix: "to",
      replaceStart: 28,
      replaceEnd: 30,
    });
  });
});
