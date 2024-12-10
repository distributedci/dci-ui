import { api } from "api";
import { DateTime } from "luxon";
import qs from "qs";
import { IJobStatus } from "types";

export interface IAnalyticsJob {
  id: string;
  name: string;
  status: IJobStatus;
  status_reason: string | null;
  created_at: string;
  components: { id: string; topic_id: string; display_name: string }[];
  comment: string | null;
  team: {
    id: string;
    name: string;
  };
  results: {
    errors: number;
    failures: number;
    success: number;
    skips: number;
    total: number;
  } | null;
  pipeline: {
    created_at: string;
    name: string;
  };
  duration: number;
}

export interface IGetAnalyticsJobsResponse {
  _shards: {
    failed: number;
    skipped: number;
    successful: number;
    total: number;
  };
  hits: {
    hits: [
      {
        _id: string;
        _index: string;
        _score: number | null;
        _source: IAnalyticsJob;
        _type: string;
        sort: string[];
      },
    ];
    max_score: number | null;
    total: {
      relation: string;
      value: number;
    };
  };
  timed_out: boolean;
  took: number;
}

export interface IPipelineJob {
  id: string;
  name: string;
  status: IJobStatus;
  status_reason: string;
  components: { id: string; topic_id: string; display_name: string }[];
  comment: string;
  results: {
    errors: number;
    failures: number;
    success: number;
    skips: number;
    total: number;
  };
  duration: number;
}

export interface IPipeline {
  name: string;
  created_at: string;
  jobs: IPipelineJob[];
}

export interface IPipelineDay {
  date: string;
  datetime: DateTime;
  pipelines: IPipeline[];
}

export function extractPipelinesFromAnalyticsJobs(
  data: IGetAnalyticsJobsResponse,
): IPipelineDay[] {
  const daysMap: {
    [key: string]: {
      date: string;
      datetime: DateTime;
      pipelines: {
        [key: string]: IPipeline;
      };
    };
  } = {};
  data.hits.hits.forEach((hit) => {
    const job = hit._source;
    const pipelineDate = job.pipeline.created_at.split("T")[0];

    if (!daysMap[pipelineDate]) {
      daysMap[pipelineDate] = {
        date: pipelineDate,
        datetime: DateTime.fromISO(pipelineDate),
        pipelines: {},
      };
    }

    const pipelineName = job.pipeline.name;

    if (!daysMap[pipelineDate].pipelines[pipelineName]) {
      daysMap[pipelineDate].pipelines[pipelineName] = {
        name: pipelineName,
        created_at: job.pipeline.created_at,
        jobs: [],
      };
    }

    daysMap[pipelineDate].pipelines[pipelineName].jobs.push({
      id: job.id,
      name: job.name,
      status: job.status,
      status_reason: job.status_reason || "",
      components: job.components,
      comment: job.comment || "",
      results: job.results || {
        errors: 0,
        failures: 0,
        success: 0,
        skips: 0,
        total: 0,
      },
      duration: job.duration,
    });
  });
  return Object.values(daysMap)
    .map((day) => ({
      ...day,
      pipelines: Object.values(day.pipelines),
    }))
    .sort((day1, day2) => {
      const epoch1 = day1.datetime.toMillis();
      const epoch2 = day2.datetime.toMillis();
      return epoch1 < epoch2 ? 1 : epoch1 > epoch2 ? -1 : 0;
    });
}

export const { useLazyGetAnalyticJobsQuery } = api
  .enhanceEndpoints({ addTagTypes: ["Analytics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAnalyticJobs: builder.query<
        IGetAnalyticsJobsResponse,
        { query: string; after: string; before: string }
      >({
        query: ({ query, after, before }) => {
          console.log({ query, after, before });
          const params = qs.stringify(
            {
              query,
              offset: 0,
              limit: 200,
              sort: "-created_at",
              includes:
                "id,name,created_at,status,status_reason,comment,duration,pipeline.created_at,pipeline.name,components.id,components.topic_id,components.display_name,results.errors,results.failures,results.success,results.failures,results.skips,results.total,team.id,team.name",
              from: after,
              to: before,
            },
            {
              addQueryPrefix: true,
              encode: true,
              skipNulls: true,
            },
          );
          console.log(params);
          return `/analytics/jobs${params}`;
        },
        providesTags: ["Analytics"],
      }),
    }),
  });
