import { isEmpty } from "lodash";
import { Label, LabelGroup } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  BugIcon,
  ExclamationCircleIcon,
  StopCircleIcon,
  InProgressIcon,
} from "@patternfly/react-icons";
import { IEnhancedJob, IJobFilters, IRemoteci, ITeam, ITopic } from "types";
import { fromNow, humanizeDuration } from "services/date";
import { getTopicIcon } from "ui/icons";
import { getBackground } from "./jobSummary/jobSummaryUtils";

function JobStatus({ status }: { status: string }) {
  switch (status) {
    case "success":
      return (
        <Label isCompact color="green" icon={<CheckCircleIcon />}>
          {status}
        </Label>
      );
    case "failure":
      return (
        <Label isCompact color="red" icon={<BugIcon />}>
          {status}
        </Label>
      );
    case "error":
      return (
        <Label isCompact color="red" icon={<ExclamationCircleIcon />}>
          {status}
        </Label>
      );
    case "killed":
      return (
        <Label isCompact color="orange" icon={<StopCircleIcon />}>
          {status}
        </Label>
      );
    default:
      return (
        <Label isCompact color="blue" icon={<InProgressIcon />}>
          {status}
        </Label>
      );
  }
}

interface JobSummaryProps {
  job: IEnhancedJob;
  onTagClicked: (tag: string) => void;
  onRemoteciClicked: (remoteci: IRemoteci) => void;
  onTeamClicked: (team: ITeam) => void;
  onTopicClicked: (topic: ITopic) => void;
  onConfigurationClicked: (configuration: string) => void;
}

function JobSummary({
  job,
  onTagClicked,
  onRemoteciClicked,
  onTeamClicked,
  onTopicClicked,
  onConfigurationClicked,
}: JobSummaryProps) {
  const jobDuration = humanizeDuration(job.duration * 1000);
  const startedSince = fromNow(job.created_at);
  const TopicIcon = getTopicIcon(job.topic?.name);
  const principalComponent =
    job.components.find((component) => {
      const name = (
        component.canonical_project_name || component.name
      ).toLowerCase();
      return (
        name.indexOf("openshift ") !== -1 ||
        name.indexOf("rhel-") !== -1 ||
        name.indexOf("rhos-") !== -1
      );
    }) || null;
  const config = job.configuration;
  return (
    <tr
      key={`${job.id}.${job.etag}`}
      style={{ background: getBackground(job.status) }}
    >
      <td>
        <Link to={`/jobs/${job.id}/jobStates`}>
          <span>{job.name || job.topic?.name}</span>
        </Link>
      </td>
      <td>
        <JobStatus status={job.status} />
      </td>
      <td>
        {config && (
          <Label
            isCompact
            color="grey"
            className="pointer"
            onClick={() => onConfigurationClicked(config)}
          >
            {config}
          </Label>
        )}
      </td>
      <td>
        <Label
          isCompact
          color="grey"
          className="pointer"
          onClick={() => onTeamClicked(job.team)}
        >
          {job.team?.name}
        </Label>
      </td>
      <td>
        <Label
          isCompact
          color="grey"
          className="pointer"
          onClick={() => onRemoteciClicked(job.remoteci)}
        >
          {job.remoteci?.name}
        </Label>
      </td>
      <td>
        <Label
          isCompact
          color="grey"
          className="pointer"
          onClick={() => onTopicClicked(job.topic)}
        >
          {job.topic?.name}
        </Label>
      </td>
      <td>
        {principalComponent === null ? null : (
          <Link
            to={`/topics/${principalComponent.topic_id}/components/${principalComponent.id}`}
          >
            <TopicIcon className="mr-xs" />
            {principalComponent.canonical_project_name ||
              principalComponent.name}
          </Link>
        )}
      </td>
      <td>
        {job.tags.length === 0 ? null : (
          <LabelGroup numLabels={3} isCompact>
            {job.tags.map((tag, index) => (
              <Label
                key={index}
                color="blue"
                className="pointer"
                isCompact
                onClick={() => onTagClicked && onTagClicked(tag)}
              >
                {tag}
              </Label>
            ))}
          </LabelGroup>
        )}
      </td>
      <td>
        <span title={`Job duration in seconds ${job.duration}`}>
          {jobDuration}
        </span>
      </td>
      <td>
        <span title={`Created at ${job.created_at}`}>{startedSince}</span>
      </td>
    </tr>
  );
}

interface JobsListProps {
  jobs: IEnhancedJob[];
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
}

export default function JobsList({ jobs, filters, setFilters }: JobsListProps) {
  if (isEmpty(jobs)) return null;
  return (
    <table className="pf-c-table pf-m-compact pf-m-grid-md">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Config</th>
          <th>Team</th>
          <th>Remoteci</th>
          <th>Topic</th>
          <th>Component</th>
          <th>Tags</th>
          <th>Duration</th>
          <th>Last run</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <JobSummary
            key={`${job.id}:${job.etag}`}
            job={job}
            onTagClicked={(tag) => {
              setFilters({
                ...filters,
                tags: [...filters.tags, tag],
              });
            }}
            onRemoteciClicked={(remoteci) => {
              setFilters({
                ...filters,
                remoteci_id: remoteci.id,
              });
            }}
            onTeamClicked={(team) => {
              setFilters({
                ...filters,
                team_id: team.id,
              });
            }}
            onTopicClicked={(topic) => {
              setFilters({
                ...filters,
                topic_id: topic.id,
              });
            }}
            onConfigurationClicked={(configuration) => {
              setFilters({
                ...filters,
                configuration: configuration,
              });
            }}
          />
        ))}
      </tbody>
    </table>
  );
}
