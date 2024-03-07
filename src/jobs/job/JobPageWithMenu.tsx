import { useJob } from "./jobContext";
import { Outlet } from "react-router";

import JobPageSkeleton from "./JobPageSkeleton";

export default function JobPageWithMenu() {
  const { job } = useJob();
  return (
    <JobPageSkeleton job_id={job.id}>
      <Outlet />
    </JobPageSkeleton>
  );
}
