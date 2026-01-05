import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { api } from "api";
import type {
  IJobHardwareData,
  IGetAnalyticsJobsResponse,
  IGetAnalyticsJobsEmptyResponse,
  IAnalyticsJobWithHardware,
} from "types";
import { createAnalyticsSearchParams } from "analytics/analyticsApi";

export const { useGetJobHardwareDataQuery } = api
  .enhanceEndpoints({ addTagTypes: ["JobHardware", "Job"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getJobHardwareData: builder.query<IJobHardwareData | null, string>({
        async queryFn(
          jobId,
          _queryApi,
          _extraOptions,
          fetchWithBQ: BaseQueryFn,
        ) {
          try {
            const includes =
              "id,extra.kernel.node,extra.kernel.version,extra.kernel.params,extra.hardware";
            const params = createAnalyticsSearchParams({
              query: `id='${jobId}'`,
              offset: 0,
              limit: 1,
              sort: "-created_at",
              includes,
              from: null,
              to: null,
            });

            const response = await fetchWithBQ(`/analytics/jobs?${params}`);
            if (response.error) {
              console.error("Error fetching hardware data:", response.error);
              return { error: response.error as FetchBaseQueryError };
            }

            const data = response.data as
              | IGetAnalyticsJobsResponse<IAnalyticsJobWithHardware>
              | IGetAnalyticsJobsEmptyResponse;

            if (!("hits" in data) || !data.hits || data.hits.hits.length === 0) {
              return { data: null };
            }

            const job = data.hits.hits[0]._source;
            return { data: job.extra || null };
          } catch (error: unknown) {
            console.error(error);
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: `Can't fetch hardware data for job ${jobId}`,
              } as FetchBaseQueryError,
            };
          }
        },
        providesTags: (result, error, id) => [
          { type: "JobHardware", id },
          { type: "Job", id },
        ],
      }),
    }),
  });
