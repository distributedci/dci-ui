import TestsList from "jobs/job/tests/TestsList";
import { useJob } from "../jobContext";

export default function JobTestsPage() {
  const { job } = useJob();

  return (
    <div
      style={{
        margin: "0.5rem 0",
      }}
    >
      <TestsList tests={job.tests} />
    </div>
  );
}
