import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { api } from "api";
import type {
  IGetAnalyticsJobsResponse,
  IGetAnalyticsJobsEmptyResponse,
} from "types";
import { createAnalyticsSearchParams } from "analytics/analyticsApi";
import { formatHardwareData, type INode } from "./hardwareFormatter";

interface INetworkCard {
  link_status?: string;
  firmware_version?: string;
  interface_name?: string;
}

interface IDisk {
  [key: string]: any;
}

export interface IHardwareData {
  node?: string;
  error?: string;
  data?: {
    motherboard?: string | { type?: string };
    memory?: number | { amount?: number };
    disks?: IDisk[];
    network_cards?: INetworkCard[];
    product?: string;
    vendor?: string;
    serial?: string;
    capabilities?: Record<string, string>;
    children?: any[];
    [key: string]: any;
  };
  // Legacy format support
  motherboard?: string | { type?: string };
  memory?: number | { amount?: number };
  disks?: IDisk[];
  network_cards?: INetworkCard[];
}

export type IKernelDataParams =
  | string
  | { [key: string]: IKernelDataParams };


export interface IKernelData {
  node?: string;
  version?: string;
  params?: IKernelDataParams;
}

type IJobHardwareDataNode =
  | {
      kernel: IKernelData;
    }
  | {
      hardware: IHardwareData;
    };

export type IJobHardwareData = IJobHardwareDataNode | IJobHardwareDataNode[];

interface IAnalyticsJobWithHardware {
  id: string;
  extra?: IJobHardwareData;
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

            if (
              !("hits" in data) ||
              !data.hits ||
              data.hits.hits.length === 0
            ) {
              return { data: [] };
            }

            const job = data.hits.hits[0]._source;
            return { data: formatHardwareData(job.extra) };
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
