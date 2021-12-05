import { isEmpty } from "lodash";
import JobSummary from "./JobSummary";
import { IEnhancedJob, IJobFilters } from "types";

interface JobsListProps {
  jobs: IEnhancedJob[];
  filters: IJobFilters;
  setFilters: (filters: IJobFilters) => void;
}

export default function JobsList({
  jobs,
  filters,
  setFilters,
}: JobsListProps) {
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
