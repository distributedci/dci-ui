import {
  injectCreateEndpoint,
  injectDeleteEndpoint,
  injectGetEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
} from "../api";
import type { ITopic } from "../types";

const resource = "Topic";

export const { useCreateTopicMutation } =
  injectCreateEndpoint<ITopic>(resource);
export const { useDeleteTopicMutation } =
  injectDeleteEndpoint<ITopic>(resource);
export const { useGetTopicQuery } = injectGetEndpoint<ITopic>(resource);
export const { useListTopicsQuery } = injectListEndpoint<ITopic>(resource);
export const { useUpdateTopicMutation } =
  injectUpdateEndpoint<ITopic>(resource);
