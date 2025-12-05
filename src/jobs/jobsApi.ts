import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  injectDeleteEndpoint,
  injectListEndpoint,
  injectGetEndpoint,
  injectUpdateEndpoint,
  api,
} from "api";
import type {
  IAnalyticsExtraJob,
  IEnhancedJob,
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
  IJob,
  IJobExtraData,
  IJobInGetJobs,
  IJobState,
  ITest,
} from "types";
import { sortByName } from "services/sort";
import { addDurationAndPipelineStatus } from "./job/jobStates/jobStatesActions";
import { normalizeFile } from "./job/files/filesGetters";
import { createAnalyticsSearchParams } from "analytics/analyticsApi";

const resource = "Job";

export const { useGetJobQuery } = injectGetEndpoint<IJob>(resource);
export const { useDeleteJobMutation } = injectDeleteEndpoint<IJob>(resource);
export const { useListJobsQuery } = injectListEndpoint<IJobInGetJobs>(resource);
export const { useUpdateJobMutation } = injectUpdateEndpoint<IJob>(resource);
export const { useGetEnhancedJobQuery, useGetJobExtraDataQuery } = api
  .enhanceEndpoints({ addTagTypes: ["EnhancedJob", resource] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getEnhancedJob: builder.query<IEnhancedJob, string>({
        async queryFn(jobId, _queryApi, _extraOptions, fetchWithBQ) {
          try {
            const getJob = await fetchWithBQ(`/jobs/${jobId}`);
            if (getJob.error) {
              return { error: getJob.error as FetchBaseQueryError };
            }
            const data = getJob.data as { job: IJob };
            const job = data.job;
            const getResults = await fetchWithBQ(`/jobs/${job.id}/results`);
            if (getResults.error) {
              return { error: getResults.error as FetchBaseQueryError };
            }
            const resultsData = getResults.data as { results: ITest[] };
            const getJobState = await fetchWithBQ(`/jobs/${job.id}/jobstates`);
            if (getJobState.error) {
              return { error: getJobState.error as FetchBaseQueryError };
            }
            const jobStatesData = getJobState.data as {
              jobstates: IJobState[];
            };

            const enhancedJob = {
              ...job,
              files: job.files.map(normalizeFile),
              tests: sortByName(resultsData.results),
              jobstates: addDurationAndPipelineStatus(jobStatesData.jobstates),
            };
            return { data: enhancedJob as IEnhancedJob };
          } catch (error: unknown) {
            console.error(error);
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: `Can't fetch test results or job states for job ${jobId}`,
              } as FetchBaseQueryError,
            };
          }
        },
        providesTags: (_result, _error, id) => [
          { type: "EnhancedJob", id },
          { type: resource, id },
        ],
      }),
      getJobExtraData: builder.query<IJobExtraData | null, string>({
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
              console.error("Error fetching extra data:", response.error);
              return { error: response.error as FetchBaseQueryError };
            }

            const data = response.data as
              | IGetAnalyticsJobsResponse<IAnalyticsExtraJob>
              | IGetAnalyticsJobsEmptyResponse;

            console.log("Extra data response:", data);

            if (!("hits" in data) || !data.hits || data.hits.hits.length === 0) {
              console.log("No hits found in response");
              return { data: null };
            }

            const job = data.hits.hits[0]._source;
            console.log("Job extra data:", job.extra);
            return { data: job.extra || null };
          } catch (error: unknown) {
            console.error(error);
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: `Can't fetch extra data for job ${jobId}`,
              } as FetchBaseQueryError,
            };
          }
        },
        providesTags: (result, error, id) => [
          { type: "EnhancedJob", id },
          { type: resource, id },
        ],
      }),
    }),
  });
