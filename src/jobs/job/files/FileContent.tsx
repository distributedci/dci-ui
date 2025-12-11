import type { IFile } from "types";
import { useGetFileContentQuery } from "jobs/job/files/filesApi";
import { isJsonFile, formatJsonContent } from "./filesGetters";
import { Skeleton } from "@patternfly/react-core";

export default function FileContent({ file }: { file: IFile }) {
  const { data: content, isLoading } = useGetFileContentQuery(file);

  if (isLoading) {
    return (
      <div style={{ height: "400px" }}>
        <Skeleton screenreaderText="Loading file content" height="100%" />
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const displayContent = isJsonFile(file)
    ? formatJsonContent(content)
    : content;

  return (
    <pre style={{ overflowX: "auto", whiteSpace: "pre" }}>{displayContent}</pre>
  );
}
