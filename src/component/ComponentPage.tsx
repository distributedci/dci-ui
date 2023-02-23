import { useEffect, useState, useCallback } from "react";
import MainPage from "pages/MainPage";
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Title,
  Divider,
  Label,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Button,
} from "@patternfly/react-core";
import { EmptyState, Breadcrumb, CopyButton } from "ui";
import {
  IComponentCoverage,
  IComponentWithJobs,
  IJob,
  IJobStatus,
} from "types";
import { useParams, Link } from "react-router-dom";
import { fetchComponent } from "./componentActions";
import { CalendarAltIcon, ClockIcon } from "@patternfly/react-icons";
import { fromNow, formatDate } from "services/date";
import { sortByNewestFirst } from "services/sort";
import { humanizeDuration } from "services/date";
import { StatHeaderCard } from "analytics/LatestJobStatus/LatestJobStatusDetailsPage";
import { getPercentageOfSuccessfulJobs } from "./stats";
import JobStatusLabel from "jobs/JobStatusLabel";
import CardLine from "ui/CardLine";
import LastComponentsJobsBarChart from "analytics/ComponentCoverage/LastComponentsJobsBarChart";
import { global_palette_black_500 } from "@patternfly/react-tokens";

interface IEmbedJobProps {
  job: IJob;
}

function EmbedJob({ job }: IEmbedJobProps) {
  return (
    <div>
      <Grid hasGutter>
        <GridItem span={3}>
          <Link to={`/jobs/${job.id}/jobStates`}>{job.name || job.id}</Link>
        </GridItem>
        <GridItem span={2}>
          <JobStatusLabel status={job.status} />
        </GridItem>
        <GridItem span={3}>
          <div>
            {job.tags &&
              job.tags.map((tag, index) => (
                <Label
                  isCompact
                  key={index}
                  color="blue"
                  className="mr-xs mt-xs"
                >
                  <small>{tag}</small>
                </Label>
              ))}
          </div>
        </GridItem>
        <GridItem span={2}>
          <span title={`Duration in seconds ${job.duration}`}>
            <ClockIcon className="mr-xs" />
            {humanizeDuration(job.duration * 1000)}
          </span>
        </GridItem>
        <GridItem span={2}>
          <span title={`Created at ${job.created_at}`}>
            <CalendarAltIcon className="mr-xs" />
            {formatDate(job.created_at)}
          </span>
        </GridItem>
      </Grid>
    </div>
  );
}

function ComponentDetails({ component }: { component: IComponentWithJobs }) {
  const [seeData, setSeeData] = useState(false);
  const componentData = JSON.stringify(component.data, null, 2);
  return (
    <div>
      <Title headingLevel="h3" size="xl" className="p-md">
        Component information
      </Title>
      <Divider />
      <CardLine className="p-md" field="ID" value={component.id} />
      <Divider />
      <CardLine
        className="p-md"
        field="Canonical project name"
        value={component.canonical_project_name}
      />
      <Divider />
      <CardLine className="p-md" field="Name" value={component.name} />
      <Divider />
      <CardLine
        className="p-md"
        field="Topic id"
        value={
          <Link to={`/topics/${component.topic_id}/components`}>
            {component.topic_id}
          </Link>
        }
      />
      <Divider />
      <CardLine className="p-md" field="Type" value={component.type} />
      <Divider />
      <CardLine
        className="p-md"
        field="Data"
        value={
          seeData ? (
            <Button
              onClick={() => setSeeData(false)}
              type="button"
              variant="tertiary"
              isSmall
            >
              hide content
            </Button>
          ) : (
            <Button
              onClick={() => setSeeData(true)}
              type="button"
              variant="tertiary"
              isSmall
            >
              see content
            </Button>
          )
        }
      />
      {seeData && (
        <CodeBlock
          actions={[
            <CodeBlockAction>
              <CopyButton text={componentData} variant="plain" />
            </CodeBlockAction>,
          ]}
        >
          <CodeBlockCode id="component.data">{componentData}</CodeBlockCode>
        </CodeBlock>
      )}
      <Divider />
      <CardLine
        className="p-md"
        field="Tags"
        value={
          component.tags && component.tags.length > 0
            ? component.tags.map((tag, i) => (
                <Label key={i} className="mt-xs mr-xs" color="blue">
                  {tag}
                </Label>
              ))
            : "no tags"
        }
      />
      <Divider />
      <CardLine className="p-md" field="State" value={component.state} />
      <Divider />
      <CardLine
        className="p-md"
        field="Created"
        value={fromNow(component.created_at)}
      />
      <CardLine
        className="p-md"
        field="Created"
        value={formatDate(component.released_at)}
      />
    </div>
  );
}

function convertComponentWithJobInComponentCoverage(
  component: IComponentWithJobs
): IComponentCoverage {
  const jobsInfo = component.jobs.reduce(
    (acc, job) => {
      acc.jobs.push({
        id: job.id,
        created_at: job.created_at,
        status: job.status,
        name: job.name,
      });
      acc.nbOfJobs += 1;
      acc.nbOfSuccessfulJobs += job.status === "success" ? 1 : 0;
      return acc;
    },
    { nbOfSuccessfulJobs: 0, nbOfJobs: 0, jobs: [] } as {
      nbOfSuccessfulJobs: number;
      nbOfJobs: number;
      jobs: {
        id: string;
        created_at: string;
        status: IJobStatus;
        name: string;
      }[];
    }
  );
  return {
    id: component.id,
    name: component.name,
    canonical_project_name: component.canonical_project_name || "",
    type: component.type,
    topic_id: component.topic_id,
    tags: component.tags || [],
    ...jobsInfo,
  };
}

export default function ComponentPage() {
  const { topic_id, component_id } = useParams();
  const [isFetching, setIsFetching] = useState(true);
  const [component, setComponent] = useState<IComponentWithJobs | null>(null);

  const getComponentCallback = useCallback(() => {
    if (component_id) {
      fetchComponent(component_id)
        .then((response) => setComponent(response.data.component))
        .finally(() => setIsFetching(false));
    }
  }, [component_id, setIsFetching]);

  useEffect(() => {
    getComponentCallback();
  }, [getComponentCallback]);

  if (!component_id || !topic_id) return null;

  return (
    <MainPage
      title={
        component
          ? `Component ${component.canonical_project_name}`
          : "Component"
      }
      loading={isFetching && component === null}
      empty={!isFetching && component === null}
      description={
        component
          ? `Details page for component ${component.canonical_project_name}`
          : "Details page"
      }
      EmptyComponent={
        <EmptyState
          title="There is no component"
          info={`There is not component with id ${component_id}`}
        />
      }
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/topics", title: "Topics" },
            { to: `/topics/${topic_id}/components`, title: topic_id },
            { to: `/topics/${topic_id}/components`, title: "Components" },
            {
              to: `/topics/${topic_id}/components/${component_id}`,
              title: component_id,
            },
          ]}
        />
      }
    >
      {component === null ? null : (
        <>
          <Grid hasGutter>
            <GridItem span={3}>
              <StatHeaderCard
                title={component.jobs.length.toString()}
                subTitle="Number of jobs"
              />
            </GridItem>
            <GridItem span={3}>
              <StatHeaderCard
                title={`${getPercentageOfSuccessfulJobs(component.jobs)}%`}
                subTitle="Percentage of successful jobs"
              />
            </GridItem>
            <GridItem span={3}>
              <StatHeaderCard
                title={
                  component.jobs.length === 0
                    ? "no job"
                    : fromNow(component.jobs[0].created_at) || ""
                }
                subTitle="Latest run"
              />
            </GridItem>
            <GridItem span={3}>
              <Card>
                <CardBody style={{ paddingBottom: "8px" }}>
                  <p
                    style={{
                      color: global_palette_black_500.value,
                      fontWeight: "bold",
                    }}
                  >
                    Lastest jobs
                  </p>
                  <LastComponentsJobsBarChart
                    component={convertComponentWithJobInComponentCoverage(
                      component
                    )}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Card className="mt-md">
            <CardBody>
              <ComponentDetails key={component.etag} component={component} />
            </CardBody>
          </Card>

          <Card className="mt-md">
            <CardBody>
              <Title headingLevel="h3" size="xl" className="p-md">
                Jobs
              </Title>
              <div className="p-md">
                <Grid hasGutter>
                  <GridItem span={3}>Job name</GridItem>
                  <GridItem span={2}>Status</GridItem>
                  <GridItem span={3}>tags</GridItem>
                  <GridItem span={2}>Duration</GridItem>
                  <GridItem span={2}>Created At</GridItem>
                </Grid>
              </div>
              {component.jobs.length === 0 ? (
                <div className="p-md">
                  <Divider /> There is no job attached to this component
                </div>
              ) : (
                sortByNewestFirst(component.jobs).map((j) => (
                  <div>
                    <Divider />
                    <div className="p-md">
                      <EmbedJob job={j} />
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </>
      )}
    </MainPage>
  );
}
