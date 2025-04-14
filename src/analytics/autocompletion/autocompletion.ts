export const FIELDS = [
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
  asyncValueCompletions?: Partial<Record<FieldName, string[]>>
}
const defaultOptions: AutoCompletionOptions = {
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
  asyncValueCompletions: {
    "status": ['success', 'failure', 'error']
  }
};

export function getCompletions(
  input: string,
  cursor: number,
  options: AutoCompletionOptions = defaultOptions,
): Completion[] {
  let prefix = input.slice(0, cursor).trim().toLowerCase();

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

  prefix = prefix.slice(lastParenthesisIndex + 1);

  const field = options.fields.find((f) => f.name === prefix);
  if (field) {
    return options.operators.comparison[field.type].map((op) => {
      return {
        value: op,
        insertText: op === "in" || op === "not_in" ? `${op} ['` : `${op} `,
      };
    });
  }

  return options.fields
    .filter((field) => field.name.toLowerCase().startsWith(prefix))
    .slice(0, 10)
    .map((field) => ({
      value: field.name,
      insertText: `${field.name} `,
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
  const match = prefix.match(/[\w$.]*$/);
  const start = match ? cursor - match[0].length : cursor;
  const newValue = value.slice(0, start) + completion.insertText + suffix;
  const newCursor = start + completion.insertText.length;
  return {
    newValue,
    newCursor,
  };
}
