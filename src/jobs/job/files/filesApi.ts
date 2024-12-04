import { api } from "api";
import type { IFile } from "types";

export const { useGetFileContentQuery } = api
  .enhanceEndpoints({ addTagTypes: ["File"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getFileContent: builder.query<IFile, string>({
        query: (id) => `/files/${id}/content`,
        transformResponse: (response: { file: IFile }) => response.file,
      }),
    }),
  });
