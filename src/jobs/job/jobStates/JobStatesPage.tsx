import JobStatesList from "jobs/job/jobStates/JobStatesList";
import { useJob } from "../jobContext";
import JobDetailsHeader from "./JobDetailsHeader";
import { Flex, FlexItem } from "@patternfly/react-core";

export default function JobStatesPage() {
  const { job } = useJob();

  return (
    <div>
      <JobDetailsHeader key={job.id} job={job} className="pf-v6-u-mb-md" />
      <JobStatesList job={job} />
    </div>
  );
}
