import { Card, CardBody } from "@patternfly/react-core";
import FilesList from "./FilesList";
import { useJob } from "jobs/job/jobContext";

export default function JobFilesPage() {
  const { job } = useJob();

  return (
    <Card>
      <CardBody>
        <FilesList job={job} />
      </CardBody>
    </Card>
  );
}
