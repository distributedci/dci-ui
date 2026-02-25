export type FieldType = "string" | "number" | "boolean" | "list";
export type ComparisonOperator =
  | "="
  | "!="
  | "in"
  | "not_in"
  | ">"
  | "<"
  | "=~"
  | ">="
  | "<=";
export type LogicalOperator = "and" | "or";
export type ListOperator = "in" | "not_in";
export type NumericOperator = ">" | "<" | ">=" | "<=";

const MAX_COMPLETIONS = 10;

export interface AutoCompletionOptions {
  fields: Array<{
    name: string;
    type: FieldType;
  }>;
  operators: {
    comparison: Record<FieldType, ComparisonOperator[]>;
    logical: LogicalOperator[];
  };
}
export const defaultOptions: AutoCompletionOptions = {
  fields: [
    { name: "tags", type: "list" },
    { name: "components.name", type: "string" },
    { name: "status", type: "string" },
    { name: "team.name", type: "string" },
    { name: "components.type", type: "string" },
    { name: "topic.name", type: "string" },
    { name: "name", type: "string" },
    { name: "remoteci.name", type: "string" },
    { name: "pipeline.name", type: "string" },
    { name: "id", type: "string" },
    { name: "configuration", type: "string" },
    { name: "components.tags", type: "list" },
    { name: "created_at", type: "string" },
    { name: "keys_values", type: "string" },
    { name: "status_reason", type: "string" },
    { name: "duration", type: "number" },
    { name: "pipeline.id", type: "string" },
    { name: "pipeline.created_at", type: "string" },
    { name: "components.id", type: "string" },
    { name: "components.topic_id", type: "string" },
    { name: "components.display_name", type: "string" },
    { name: "comment", type: "string" },
    { name: "team.id", type: "string" },
    { name: "results.success", type: "number" },
    { name: "results.errors", type: "number" },
    { name: "results.failures", type: "number" },
    { name: "results.skips", type: "number" },
    { name: "results.total", type: "number" },
    { name: "tests.name", type: "string" },
    { name: "tests.testsuites.testcases.name", type: "string" },
    { name: "tests.testsuites.testcases.action", type: "string" },
    { name: "tests.testsuites.testcases.classname", type: "string" },
    { name: "nodes.hardware.network_interfaces.model", type: "string" },
    { name: "nodes.hardware.cpu_model", type: "string" },
    { name: "nodes.hardware.bios_version", type: "string" },
    { name: "nodes.hardware.storage_devices.model", type: "string" },
    { name: "nodes.hardware.storage_devices.version", type: "string" },
    { name: "nodes.kernel.version", type: "string" },
    { name: "nodes.hardware.node", type: "string" },
    { name: "nodes.hardware.system_model", type: "string" },
    { name: "nodes.hardware.cpu_total_cores", type: "number" },
    { name: "nodes.hardware.bios_date", type: "string" },
    { name: "nodes.hardware.bios_type", type: "string" },
    { name: "nodes.hardware.bios_vendor", type: "string" },
    { name: "nodes.hardware.cpu_frequency_mhz", type: "number" },
    { name: "nodes.hardware.cpu_sockets", type: "number" },
    { name: "nodes.hardware.cpu_total_threads", type: "number" },
    { name: "nodes.hardware.cpu_vendor", type: "string" },
    { name: "nodes.hardware.filename", type: "string" },
    { name: "nodes.hardware.memory_dimm_count", type: "number" },
    { name: "nodes.hardware.memory_total_gb", type: "number" },
    {
      name: "nodes.hardware.network_interfaces.autonegotiation",
      type: "boolean",
    },
    { name: "nodes.hardware.network_interfaces.businfo", type: "string" },
    { name: "nodes.hardware.network_interfaces.description", type: "string" },
    { name: "nodes.hardware.network_interfaces.device_id", type: "string" },
    { name: "nodes.hardware.network_interfaces.driver", type: "string" },
    {
      name: "nodes.hardware.network_interfaces.driver_version",
      type: "string",
    },
    { name: "nodes.hardware.network_interfaces.duplex", type: "string" },
    { name: "nodes.hardware.network_interfaces.firmware", type: "string" },
    { name: "nodes.hardware.network_interfaces.firmware_ncsi", type: "string" },
    {
      name: "nodes.hardware.network_interfaces.firmware_version",
      type: "string",
    },
    {
      name: "nodes.hardware.network_interfaces.is_virtual_function",
      type: "boolean",
    },
    { name: "nodes.hardware.network_interfaces.link_status", type: "boolean" },
    { name: "nodes.hardware.network_interfaces.logical_name", type: "string" },
    { name: "nodes.hardware.network_interfaces.speed_mbps", type: "number" },
    { name: "nodes.hardware.network_interfaces.subdevice_id", type: "string" },
    { name: "nodes.hardware.network_interfaces.subproduct", type: "string" },
    { name: "nodes.hardware.network_interfaces.subvendor", type: "string" },
    { name: "nodes.hardware.network_interfaces.subvendor_id", type: "string" },
    { name: "nodes.hardware.network_interfaces.vendor", type: "string" },
    { name: "nodes.hardware.network_interfaces.vendor_id", type: "string" },
    { name: "nodes.hardware.storage_devices.businfo", type: "string" },
    { name: "nodes.hardware.storage_devices.description", type: "string" },
    { name: "nodes.hardware.storage_devices.device_id", type: "string" },
    { name: "nodes.hardware.storage_devices.firmware", type: "string" },
    { name: "nodes.hardware.storage_devices.size_gb", type: "number" },
    { name: "nodes.hardware.storage_devices.type", type: "string" },
    { name: "nodes.hardware.storage_devices.vendor", type: "string" },
    { name: "nodes.hardware.storage_devices.vendor_id", type: "string" },
    { name: "nodes.hardware.system_family", type: "string" },
    { name: "nodes.hardware.system_sku", type: "string" },
    { name: "nodes.hardware.system_vendor", type: "string" },
  ],
  operators: {
    comparison: {
      string: ["=", "!=", "in", "not_in", "=~"],
      number: ["=", "!=", ">", "<", "<=", ">="],
      boolean: ["=", "!="],
      list: ["in", "not_in"],
    },
    logical: ["and", "or"],
  },
};

export type AutoCompletionValues = Record<string, string[]>;

export type AutoCompletionHistory = {
  queries: string[];
  maxSuggestions: number;
};

export type Completion = {
  value: string;
  insertText: string;
  type: "history" | "field" | "operator" | "value";
};

export type Syntax = {
  type: "field" | "operator" | "value" | "logical";
  fieldName?: string;
  operator?: string;
  prefix?: string;
  replaceStart?: number;
  replaceEnd?: number;
};

export interface CompletionContext {
  input: string;
  cursor: number;
  options?: AutoCompletionOptions;
  values: AutoCompletionValues;
  history: AutoCompletionHistory;
  completions: Completion[];
  syntax: Syntax | null;
}

export const defaultCompletionContext: CompletionContext = {
  input: "",
  cursor: 0,
  values: {},
  history: { queries: [], maxSuggestions: 2 },
  completions: [],
  syntax: null,
};

function createCompletion(
  value: string,
  type: "history" | "field" | "operator" | "value",
): Completion {
  return { value, insertText: value, type };
}

function createValueContext(
  fieldName: string,
  operator: string,
  prefix: string,
  cursor: number,
): Syntax {
  return {
    type: "value",
    fieldName,
    operator,
    prefix,
    replaceStart: cursor - prefix.length,
    replaceEnd: cursor,
  };
}

function parseValueSyntax(
  textBeforeCursor: string,
  cursor: number,
): Syntax | null {
  const notEqualMatch = textBeforeCursor.match(
    /(?:^|\()([a-zA-Z0-9._]+)\s*!=\s*'([^']*)$/,
  );
  if (notEqualMatch) {
    return createValueContext(notEqualMatch[1], "!=", notEqualMatch[2], cursor);
  }

  const equalMatch = textBeforeCursor.match(
    /(?:^|\()([a-zA-Z0-9._]+)\s*=\s*'([^']*)$/,
  );
  if (equalMatch) {
    return createValueContext(equalMatch[1], "=", equalMatch[2], cursor);
  }

  const inMultipleMatch = textBeforeCursor.match(
    /(?:^|\()([a-zA-Z0-9._]+)\s+(in|not_in)\s+\['[^']*',\s*'([^']*)$/,
  );
  if (inMultipleMatch) {
    return createValueContext(
      inMultipleMatch[1],
      inMultipleMatch[2],
      inMultipleMatch[3],
      cursor,
    );
  }

  const inMatch = textBeforeCursor.match(
    /(?:^|\()([a-zA-Z0-9._]+)\s+(in|not_in)\s+\['\s*([^']*)$/,
  );
  if (inMatch) {
    return createValueContext(inMatch[1], inMatch[2], inMatch[3], cursor);
  }

  return null;
}

function parseOperatorSyntax(
  textBeforeCursor: string,
  input: string,
  cursor: number,
): Syntax | null {
  const fieldWithSpaceMatch = textBeforeCursor.match(/\(([a-zA-Z0-9._]+)\s$/);
  if (fieldWithSpaceMatch) {
    return {
      type: "operator",
      fieldName: fieldWithSpaceMatch[1],
    };
  }

  const fieldWithSpaceNoParenMatch =
    textBeforeCursor.match(/^([a-zA-Z0-9._]+)\s$/);
  if (fieldWithSpaceNoParenMatch) {
    return {
      type: "operator",
      fieldName: fieldWithSpaceNoParenMatch[1],
    };
  }

  const fieldWithoutSpaceMatch = textBeforeCursor.match(
    /(?:^|\()([a-zA-Z0-9._]+)$/,
  );
  if (fieldWithoutSpaceMatch && input[cursor] === " ") {
    return {
      type: "operator",
      fieldName: fieldWithoutSpaceMatch[1],
    };
  }

  return null;
}

function parseLogicialSyntax(textBeforeCursor: string): Syntax | null {
  if (/\)\s*$/.test(textBeforeCursor)) {
    return { type: "logical" };
  }
  return null;
}

function parseFieldSyntax(
  textBeforeCursor: string,
  cursor: number,
): Syntax | null {
  const fieldPrefixMatch = textBeforeCursor.match(/(?:^|\()([a-zA-Z0-9._]*)$/);
  if (fieldPrefixMatch) {
    const prefix = fieldPrefixMatch[1];
    const replaceStart = cursor - prefix.length;
    return {
      type: "field",
      prefix,
      replaceStart,
      replaceEnd: cursor,
    };
  }

  return null;
}

export function _parseSyntax(input: string, cursor: number): Syntax | null {
  const textBeforeCursor = input.slice(0, cursor);

  const logicalSyntax = parseLogicialSyntax(textBeforeCursor);
  if (logicalSyntax) {
    return logicalSyntax;
  }

  const valueContext = parseValueSyntax(textBeforeCursor, cursor);
  if (valueContext) {
    return valueContext;
  }

  const operatorContext = parseOperatorSyntax(textBeforeCursor, input, cursor);
  if (operatorContext) {
    return operatorContext;
  }

  const fieldContext = parseFieldSyntax(textBeforeCursor, cursor);
  if (fieldContext) {
    return fieldContext;
  }

  return null;
}

export function getCompletions(
  completionContext: CompletionContext,
): CompletionContext {
  const {
    input,
    cursor,
    options = defaultOptions,
    values: completionValues,
    history,
  } = completionContext;

  if (input.length === 0) {
    return { ...defaultCompletionContext };
  }

  const result: Completion[] = [];

  if (history && history.queries.length > 0) {
    const matchingQueries = history.queries.filter(
      (query) => query.includes(input) && query.length != input.length,
    );

    result.push(
      ...matchingQueries
        .slice(0, history.maxSuggestions)
        .map((query) => createCompletion(query, "history")),
    );
  }

  const syntax = _parseSyntax(input, cursor);
  if (!syntax) {
    return {
      ...completionContext,
      completions: result.slice(0, MAX_COMPLETIONS),
      syntax: null,
    };
  }

  if (syntax.type === "logical") {
    const textBeforeCursor = input.slice(0, cursor);
    if (textBeforeCursor.endsWith(" ")) {
      result.push(
        ...options.operators.logical.map((op) =>
          createCompletion(op, "operator"),
        ),
      );
    }
  } else if (syntax.type === "value" && syntax.fieldName) {
    const values = completionValues[syntax.fieldName];
    if (values) {
      const prefix = syntax.prefix || "";
      const filteredValues =
        prefix === ""
          ? values
          : values.filter((value) => value.startsWith(prefix));

      result.push(...filteredValues.map((v) => createCompletion(v, "value")));
    }
  } else if (syntax.type === "operator" && syntax.fieldName) {
    if (input.includes("(")) {
      const field = options.fields.find((f) => f.name === syntax.fieldName);
      if (field) {
        const operators = options.operators.comparison[field.type];
        result.push(...operators.map((op) => createCompletion(op, "operator")));
      }
    }
  } else if (syntax.type === "field") {
    const prefix = syntax.prefix!;
    if (syntax.replaceStart !== 0) {
      if (prefix === "") {
        const filteredFields = options.fields.slice(0, MAX_COMPLETIONS);
        result.push(
          ...filteredFields.map((field) =>
            createCompletion(field.name, "field"),
          ),
        );
      } else {
        const exactMatch = options.fields.find((f) => f.name === prefix);
        if (!exactMatch) {
          const filteredFields = options.fields
            .filter((field) => field.name.startsWith(prefix))
            .slice(0, MAX_COMPLETIONS);

          result.push(
            ...filteredFields.map((field) =>
              createCompletion(field.name, "field"),
            ),
          );
        }
      }
    }
  }

  return {
    ...completionContext,
    completions: result.slice(0, MAX_COMPLETIONS),
    syntax,
  };
}

function isListOperator(
  operator: ComparisonOperator,
): operator is ListOperator {
  return operator === "in" || operator === "not_in";
}

function isNumericOperator(
  operator: ComparisonOperator,
): operator is NumericOperator {
  return (
    operator === ">" ||
    operator === "<" ||
    operator === ">=" ||
    operator === "<="
  );
}

function getClosingPattern(
  operator: ComparisonOperator,
  before: string,
): string {
  if (isListOperator(operator)) {
    if (before.endsWith(", '")) {
      return "'";
    }
    return "'])";
  }

  return "')";
}

function getOperatorSuffixAndOffset(operator: ComparisonOperator): {
  suffix: string;
  offset: number;
} {
  if (isListOperator(operator)) {
    return {
      suffix: " [''])",
      offset: 3,
    };
  }

  if (isNumericOperator(operator)) {
    return {
      suffix: " )",
      offset: 1,
    };
  }

  return {
    suffix: " '')",
    offset: 2,
  };
}

export function applyCompletion(
  completionContext: CompletionContext,
  completion: Completion,
): CompletionContext {
  const { input: value, cursor, syntax } = completionContext;

  if (completion.type === "history") {
    return {
      ...completionContext,
      input: completion.value,
      cursor: completion.value.length,
    };
  }

  if (!syntax) {
    return completionContext;
  }

  const textAfterCursor = value.slice(cursor);
  let newValue = value;
  let newCursor = cursor;

  if (syntax.type === "logical") {
    const textBeforeCursor = value.slice(0, cursor);
    const hasTrailingSpace = textBeforeCursor.endsWith(") ");

    let before = value.slice(0, cursor);
    const prefix = " ";
    const suffix = " (";
    let afterCursor = textAfterCursor;

    if (hasTrailingSpace) {
      before = value.slice(0, cursor - 1);
    }

    if (textAfterCursor[0] === " ") {
      afterCursor = textAfterCursor.slice(1);
    }

    newValue = before + prefix + completion.insertText + suffix + afterCursor;
    newCursor =
      before.length +
      prefix.length +
      completion.insertText.length +
      suffix.length;
  } else if (syntax.type === "value" && syntax.replaceStart !== undefined) {
    const before = value.slice(0, syntax.replaceStart);
    let suffix = "";
    let cursorOffset = 0;

    const expectedClosing = getClosingPattern(
      syntax.operator as ComparisonOperator,
      before,
    );

    if (!textAfterCursor.startsWith(expectedClosing)) {
      suffix = expectedClosing;
    } else {
      cursorOffset = expectedClosing.length;
    }

    newValue = before + completion.insertText + suffix + textAfterCursor;
    newCursor = before.length + completion.insertText.length + cursorOffset;
  } else if (syntax.type === "operator") {
    const before = value.slice(0, cursor);
    let prefix = "";
    let afterCursor = textAfterCursor;

    if (value[cursor - 1] !== " ") {
      prefix = " ";
    }

    if (textAfterCursor[0] === " ") {
      afterCursor = textAfterCursor.slice(1);
    }

    const { suffix, offset } = getOperatorSuffixAndOffset(
      completion.value as ComparisonOperator,
    );

    newValue = before + prefix + completion.insertText + suffix + afterCursor;
    newCursor =
      before.length + prefix.length + completion.insertText.length + offset;
  } else if (syntax.type === "field" && syntax.replaceStart !== undefined) {
    const before = value.slice(0, syntax.replaceStart);
    newValue = before + completion.insertText + " " + textAfterCursor;
    newCursor = before.length + completion.insertText.length;
  }

  return {
    ...completionContext,
    input: newValue,
    cursor: newCursor,
  };
}
