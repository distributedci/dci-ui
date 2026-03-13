import { useParams } from "react-router";
import {
  CodeBlock,
  CodeBlockCode,
  PageSection,
  Spinner,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Content,
} from "@patternfly/react-core";
import { useGetFileQuery } from "./filesApi";
import { Breadcrumb, BreadcrumbCopyItem, EmptyState } from "ui";
import FileContent from "./FileContent";
import { humanizeBytes } from "services/bytes";
import { formatDate } from "services/date";

export default function FilePage() {
  const { file_id } = useParams();

  const { data: file, isLoading } = useGetFileQuery(file_id ?? "", {
    skip: !file_id,
  });

  if (isLoading) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb links={[{ to: "/", title: "DCI" }]} />
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
  const job_id = file.job_id;
  return (
    <PageSection hasBodyWrapper={false}>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/jobs", title: "Jobs" },
          {
            to: `/jobs/${job_id}`,
            title: <BreadcrumbCopyItem text={job_id} />,
          },
          {
            to: `/jobs/${job_id}/files`,
            title: "Files",
          },
          {
            to: `/files/${file.id}`,
            title: <BreadcrumbCopyItem text={file.id} />,
          },
        ]}
      />
      <Content>
        <h1 id="file">File details</h1>
      </Content>
      <DescriptionList columnModifier={{ default: "2Col" }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Filename</DescriptionListTerm>
          <DescriptionListDescription>{file.name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Size</DescriptionListTerm>
          <DescriptionListDescription>
            {humanizeBytes(file.size)}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Mime type</DescriptionListTerm>
          <DescriptionListDescription>
            {file.mime || "N/A"}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>MD5</DescriptionListTerm>
          <DescriptionListDescription>
            {file.md5 || "N/A"}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Created at</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(file.created_at)}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Updated at</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(file.updated_at)}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      <Content>
        <h1 id="content">File content</h1>
      </Content>
      <CodeBlock>
        <CodeBlockCode>
          <FileContent file={file} />
        </CodeBlockCode>
      </CodeBlock>
    </PageSection>
  );
}
