import type { IAnalyticsJob } from "types";
import type { IStat } from "analytics/jobsStats/jobStats";
import { DateTime } from "luxon";
import {
  chart_color_blue_300,
  chart_color_teal_300,
  chart_color_green_300,
  chart_color_orange_300,
  chart_color_red_orange_300,
  chart_color_purple_300,
  chart_color_yellow_300,
} from "@patternfly/react-tokens";

const chartColors = [
  chart_color_blue_300.var,
  chart_color_teal_300.var,
  chart_color_green_300.var,
  chart_color_orange_300.var,
  chart_color_red_orange_300.var,
  chart_color_purple_300.var,
  chart_color_yellow_300.var,
];

export interface IMetrics {
  total: number;
  failed: number;
  success: number;
}

export interface IRemoteciStat {
  name: string;
  success: number;
  failure: number;
}

export interface IProductStat {
  name: string;
  total: number;
}

export interface ITimeStat {
  name: string;
  key: number;
  success: number;
  failure: number;
}

export function computeMetrics(jobs: IAnalyticsJob[] = []): IMetrics {
  const total = jobs.length;
  const failed = jobs.filter(
    (j) => j.status === "failure" || j.status === "error" || j.status === "killed",
  ).length;
  const success = jobs.filter((j) => j.status === "success").length;
  return { total, failed, success };
}

export function aggregateJobsByRemoteci(jobs: IAnalyticsJob[] = []): IRemoteciStat[] {
  const grouped = jobs.reduce(
    (acc, job) => {
      const remoteci = job.remoteci?.name || "Unknown";
      if (!acc[remoteci]) {
        acc[remoteci] = { name: remoteci, success: 0, failure: 0 };
      }
      if (job.status === "success") {
        acc[remoteci].success++;
      } else {
        acc[remoteci].failure++;
      }
      return acc;
    },
    {} as Record<string, IRemoteciStat>,
  );

  return Object.values(grouped).sort((a, b) => {
    const totalA = a.success + a.failure;
    const totalB = b.success + b.failure;
    return totalB - totalA;
  });
}

export function extractProductFromTopic(topicName: string): string {
  const match = topicName.match(/^([A-Za-z]+)/);
  return match ? match[1] : "Unknown";
}

export function aggregateJobsByProduct(jobs: IAnalyticsJob[] = []): IProductStat[] {
  const grouped = jobs.reduce(
    (acc, job) => {
      const product = extractProductFromTopic(job.topic?.name || "Unknown");
      if (!acc[product]) {
        acc[product] = { name: product, total: 0 };
      }
      acc[product].total++;
      return acc;
    },
    {} as Record<string, IProductStat>,
  );

  return Object.values(grouped).sort((a, b) => b.total - a.total);
}

export function aggregateJobsByTopic(jobs: IAnalyticsJob[] = []): Record<string, IStat> {
  const grouped = jobs.reduce(
    (acc, job) => {
      const topic = job.topic?.name || "Unknown";
      if (!acc[topic]) {
        acc[topic] = {
          color: "",
          total: 0,
          label: topic,
        };
      }
      acc[topic].total++;
      return acc;
    },
    {} as Record<string, IStat>,
  );

  // Assign colors
  const topics = Object.keys(grouped);
  topics.forEach((topic, index) => {
    grouped[topic].color = chartColors[index % chartColors.length];
  });

  return grouped;
}

export function aggregateJobsByPeriod(
  jobs: IAnalyticsJob[] = [],
  range: string,
): ITimeStat[] {
  const now = DateTime.now();
  const buckets: Record<number, ITimeStat> = {};
  let granularity: "day" | "week";
  let numPeriods: number;

  // Determine granularity based on the selected range
  if (range === "last7Days") {
    granularity = "day";
    numPeriods = 7;
  } else if (range === "last30Days") {
    granularity = "day";
    numPeriods = 30;
  } else if (range === "last90Days") {
    granularity = "week";
    numPeriods = 13; // ~13 weeks
  } else {
    // Default to weekly view for other ranges
    granularity = "week";
    numPeriods = 13;
  }

  // Initialize buckets
  if (granularity === "day") {
    for (let i = numPeriods - 1; i >= 0; i--) {
      const date = now.minus({ days: i });
      const key = parseInt(date.toFormat("yyyyMMdd"));
      buckets[key] = {
        name: date.toFormat("MMM dd"),
        key,
        success: 0,
        failure: 0,
      };
    }
  } else {
    // week
    for (let i = numPeriods - 1; i >= 0; i--) {
      const weekDate = now.minus({ weeks: i });
      const weekNumber = weekDate.weekNumber;
      const weekYear = weekDate.weekYear;
      const key = weekYear * 100 + weekNumber;
      buckets[key] = {
        name: `W${weekNumber}`,
        key,
        success: 0,
        failure: 0,
      };
    }
  }

  // Aggregate jobs
  jobs.forEach((job) => {
    const jobDate = DateTime.fromISO(job.created_at);
    let key: number;

    if (granularity === "day") {
      key = parseInt(jobDate.toFormat("yyyyMMdd"));
    } else {
      const weekNumber = jobDate.weekNumber;
      const weekYear = jobDate.weekYear;
      key = weekYear * 100 + weekNumber;
    }

    if (buckets[key]) {
      if (job.status === "success") {
        buckets[key].success++;
      } else {
        buckets[key].failure++;
      }
    }
  });

  return Object.values(buckets).sort((a, b) => a.key - b.key);
}
