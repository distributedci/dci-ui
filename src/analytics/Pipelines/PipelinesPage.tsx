import {
  Button,
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Label,
  ProgressStep,
  ProgressStepper,
  Tooltip,
  CardHeader,
  Truncate,
  PageSection,
  Content,
  Skeleton,
  Modal,
  ModalHeader,
  ModalBody,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { t_global_border_color_default } from "@patternfly/react-tokens";
import { DateTime } from "luxon";
import { formatDate, humanizeDurationShort } from "services/date";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { IJobStatus } from "types";
import { ComponentsList } from "jobs/components";
import { notEmpty } from "services/utils";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { JobStatusLabel } from "jobs/components";
import {
  extractPipelinesFromAnalyticsJobs,
  IAnalyticsJob,
  IPipelineDay,
  IPipelineJob,
  useLazyGetAnalyticJobsQuery,
} from "./pipelinesApi";
import useModal from "hooks/useModal";
import QueryToolbar from "analytics/toolbar/QueryToolbar";

function jobStatusToVariant(status: IJobStatus) {
  switch (status) {
    case "new":
    case "pre-run":
    case "post-run":
      return "info";
    case "success":
      return "success";
    case "killed":
      return "warning";
    case "error":
    case "failure":
      return "danger";
    default:
      return "default";
  }
}

function humanizeJobDuration(duration: number) {
  return humanizeDurationShort(duration * 1000, {
    delimiter: " ",
    round: true,
    largest: 2,
  });
}

function JobComment({
  comment,
  status_reason,
}: {
  comment: string | null;
  status_reason: string | null;
}) {
  if (!comment) {
    return null;
  }
  if (!status_reason) {
    <span
      style={{
        textDecorationLine: "underline",
        textDecorationStyle: "dashed",
        textDecorationColor: "#000",
      }}
    >
      {comment}
    </span>;
  }
  return (
    <Tooltip content={<div>{status_reason}</div>}>
      <span
        style={{
          textDecorationLine: "underline",
          textDecorationStyle: "dashed",
          textDecorationColor: "#000",
        }}
      >
        {comment}
      </span>
    </Tooltip>
  );
}

function JobResults({ results }: { results: IAnalyticsJob["results"] }) {
  if (!results) {
    return null;
  }
  return (
    <span>
      <Label
        isCompact
        color="green"
        title={`${results.success || 0} tests in success`}
        className="pf-v6-u-mr-xs"
      >
        {results.success || 0}
      </Label>
      <Label
        isCompact
        color="orange"
        title={`${results.skips || 0} skipped tests`}
        className="pf-v6-u-mr-xs"
      >
        {results.skips || 0}
      </Label>
      <Label
        isCompact
        color="red"
        title={`${
          (results.failures || 0) + (results.errors || 0)
        } errors and failures tests`}
      >
        {(results.failures || 0) + (results.errors || 0)}
      </Label>
    </span>
  );
}

function PipelineJobInfo({ job, index }: { job: IPipelineJob; index: number }) {
  return (
    <>
      <Td
        style={{
          borderLeft:
            index === 0
              ? `1px solid ${t_global_border_color_default.var}`
              : "none",
          whiteSpace: "nowrap",
        }}
      >
        <Link to={`/jobs/${job.id}/jobStates`}>
          <JobStatusLabel
            status={job.status}
            className="pf-v6-u-mr-xs"
            style={{ zIndex: 1 }}
          />

          {job.name}
        </Link>
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        <JobComment comment={job.comment} status_reason={job.status_reason} />
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
        }}
      >
        <JobResults results={job.results} />
      </Td>
      <Td
        style={{
          whiteSpace: "nowrap",
          textAlign: "center",
          borderRight: `1px solid ${t_global_border_color_default.var}`,
        }}
      >
        {humanizeJobDuration(job.duration)}
      </Td>
    </>
  );
}

function PipelineCard({
  pipelineDay,
  ...props
}: {
  pipelineDay: IPipelineDay;
  [k: string]: any;
}) {
  const [seeJobComponents, setSeeJobComponents] = useState(false);
  return (
    <Card {...props}>
      <CardHeader
        actions={{
          actions: (
            <Button
              type="button"
              variant="tertiary"
              onClick={() => {
                setSeeJobComponents(!seeJobComponents);
              }}
            >
              {seeJobComponents ? "Hide job components" : "See job components"}
            </Button>
          ),
          hasNoOffset: false,
          className: undefined,
        }}
      >
        <CardTitle>
          {formatDate(pipelineDay.datetime, DateTime.DATE_MED_WITH_WEEKDAY)}
        </CardTitle>
      </CardHeader>
      <CardBody style={{ overflow: "auto" }}>
        <Table>
          <Thead>
            <Tr>
              <Th>pipeline</Th>
              <Th style={{ minWidth: "250px" }}>name</Th>
              <Th colSpan={-1}>jobs</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pipelineDay.pipelines.map((pipeline, index) => (
              <Fragment key={index}>
                <Tr
                  style={{
                    borderTop: `1px solid ${t_global_border_color_default.var}`,
                  }}
                >
                  <Td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    <ProgressStepper isCompact>
                      {pipeline.jobs.map((job) => (
                        <ProgressStep
                          key={job.id}
                          variant={jobStatusToVariant(job.status)}
                          id={job.name}
                          titleId={job.name}
                        />
                      ))}
                    </ProgressStepper>
                  </Td>
                  <Td
                    rowSpan={seeJobComponents ? 2 : 1}
                    style={{ verticalAlign: "middle" }}
                  >
                    <Truncate content={pipeline.name} />
                  </Td>
                  {pipeline.jobs.map((job, index) => (
                    <PipelineJobInfo key={index} index={index} job={job} />
                  ))}
                </Tr>
                {seeJobComponents && (
                  <Tr>
                    {pipeline.jobs.map((job) => (
                      <Td
                        style={{
                          borderLeft: `1px solid ${t_global_border_color_default.value}`,
                          whiteSpace: "nowrap",
                        }}
                        colSpan={4}
                      >
                        <ComponentsList
                          components={job.components.filter(notEmpty)}
                        />
                      </Td>
                    ))}
                  </Tr>
                )}
              </Fragment>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

function PipelinesTable({ pipelinesDays }: { pipelinesDays: IPipelineDay[] }) {
  if (pipelinesDays.length === 0) {
    return (
      <EmptyState
        headingLevel="h4"
        titleText="No pipeline between these dates"
        variant={EmptyStateVariant.xs}
      >
        <EmptyStateBody>
          change your search parameters and try again
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <div>
      {pipelinesDays.map((day, index) => (
        <PipelineCard key={index} pipelineDay={day} className="pf-v6-u-mt-md" />
      ))}
    </div>
  );
}

function AnalyticsJobTable({
  jobs,
  ...props
}: {
  jobs: IAnalyticsJob[];
  [k: string]: any;
}) {
  return (
    <Card {...props}>
      <CardBody>
        <Table variant="compact">
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Name</Th>
              <Th>Team</Th>
              <Th>Pipeline</Th>
              <Th>Tests</Th>
              <Th>Comment</Th>
              <Th>Duration</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jobs.map((job) => (
              <Tr key={job.id}>
                <Td>
                  <JobStatusLabel status={job.status} />
                </Td>
                <Td>
                  <Link to={`/jobs/${job.id}/jobStates`}>{job.name}</Link>
                </Td>
                <Td>
                  <Link to={`/teams/${job.team.id}`}>{job.team.name}</Link>
                </Td>
                <Td>{job.pipeline.name}</Td>
                <Td>
                  <JobResults results={job.results} />
                </Td>
                <Td>
                  <JobComment
                    comment={job.comment}
                    status_reason={job.status_reason}
                  />
                </Td>
                <Td>{humanizeJobDuration(job.duration)}</Td>
                <Td>{job.created_at}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

function AnalyticsJobsModal({
  jobs,
  ...props
}: {
  jobs: IAnalyticsJob[];
  [k: string]: any;
}) {
  const { isOpen, show, hide } = useModal(false);

  return (
    <>
      <Button variant="link" onClick={show} {...props}>
        See jobs
      </Button>
      <Modal
        id="jobs-list-modal"
        aria-label="Analytics jobs list"
        isOpen={isOpen}
        onClose={hide}
        width="80%"
      >
        <ModalHeader title="Jobs list" />
        <ModalBody>
          <AnalyticsJobTable jobs={jobs} />
        </ModalBody>
      </Modal>
    </>
  );
}

export default function PipelinesPage() {
  const [getAnalyticJobs, { data, isLoading }] = useLazyGetAnalyticJobsQuery();

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Pipelines" },
        ]}
      />
      <Content component="h1">Pipelines</Content>
      <Card>
        <CardBody>
          <QueryToolbar
            onSearch={({ query, after, before }) => {
              getAnalyticJobs({ query, after, before });
            }}
          />
          {isLoading && (
            <Skeleton
              style={{ width: 69.45, height: 35 }}
              className="pf-v6-u-mt-md"
              screenreaderText="Loading jobs"
            />
          )}
          {data && (
            <AnalyticsJobsModal
              jobs={data.hits.hits.map((h) => h._source)}
              className="pf-v6-u-mt-md"
            />
          )}
        </CardBody>
      </Card>
      {isLoading && (
        <Skeleton
          className="pf-v6-u-mt-md"
          screenreaderText="Loading pipelines"
        />
      )}
      {data && (
        <PipelinesTable
          pipelinesDays={extractPipelinesFromAnalyticsJobs(data)}
        />
      )}
    </PageSection>
  );
}
