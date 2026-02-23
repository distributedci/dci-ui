import { useEffect, useMemo, useState } from "react";
import {
  PageSection,
  Content,
  Gallery,
  Card,
  CardTitle,
  CardBody,
  FormGroup,
  Skeleton,
} from "@patternfly/react-core";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";
import { getRangeDates } from "services/date";
import type { TimeRange } from "types";
import Breadcrumb from "ui/Breadcrumb";
import RangeSelect, { rangeLabels } from "ui/form/RangeSelect";
import MetricCard from "./MetricCard";
import JobsByRemoteciChart from "./JobsByRemoteciChart";
import JobsByProductChart from "./JobsByProductChart";
import TopicsPieChart from "./TopicsPieChart";
import TrendChart from "./TrendChart";
import {
  computeMetrics,
  aggregateJobsByRemoteci,
  aggregateJobsByProduct,
  aggregateJobsByTopic,
  aggregateJobsByPeriod,
} from "./dashboardUtils";

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("last7Days");

  const [getJobs, { data: jobsData, isFetching: loading }] =
    useLazyGetAnalyticJobsQuery();

  useEffect(() => {
    const dates = getRangeDates(selectedRange);
    getJobs({
      query: "(team.name=~'.*')",
      range: selectedRange,
      ...dates,
      limit: 200,
      offset: 0,
    });
  }, [selectedRange, getJobs]);

  const metrics = useMemo(
    () => computeMetrics(jobsData?.jobs),
    [jobsData],
  );

  const remoteciData = useMemo(
    () => aggregateJobsByRemoteci(jobsData?.jobs),
    [jobsData],
  );

  const productData = useMemo(
    () => aggregateJobsByProduct(jobsData?.jobs),
    [jobsData],
  );

  const topicData = useMemo(
    () => aggregateJobsByTopic(jobsData?.jobs),
    [jobsData],
  );

  const trendData = useMemo(
    () => aggregateJobsByPeriod(jobsData?.jobs, selectedRange),
    [jobsData, selectedRange],
  );

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Dashboard" },
        ]}
      />
      <Content component="h1">Dashboard</Content>

      {/* Time period selector */}
      <FormGroup label="Time period" className="pf-v6-u-mt-md">
        <RangeSelect
          defaultValues={{
            range: selectedRange,
            after: "",
            before: "",
          }}
          ranges={["last7Days", "last30Days", "last90Days"]}
          onChange={(range) => setSelectedRange(range)}
        />
      </FormGroup>

      {/* Metrics */}
      <Gallery hasGutter maxWidths={{ md: "50%" }} className="pf-v6-u-mt-md">
        <MetricCard
          value={metrics.total}
          label={`Total Jobs (${rangeLabels[selectedRange]})`}
          loading={loading}
        />
        <MetricCard
          value={metrics.failed}
          label={`Failed Jobs (${rangeLabels[selectedRange]})`}
          loading={loading}
        />
      </Gallery>

      {/* Main Charts */}
      <Gallery hasGutter className="pf-v6-u-mt-lg" minWidths={{ md: "50%" }}>
        <Card style={{ gridColumn: "1 / -1" }}>
          <CardTitle>Jobs by Remoteci ({rangeLabels[selectedRange]})</CardTitle>
          <CardBody>
            {loading ? (
              <Skeleton height="300px" />
            ) : (
              <JobsByRemoteciChart data={remoteciData} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardTitle>Jobs by Product ({rangeLabels[selectedRange]})</CardTitle>
          <CardBody>
            {loading ? (
              <Skeleton height="300px" />
            ) : (
              <JobsByProductChart data={productData} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardTitle>Topics Distribution ({rangeLabels[selectedRange]})</CardTitle>
          <CardBody>
            {loading ? (
              <Skeleton height="300px" />
            ) : (
              <TopicsPieChart stat={topicData} />
            )}
          </CardBody>
        </Card>

        <Card style={{ gridColumn: "1 / -1" }}>
          <CardTitle>Job Trend ({rangeLabels[selectedRange]})</CardTitle>
          <CardBody>
            {loading ? (
              <Skeleton height="300px" />
            ) : (
              <TrendChart data={trendData} />
            )}
          </CardBody>
        </Card>
      </Gallery>
    </PageSection>
  );
}
