import { Card, CardBody } from "@patternfly/react-core";
import { useGetJobHardwareDataQuery } from "analytics/hardware/hardwareApi";
import { EmptyState } from "ui";
import { skipToken } from "@reduxjs/toolkit/query";
import JobHardwareNode from "./JobHardwareNode";
import { sortByName } from "services/sort";
import { useParams } from "react-router";
import { ServerGroupIcon } from "@patternfly/react-icons";
import JobDetailsSkeleton from "../JobDetailsSkeleton";

export default function JobHardwarePage() {
  const { job_id } = useParams();

  const { data, isLoading, error } = useGetJobHardwareDataQuery(
    job_id ? job_id : skipToken,
  );

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="Error loading hardware data"
            info={`Failed to load hardware data for job ${job_id}`}
          />
        </CardBody>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="No hardware data"
            info="No hardware data available for this job"
            icon={ServerGroupIcon}
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {sortByName(data).map((node) => (
        <div key={node.name} className="pf-v6-u-mb-md">
          <JobHardwareNode node={node} />
        </div>
      ))}
    </div>
  );
}
