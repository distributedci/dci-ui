import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { api } from "api";
import type {
  IGetAnalyticsJobsResponse,
  IGetAnalyticsJobsEmptyResponse,
} from "types";
import { createAnalyticsSearchParams } from "analytics/analyticsApi";
import { formatHardwareData } from "./hardwareFormatter";
import type { INode, ESNode } from "./hardwareFormatter";

interface IAnalyticsJobWithHardware {
  id: string;
  nodes?: ESNode[];
}

export const { useGetJobHardwareDataQuery } = api
  .enhanceEndpoints({ addTagTypes: ["JobHardware", "Job"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getJobHardwareData: builder.query<INode[], string>({
        async queryFn(
          jobId,
          _queryApi,
          _extraOptions,
          fetchWithBQ: Parameters<BaseQueryFn>[0],
        ) {
          try {
            const includes = "id,nodes";
            const excludes =
              "nodes.hardware.pci_accelerators,nodes.hardware.pci_other_devices,nodes.hardware.pci_network_controllers,nodes.hardware.pci_storage_controllers,nodes.hardware.pci_usb_controllers,";
            const params = createAnalyticsSearchParams({
              query: `id='${jobId}'`,
              offset: 0,
              limit: 1,
              sort: "-created_at",
              includes,
              excludes,
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

            if (
              !("hits" in data) ||
              !data.hits ||
              data.hits.hits.length === 0
            ) {
              return { data: [] };
            }

            const job = data.hits.hits[0]._source;
            return { data: formatHardwareData(job.nodes) };
          } catch (error) {
            console.log(error);
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: `Can't fetch hardware data for job ${jobId}`,
              } as FetchBaseQueryError,
            };
          }
        },
        providesTags: (_result, _error, id) => [
          { type: "JobHardware", id },
          { type: "Job", id },
        ],
      }),
    }),
  });
