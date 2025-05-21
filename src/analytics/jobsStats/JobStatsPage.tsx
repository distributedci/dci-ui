import {
  Card,
  CardBody,
  Content,
  Form,
  FormGroup,
  Gallery,
  PageSection,
  Skeleton,
} from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { createRef, useMemo, useState } from "react";
import { useGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import { IAnalyticsJob } from "types";
import { skipToken } from "@reduxjs/toolkit/query";
import Select from "ui/form/Select";
import {
  getJobStats,
  IGroupByKey,
  groupByKeys,
  groupByKeysWithLabel,
  ISliceByKey,
  sliceByKeys,
  sliceByKeysWithLabel,
} from "./jobStats";
import JobStatChart from "./JobStatChart";
import useLocalStorage from "hooks/useLocalStorage";
import ScreeshotNodeButton from "ui/ScreenshotNodeButton";
import { sort } from "services/sort";

function JobStatsGraphs({
  data,
  ...props
}: {
  data: IAnalyticsJob[];
  [key: string]: any;
}) {
  const graphRef = createRef<HTMLDivElement>();
  const [groupByKey, setGroupByKey] = useLocalStorage<IGroupByKey>(
    "jobStatsGroupByKey",
    "topic",
  );
  const [sliceByKey, setSliceByKey] = useLocalStorage<ISliceByKey>(
    "jobStatsSliceByKey",
    "status",
  );
  const jobStats = useMemo(
    () => getJobStats(data, groupByKey, sliceByKey),
    [data, groupByKey, sliceByKey],
  );
  return (
    <div {...props}>
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <Form className="flex items-center space-x-4">
              <FormGroup label="Group by">
                <Select
                  onSelect={(selection) => {
                    if (selection) {
                      setGroupByKey(selection.value);
                    }
                  }}
                  item={{
                    value: groupByKey,
                    label: groupByKeysWithLabel[groupByKey],
                  }}
                  items={groupByKeys.map((key) => ({
                    value: key,
                    label: groupByKeysWithLabel[key],
                  }))}
                />
              </FormGroup>
              <FormGroup label="Slice by">
                <Select
                  onSelect={(selection) => {
                    if (selection) {
                      setSliceByKey(selection.value);
                    }
                  }}
                  item={{
                    value: sliceByKey,
                    label: sliceByKeysWithLabel[sliceByKey],
                  }}
                  items={sliceByKeys.map((key) => ({
                    value: key,
                    label: sliceByKeysWithLabel[key],
                  }))}
                />
              </FormGroup>
            </Form>
            <ScreeshotNodeButton
              node={graphRef}
              filename="job-stat-charts.png"
            />
          </div>
        </CardBody>
      </Card>

      <div ref={graphRef}>
        <Gallery hasGutter className="pf-v6-u-py-md">
          {Object.entries(jobStats)
            .sort(([name1], [name2]) => sort(name1, name2))
            .map(([name, stat], index) => (
              <Card key={index}>
                <CardBody>
                  <JobStatChart name={name} stat={stat} />
                </CardBody>
              </Card>
            ))}
        </Gallery>
      </div>
    </div>
  );
}

function JobStats({
  isLoading,
  data,
  after,
  before,
  ...props
}: {
  isLoading: boolean;
  data: IAnalyticsJob[] | undefined;
  before: string;
  after: string;
  [key: string]: any;
}) {
  if (isLoading) {
    return (
      <Card {...props}>
        <CardBody>
          <Skeleton
            screenreaderText="Loading analytics jobs"
            style={{ height: 80 }}
          />
        </CardBody>
      </Card>
    );
  }

  if (data === undefined || data.length === 0) {
    return null;
  }

  return <JobStatsGraphs data={data} />;
}

export default function JobStatsPage() {
  const [params, setParams] = useState<{
    query: string;
    after: string;
    before: string;
  }>({
    query: "",
    after: "",
    before: "",
  });
  const { query, after, before } = params;
  const shouldSearch = query !== "" && after !== "" && before !== "";
  const { data, isLoading, isFetching } = useGetAnalyticJobsQuery(
    shouldSearch ? params : skipToken,
  );
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Job Stats" },
        ]}
      />
      <Content component="h1">Job Stats</Content>
      <Content component="p">Build a statistical view of your jobs!</Content>
      <AnalyticsToolbar
        onLoad={setParams}
        onSearch={setParams}
        isLoading={isFetching}
        data={data}
      />
      <JobStats
        isLoading={isLoading}
        data={data}
        after={after}
        before={before}
        className="pf-v6-u-mt-md"
      />
    </PageSection>
  );
}
