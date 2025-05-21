import { FinalJobStatuses, IAnalyticsJob, IFinalJobStatus } from "types";
import {
  t_global_color_status_danger_default,
  t_global_color_status_warning_default,
  t_global_color_status_success_default,
} from "@patternfly/react-tokens";
import { getPrincipalComponent } from "topics/component/componentSelector";

export const groupByKeys = [
  "topic",
  "pipeline",
  "component",
  "name",
  "remoteci",
  "team",
  "configuration",
  "comment",
  "url",
  "status",
  "status_reason",
] as const;
export type IGroupByKey = (typeof groupByKeys)[number];
export const groupByKeysWithLabel: Record<IGroupByKey, string> = {
  topic: "Topic name",
  pipeline: "Pipeline name",
  component: "Component name",
  name: "Job name",
  team: "Team name",
  remoteci: "Remoteci name",
  configuration: "Configuration",
  comment: "Comments",
  url: "URL",
  status: "Status",
  status_reason: "Status reason",
};

// Keys for slicing data inside each group (pie chart slices)
export type ISliceByKey = "status" | IGroupByKey;
export const sliceByKeys: ISliceByKey[] = ["status", ...groupByKeys];
export const sliceByKeysWithLabel: Record<ISliceByKey, string> = {
  ...groupByKeysWithLabel,
  status: "Status",
};

// Generic statistic entry for a slice
export interface IStat {
  color: string;
  total: number;
  label: string;
}

// For backward compatibility, alias IJobStat for status-only stats
export type IJobStat = Record<IFinalJobStatus, IStat>;

function getJobKey(job: IAnalyticsJob, groupByKey: IGroupByKey) {
  let key: string | null = null;

  switch (groupByKey) {
    case "topic":
      key = job.topic.name;
      break;
    case "pipeline":
      if (job.pipeline !== null) {
        key = job.pipeline.name;
      }
      break;
    case "component":
      key = getPrincipalComponent(job.components)?.display_name || null;
      break;
    case "name":
      key = job.name;
      break;
    case "remoteci":
      key = job.remoteci.name;
      break;
    case "team":
      key = job.team.name;
      break;
    case "configuration":
      key = job.configuration;
      break;
    case "comment":
      key = job.comment;
      break;
    default:
      const value = (job as any)[groupByKey];
      if (value == null) {
        key = null;
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        key = value.toString();
      } else {
        key = JSON.stringify(value);
      }
      break;
  }
  return key;
}

/**
 * Compute statistics for jobs, grouping them by groupByKey and slicing each group
 * by sliceByKey. By default, sliceByKey is 'status', preserving the original behavior.
 */
export function getJobStats(
  data: IAnalyticsJob[],
  groupByKey: IGroupByKey,
  sliceByKey: ISliceByKey = "status",
): Record<string, Record<string, IStat>> {
  const emptyStats: Record<string, Record<string, IStat>> = {};
  if (data.length === 0) {
    return emptyStats;
  }

  // Mapping for status colors and labels
  const statusColorsMap: Record<IFinalJobStatus, string> = {
    success: t_global_color_status_success_default.var,
    failure: t_global_color_status_danger_default.var,
    error: t_global_color_status_danger_default.var,
    killed: t_global_color_status_warning_default.var,
  };
  const statusLabelsMap: Record<IFinalJobStatus, string> = {
    success: "Successful jobs",
    failure: "Failed jobs",
    error: "Errored jobs",
    killed: "Killed jobs",
  };

  // Default color palette for non-status slices
  const chartColors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ];
  const sliceColorMap: Record<string, string> = {};
  let nextColor = 0;

  const result: Record<string, Record<string, IStat>> = {};
  for (const job of data) {
    const groupKeyValue = getJobKey(job, groupByKey);
    if (!groupKeyValue) {
      continue;
    }

    // Determine slice value and skip invalid entries
    let sliceValue: string | null = null;
    if (sliceByKey === "status") {
      const jobStatus = job.status;
      if (!(FinalJobStatuses as readonly string[]).includes(jobStatus)) {
        continue;
      }
      sliceValue = jobStatus as IFinalJobStatus;
    } else {
      sliceValue = getJobKey(job, sliceByKey);
    }
    if (!sliceValue) {
      continue;
    }

    // Initialize group bucket, pre-populating all statuses for sliceByKey === 'status'
    if (!result[groupKeyValue]) {
      if (sliceByKey === "status") {
        const initial: Record<string, IStat> = {};
        FinalJobStatuses.forEach((status) => {
          initial[status] = {
            color: statusColorsMap[status],
            total: 0,
            label: statusLabelsMap[status],
          };
        });
        result[groupKeyValue] = initial;
      } else {
        result[groupKeyValue] = {};
      }
    }
    const groupStats = result[groupKeyValue];

    // Assign a color to this slice if not already done
    if (!sliceColorMap[sliceValue]) {
      sliceColorMap[sliceValue] =
        sliceByKey === "status"
          ? statusColorsMap[sliceValue as IFinalJobStatus]
          : chartColors[nextColor++ % chartColors.length];
    }

    // Initialize slice entry if missing
    if (!groupStats[sliceValue]) {
      groupStats[sliceValue] = {
        color: sliceColorMap[sliceValue],
        total: 0,
        label:
          sliceByKey === "status"
            ? statusLabelsMap[sliceValue as IFinalJobStatus]
            : sliceValue,
      };
    }
    groupStats[sliceValue].total += 1;
  }

  return result;
}
