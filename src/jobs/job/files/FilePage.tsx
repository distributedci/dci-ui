import { useParams } from "react-router";
import {
  CodeBlock,
  CodeBlockCode,
  PageSection,
  Spinner,
} from "@patternfly/react-core";
import { useGetFileQuery } from "./filesApi";
import { EmptyState } from "ui";
import FileContent from "./FileContent";

export default function FilePage() {
  const { file_id } = useParams();

  const { data: file, isLoading } = useGetFileQuery(file_id ?? "", {
    skip: !file_id,
  });

  if (isLoading) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Spinner size="lg" aria-label="Loading file content" />
      </PageSection>
    );
  }

  if (!file) {
    return (
      <PageSection hasBodyWrapper={false}>
        <EmptyState
          title={`There is no file ${file_id}`}
          info="Do you have the permission to see this file?"
        />
      </PageSection>
    );
  }

  return (
    <PageSection hasBodyWrapper={false}>
      <CodeBlock>
        <CodeBlockCode>
          <FileContent file={file} />
        </CodeBlockCode>
      </CodeBlock>
    </PageSection>
  );
}
