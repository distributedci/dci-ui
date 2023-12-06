import Api from "../api";
import type { ComponentListResponse, Filters } from "../types";
import { createSearchFromFilters } from "api/filters";

export const componentsApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    listComponents: builder.query<ComponentListResponse, Filters>({
      query: (filters) => {
        return `/components${createSearchFromFilters(filters)}`;
      }
    }),
  }),
});

export const { useListComponentsQuery } = componentsApi;
