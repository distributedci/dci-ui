import { Card, Gallery, CardBody, Skeleton } from "@patternfly/react-core";

import { ArrowUpIcon, ArrowDownIcon } from "@patternfly/react-icons";
import { useGetDashboardJobsQuery } from "./analyticsApi";

export default function JobsStatisticsHeader() {
  const { data, isLoading } = useGetDashboardJobsQuery();

  if (isLoading) {
    return (
      <Gallery
        hasGutter
        maxWidths={{
          default: "1fr",
        }}
        className="pf-v6-u-mb-xl"
      >
        <Card>
          <CardBody>
            <div>
              <div className="pf-v6-u-font-size-md pf-v6-u-text-color-subtle">
                Total Jobs
              </div>
              <span className="pf-v6-u-font-size-4xl">
                <Skeleton />
              </span>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div>
              <div className="pf-v6-u-font-size-md pf-v6-u-text-color-subtle">
                Successful Jobs
              </div>
              <div>
                <span className="pf-v6-u-font-size-4xl">
                  <Skeleton />
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </Gallery>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Gallery
      hasGutter
      maxWidths={{
        default: "1fr",
      }}
      className="pf-v6-u-mb-xl"
    >
      <Card>
        <CardBody>
          <div>
            <div className="pf-v6-u-font-size-md pf-v6-u-text-color-subtle">
              Total Jobs
            </div>
            <div>
              <span className="pf-v6-u-font-size-4xl pf-v6-u-text-color-status-info">
                {data.totalJobs}
              </span>

              <span
                className={`pf-v6-u-font-size-md pf-v6-u-ml-sm ${data.variationTotalJobs > 0 ? "pf-v6-u-text-color-status-success" : "pf-v6-u-text-color-status-danger"}`}
              >
                {data.variationTotalJobs > 0 ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon />
                )}{" "}
                {data.variationTotalJobs}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div>
            <div className="pf-v6-u-font-size-md pf-v6-u-text-color-subtle">
              Successful Jobs
            </div>
            <div>
              <span className="pf-v6-u-font-size-4xl pf-v6-u-text-color-status-info">
                {data.successfulJobs}
              </span>

              <span
                className={`pf-v6-u-font-size-md pf-v6-u-ml-sm ${data.variationSuccessfulJobs > 0 ? "pf-v6-u-text-color-status-success" : "pf-v6-u-text-color-status-danger"}`}
              >
                {data.variationSuccessfulJobs > 0 ? (
                  <ArrowUpIcon />
                ) : (
                  <ArrowDownIcon />
                )}{" "}
                {data.variationSuccessfulJobs}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Gallery>
  );
}
