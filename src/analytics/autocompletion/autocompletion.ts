const FIELDS = [
  "name",
  "tags",
  "comment",
  "status",
  "team.name",
  "components.type",
  "components.tags",
  "topic.name",
  "remoteci.name",
  "pipeline.name",
  "results.success",
  "id",
  "configuration",
  "created_at",
  "keys_values",
  "status_reason",
  "duration",
  "pipeline.id",
  "pipeline.created_at",
  "components.id",
  "components.topic_id",
  "components.display_name",
  "results.errors",
  "results.failures",
  "results.skips",
  "results.total",
  "team.id",
  "components.name",
  "tests.name",
  "tests.testsuites.testcases.name",
  "tests.testsuites.testcases.action",
  "tests.testsuites.testcases.classname",
  "nodes.hardware.bios_date",
  "nodes.hardware.bios_type",
  "nodes.hardware.bios_vendor",
  "nodes.hardware.bios_version",
  "nodes.hardware.cpu_frequency_mhz",
  "nodes.hardware.cpu_model",
  "nodes.hardware.cpu_sockets",
  "nodes.hardware.cpu_total_cores",
  "nodes.hardware.cpu_total_threads",
  "nodes.hardware.cpu_vendor",
  "nodes.hardware.filename",
  "nodes.hardware.memory_dimm_count",
  "nodes.hardware.memory_total_gb",
  "nodes.hardware.network_interfaces.autonegotiation",
  "nodes.hardware.network_interfaces.businfo",
  "nodes.hardware.network_interfaces.description",
  "nodes.hardware.network_interfaces.device_id",
  "nodes.hardware.network_interfaces.driver",
  "nodes.hardware.network_interfaces.driver_version",
  "nodes.hardware.network_interfaces.duplex",
  "nodes.hardware.network_interfaces.firmware",
  "nodes.hardware.network_interfaces.firmware_ncsi",
  "nodes.hardware.network_interfaces.firmware_version",
  "nodes.hardware.network_interfaces.is_virtual_function",
  "nodes.hardware.network_interfaces.link_status",
  "nodes.hardware.network_interfaces.logical_name",
  "nodes.hardware.network_interfaces.model",
  "nodes.hardware.network_interfaces.speed_mbps",
  "nodes.hardware.network_interfaces.subdevice_id",
  "nodes.hardware.network_interfaces.subproduct",
  "nodes.hardware.network_interfaces.subvendor",
  "nodes.hardware.network_interfaces.subvendor_id",
  "nodes.hardware.network_interfaces.vendor",
  "nodes.hardware.network_interfaces.vendor_id",
  "nodes.hardware.node",
  "nodes.hardware.storage_devices.businfo",
  "nodes.hardware.storage_devices.description",
  "nodes.hardware.storage_devices.device_id",
  "nodes.hardware.storage_devices.firmware",
  "nodes.hardware.storage_devices.model",
  "nodes.hardware.storage_devices.size_gb",
  "nodes.hardware.storage_devices.type",
  "nodes.hardware.storage_devices.vendor",
  "nodes.hardware.storage_devices.vendor_id",
  "nodes.hardware.storage_devices.version",
  "nodes.hardware.system_family",
  "nodes.hardware.system_model",
  "nodes.hardware.system_sku",
  "nodes.hardware.system_vendor",
  "nodes.kernel.version",
] as const;
export type FieldName = (typeof FIELDS)[number];
export type FieldType = "string" | "number" | "boolean" | "list";
export type Field = { name: FieldName; type: FieldType };
export type Completion = { value: string; insertText: string };
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
export interface AutoCompletionOptions {
  fields: Field[];
  operators: {
    comparison: Record<FieldType, ComparisonOperator[]>;
    logical: LogicalOperator[];
  };
}
export type AutoCompletionValues = Partial<Record<FieldName, string[]>>;
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

type ParseOutput = {
  lastParenthesisIndex: number;
  field: string;
  operator: ComparisonOperator | null;
  value: string | null;
} | null;

export function parseInput(input: string): ParseOutput {
  const lastParenthesisIndex = input.lastIndexOf("(");
  if (lastParenthesisIndex === -1) {
    return null;
  }
  const afterParenthesis = input.slice(lastParenthesisIndex).trim();
  if (afterParenthesis.endsWith(")")) {
    return null;
  }
  const fieldOpValRegex =
    /\(\s*([\w.]+)\s*(in|not_in|!=|=~|>=|<=|=|>|<)?(?:\s*\[?')?(\w+)?/;
  const match = afterParenthesis.match(fieldOpValRegex);
  if (!match) return null;
  const [, field, rawOperator, rawValue] = match;
  const operator = (rawOperator as ComparisonOperator) || null;
  const value =
    afterParenthesis.endsWith("'") && !rawValue ? "" : rawValue || null;
  return { lastParenthesisIndex, field, operator, value };
}

export type CompletionValues = Partial<Record<FieldName, string[]>>;

export function getCompletions(
  input: string,
  cursor: number,
  completionValues: CompletionValues = {},
  options: AutoCompletionOptions = defaultOptions,
): Completion[] {
  const prefix = input.slice(0, cursor).trim().toLowerCase();

  if (prefix === "") {
    return [];
  }

  const lastParenthesisIndex = prefix.lastIndexOf("(");
  if (lastParenthesisIndex === -1) {
    return [];
  }

  if (prefix[prefix.length - 1] === ")") {
    return options.operators.logical.map((op) => {
      return {
        value: op,
        insertText: ` ${op} (`,
      };
    });
  }

  if (prefix.endsWith("(")) {
    return options.fields.slice(0, 10).map((field) => ({
      value: field.name,
      insertText: `${field.name} `,
    }));
  }

  const parsedInput = parseInput(prefix);
  if (parsedInput === null) return [];
  const { field, operator, value } = parsedInput;
  const completeField = options.fields.find((f) => f.name === field) || null;
  if (completeField && operator) {
    const asyncValues = completionValues[completeField.name] ?? [];
    const filteredAsyncValues =
      value === null
        ? asyncValues
        : asyncValues.filter((v) => v.toLowerCase().startsWith(value));
    return filteredAsyncValues.slice(0, 10).map((v) => {
      return {
        value: v,
        insertText:
          operator === "in" || operator === "not_in" ? `${v}'])` : `${v}')`,
      };
    });
  }

  if (completeField) {
    return options.operators.comparison[completeField.type].map((op) => {
      return {
        value: op,
        insertText: op === "in" || op === "not_in" ? ` ${op} ['` : `${op}'`,
      };
    });
  }

  return options.fields
    .filter((f) => f.name.toLowerCase().startsWith(field))
    .slice(0, 10)
    .map((f) => ({
      value: f.name,
      insertText: `${f.name} `,
    }));
}

export function applyCompletion({
  value,
  cursor,
  completion,
}: {
  value: string;
  cursor: number;
  completion: Completion;
}): { newValue: string; newCursor: number } {
  const prefix = value.slice(0, cursor);
  const suffix = value.slice(cursor);

  if (prefix.endsWith(")") || prefix.endsWith("(")) {
    const v = prefix + completion.insertText + suffix;
    return {
      newValue: v,
      newCursor: v.length,
    };
  }

  const parsedInput = parseInput(prefix);
  if (parsedInput === null) {
    const newValue = completion.insertText + suffix;
    return {
      newValue,
      newCursor: completion.insertText.length,
    };
  }
  const { field, operator, lastParenthesisIndex } = parsedInput;
  const completeField = FIELDS.find((f) => f === field) || null;
  let elements = [];
  if (completeField && operator) {
    elements = [value, completion.insertText, suffix];
  } else if (completeField) {
    elements = [
      value.slice(0, lastParenthesisIndex + 1),
      completeField,
      completion.insertText,
      suffix,
    ];
  } else {
    elements = [
      value.slice(0, lastParenthesisIndex + 1),
      completion.insertText,
      suffix,
    ];
  }

  const newValue = elements.filter((e) => e !== null && e !== "").join("");
  const newCursor = newValue.length;
  return {
    newValue,
    newCursor,
  };
}

type AutocompleteInfo = { field: string; value: string } | null;

export function extractAutocompleteInfo(
  input: string,
  cursor: number,
): AutocompleteInfo {
  const textUpToCursor = input.slice(0, cursor);

  const patterns = [
    /\(?([\w.]+)\s*(?:!=|=~|>=|<=|=|>|<)\s*'([^']*)$/,
    /\(?([\w.]+)\s+(?:in|not_in)\s+\[\s*(?:'[^']*'\s*,\s*)*'([^']*)$/,
  ];

  for (const pattern of patterns) {
    const match = textUpToCursor.match(pattern);
    if (match) {
      return {
        field: match[1],
        value: match[2],
      };
    }
  }

  return null;
}
