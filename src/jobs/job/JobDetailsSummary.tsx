import { useState } from "react";
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import {
  UsersIcon,
  ServerIcon,
  CubesIcon,
  ClockIcon,
  CalendarAltIcon,
  LinkIcon,
  CogIcon,
  CommentIcon,
} from "@patternfly/react-icons";
import styled from "styled-components";
import {
  IEnhancedJob,
  IComponent,
  IRemoteci,
  ITeam,
  ITopic,
  IResult,
} from "types";
import { formatDate, fromNow, humanizeDuration } from "services/date";
import { isEmpty } from "lodash";
import { TextAreaEditableOnHover } from "ui";
import { Markup } from "interweave";
import { updateJobComment } from "jobs/jobsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { sortByName, sortByOldestFirst } from "services/sort";
import { getTopicIcon } from "ui/icons";
import {
  convertLinksToHtml,
  getColor,
  getIcon,
} from "jobs/jobSummary/jobSummaryUtils";
import { Regressions, Successfixes } from "jobs/jobSummary/components";
import { useElementSize } from "usehooks-ts";

const CommentBloc = styled.div`
  display: flex;
  align-items: center;
`;

const Component = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;


interface TestsProps {
  tests: IResult[];
}

function Tests({ tests }: TestsProps) {
  return (
    <div>
      {sortByOldestFirst(tests).map((test, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: "0 1 auto",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Link to="/tests">{test.name}</Link>
          </div>
          <div style={{ flex: "0 0 auto", marginLeft: "1em" }}>
            <LabelGroup numLabels={5} key={i}>
              <Label
                isCompact
                color="green"
                title={`${test.success} tests in success`}
              >
                {test.success}
              </Label>
              <Label
                isCompact
                color="orange"
                title={`${test.skips} skipped tests`}
              >
                {test.skips}
              </Label>
              <Label
                isCompact
                color="red"
                title={`${
                  test.errors + test.failures
                } errors and failures tests`}
              >
                {test.errors + test.failures}
              </Label>
              <Successfixes successfixes={test.successfixes} isCompact />
              <Regressions regressions={test.regressions} isCompact />
            </LabelGroup>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ComponentsProps {
  components: IComponent[];
}

function Components({ components }: ComponentsProps) {
  const sortedComponents = sortByName(
    components.map((c) => ({ ...c, name: c.canonical_project_name || c.name }))
  );
  return (
    <div>
      {sortedComponents.map((component) => (
        <Component key={component.id} className="mt-xs">
          <Link to={`/topics/${component.topic_id}/components/${component.id}`}>
            <CubesIcon className="mr-xs" />
            {component.canonical_project_name || component.name}
          </Link>
        </Component>
      ))}
    </div>
  );
}

interface JobConfigurationProps {
  configuration: string;
  onConfigurationClicked: (configuration: string) => void;
}

export function JobConfiguration({
  configuration,
  onConfigurationClicked,
}: JobConfigurationProps) {
  return (
    <Button
      variant="link"
      isInline
      onClick={() => onConfigurationClicked(configuration)}
    >
      {configuration}
    </Button>
  );
}

interface JobDetailsSummaryProps {
  job: IEnhancedJob;
  onTagClicked?: (tag: string) => void;
  onRemoteciClicked: (remoteci: IRemoteci) => void;
  onTeamClicked: (team: ITeam) => void;
  onTopicClicked: (topic: ITopic) => void;
  onConfigurationClicked: (configuration: string) => void;
}

export default function JobDetailsSummary({
  job,
  onTagClicked,
  onRemoteciClicked,
  onTeamClicked,
  onTopicClicked,
  onConfigurationClicked,
}: JobDetailsSummaryProps) {
  const [infoBlockRef, { height: infoBlockHeight }] = useElementSize();
  const jobDuration = humanizeDuration(job.duration * 1000);
  const startedSince = fromNow(job.created_at);
  const [innerJob, setInnerJob] = useState<IEnhancedJob>(job);
  const dispatch = useDispatch<AppDispatch>();
  const TopicIcon = getTopicIcon(innerJob.topic?.name);

  return (
    <div ref={infoBlockRef}>
      <Grid hasGutter>
        <GridItem span={3}>
          <PageSection variant={PageSectionVariants.light}>
            <DescriptionList
              columnModifier={{
                default: "2Col",
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {innerJob.name || innerJob.topic?.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <span
                    style={{
                      color: getColor(innerJob.status),
                    }}
                  >
                    {getIcon(innerJob.status)} {innerJob.status}
                  </span>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm icon={<UsersIcon />}>
                  Team
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <Button
                    variant="link"
                    onClick={() => onTeamClicked(innerJob.team)}
                    isInline
                  >
                    {innerJob.team?.name}
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm icon={<ServerIcon />}>
                  Remoteci
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <Button
                    variant="link"
                    onClick={() => onRemoteciClicked(innerJob.remoteci)}
                    isInline
                  >
                    {innerJob.remoteci?.name}
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm icon={<TopicIcon />}>
                  Topic
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <Button
                    variant="link"
                    onClick={() => onTopicClicked(innerJob.topic)}
                    isInline
                  >
                    {innerJob.topic?.name}
                  </Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm icon={<CogIcon />}>
                  Configuration
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {innerJob.configuration === null ? null : (
                    <JobConfiguration
                      configuration={innerJob.configuration}
                      onConfigurationClicked={onConfigurationClicked}
                    />
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm icon={<CalendarAltIcon />}>
                  Created at
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <span title={`Created at ${innerJob.created_at}`}>
                    {formatDate(innerJob.created_at)}
                  </span>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm icon={<ClockIcon />}>
                  Duration
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {innerJob.status === "new" ||
                  innerJob.status === "pre-run" ||
                  innerJob.status === "running" ? (
                    <span
                      title={`Job duration in seconds ${innerJob.duration}`}
                    >
                      Started {startedSince}
                    </span>
                  ) : (
                    <span
                      title={`Job duration in seconds ${innerJob.duration}`}
                    >
                      Ran for {jobDuration}
                    </span>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>
        </GridItem>
        <GridItem span={3}>
          <PageSection
            variant={PageSectionVariants.light}
            style={{ height: `${infoBlockHeight}px`, overflowY: "auto" }}
          >
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Components</DescriptionListTerm>
                <DescriptionListDescription>
                  <Components components={innerJob.components} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>
        </GridItem>
        <GridItem span={3}>
          <PageSection
            variant={PageSectionVariants.light}
            style={{ height: `${infoBlockHeight}px`, overflowY: "auto" }}
          >
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Tests</DescriptionListTerm>
                <DescriptionListDescription>
                  <Tests tests={innerJob.results} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>
        </GridItem>
        <GridItem span={3}>
          <PageSection
            variant={PageSectionVariants.light}
            style={{ height: `${infoBlockHeight}px`, overflowY: "auto" }}
          >
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Tags</DescriptionListTerm>
                <DescriptionListDescription>
                  {isEmpty(innerJob.tags) ? null : (
                    <LabelGroup numLabels={8}>
                      {innerJob.tags?.map((tag, index) => (
                        <Label
                          key={index}
                          color="blue"
                          className={
                            onTagClicked === undefined ? "" : "pointer"
                          }
                          onClick={() =>
                            onTagClicked === undefined
                              ? void 0
                              : onTagClicked(tag)
                          }
                        >
                          <small>{tag}</small>
                        </Label>
                      ))}
                    </LabelGroup>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm icon={<LinkIcon />}>
                  Url
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {innerJob.url === null ? null : (
                    <Link to={innerJob.url}>{innerJob.url}</Link>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm icon={<CommentIcon />}>
                  Comment
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <TextAreaEditableOnHover
                    text={innerJob.comment || ""}
                    onSubmit={(comment) => {
                      dispatch(
                        updateJobComment({
                          ...innerJob,
                          comment,
                        })
                      ).then(setInnerJob);
                    }}
                  >
                    <CommentBloc>
                      <Markup content={convertLinksToHtml(innerJob.comment)} />
                    </CommentBloc>
                  </TextAreaEditableOnHover>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </PageSection>
        </GridItem>
      </Grid>
    </div>
  );
}
