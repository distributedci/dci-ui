import {
  injectCreateEndpoint,
  injectDeleteEndpoint,
  injectListEndpoint,
  injectUpdateEndpoint,
} from "../api";
import type { IRemoteci } from "../types";

const resource = "Remoteci";

export const { useCreateRemoteciMutation } =
  injectCreateEndpoint<IRemoteci>(resource);
export const { useDeleteRemoteciMutation } =
  injectDeleteEndpoint<IRemoteci>(resource);
export const { useListRemotecisQuery } =
  injectListEndpoint<IRemoteci>(resource);
export const { useUpdateRemoteciMutation } =
  injectUpdateEndpoint<IRemoteci>(resource);
