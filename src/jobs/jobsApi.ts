import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  injectDeleteEndpoint,
  injectListEndpoint,
  injectGetEndpoint,
  injectUpdateEndpoint,
  api,
} from "api";
import type {
  IEnhancedJob,
  IJob,
  IJobInGetJobs,
  IJobState,
  ITest,
} from "types";
import { sortByName } from "services/sort";
import { addDurationAndPipelineStatus } from "./job/jobStates/jobStatesActions";
import { normalizeFile } from "./job/files/filesGetters";

const resource = "Job";

export const { useGetJobQuery } = injectGetEndpoint<IJob>(resource);
export const { useDeleteJobMutation } = injectDeleteEndpoint<IJob>(resource);
export const { useListJobsQuery } = injectListEndpoint<IJobInGetJobs>(resource);
export const { useUpdateJobMutation } = injectUpdateEndpoint<IJob>(resource);
export const { useGetEnhancedJobQuery } = api
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
    }),
  });
