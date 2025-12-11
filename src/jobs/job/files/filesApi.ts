import { api, baseUrl } from "api";
import { getToken } from "services/localStorage";
import type { IFile } from "types";
import { getBrowserMimeType } from "./filesGetters";

export const { useGetFileContentQuery, useGetFileQuery } = api
  .enhanceEndpoints({ addTagTypes: ["File"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getFile: builder.query<IFile, string>({
        query: (id) => ({
          url: `/files/${id}`,
          method: "GET",
        }),
        transformResponse: (response: { file: IFile }) => response.file,
      }),
      getFileContent: builder.query<string, IFile>({
        query: ({ id }) => ({
          url: `/files/${id}/content`,
          method: "GET",
          responseHandler: "text",
        }),
      }),
    }),
  });

export async function getFileContentAsBlob(file: IFile) {
  const token = getToken();
  const headers = new Headers();
  if (token) {
    headers.append("Authorization", `${token.type} ${token.value}`);
  }
  const response = await fetch(`${baseUrl}/api/v1/files/${file.id}/content`, {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    throw new Error(`Error fetching file content: ${response.statusText}`);
  }
  const blob = await response.blob();

  // Translate MIME type for better browser compatibility
  const translatedMimeType = getBrowserMimeType(file.mime || "");
  if (translatedMimeType !== file.mime) {
    return new Blob([blob], { type: translatedMimeType });
  }

  return blob;
}
