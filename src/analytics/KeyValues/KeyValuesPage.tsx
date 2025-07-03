import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  PageSection,
  Skeleton,
} from "@patternfly/react-core";
import { Breadcrumb } from "@/ui";
import { formatDate } from "@/services/date";
import { createRef, useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  type XAxisProps,
} from "recharts";
import { DateTime } from "luxon";
import { timeDay } from "d3-time";
import {
  extractKeys,
  extractKeysValues,
  type IGraphKeysValues,
} from "./keyValues";
import { FilterIcon, TrashAltIcon } from "@patternfly/react-icons";
import { useGetAnalyticsKeysValuesJobsQuery } from "@/analytics/analyticsApi";
import AnalyticsToolbar from "@/analytics/toolbar/AnalyticsToolbar";
import type {
  IAnalyticsKeysValuesJob,
  IGenericAnalyticsData,
  IJob,
} from "@/types";
import KeyValuesAddGraphModal from "./KeyValuesAddGraphModal";
import { createSearchFromGraphs, parseGraphsFromSearch } from "./filters";
import { useNavigate, useSearchParams } from "react-router";
import type { IKeyValueGraph } from "./keyValuesTypes";
import KeyValuesEditGraphModal from "./KeyValuesEditGraphModal";
import { skipToken } from "@reduxjs/toolkit/query";
import ScreeshotNodeButton from "@/ui/ScreenshotNodeButton";
import { scaleTime } from "d3-scale";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const jobName = payload[0].payload.name;
    const createdAt = formatDate(
      DateTime.fromMillis(payload[0].payload.created_at),
      DateTime.DATE_MED,
    );
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        <p>{`Created on ${createdAt}`}</p>
        <p>{`Job ${jobName}`}</p>
        {payload.map(
          (p: {
            name: string;
            value: number;
            stroke: string;
            payload: IGraphKeysValues["data"][0];
          }) => (
            <div key={p.name}>
              <p style={{ color: p.stroke }}>
                {p.name}: {p.value}
              </p>
            </div>
          ),
        )}
      </div>
    );
  }

  return null;
};

function KeyValueGraph({
  data,
  graph,
}: {
  data: IGraphKeysValues;
  graph: IKeyValueGraph;
}) {
  const openJob = (payload: any) => {
    if ("payload" in payload) {
      const job = payload.payload as IJob;
      window.open(`/jobs/${job.id}/jobStates`);
    }
  };

  const timeValues = data.data.map((row) => row.created_at);
  const timeScale = scaleTime()
    .domain([Math.min(...timeValues), Math.max(...timeValues)])
    .nice();
  const xAxisArgs: XAxisProps = {
    domain: timeScale.domain().map((date) => date.valueOf()),
    scale: graph.graphType === "bar" ? "auto" : timeScale,
    type: graph.graphType === "bar" ? "category" : "number",
    ticks: timeScale.ticks(timeDay).map((date) => date.valueOf()),
    tickFormatter: (timestamp: number) =>
      DateTime.fromMillis(timestamp).toFormat("dd MMM yyyy"),
  };
  return (
    <div style={{ overflow: "auto" }}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data.data}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="created_at" {...xAxisArgs} />
          {data.yAxis.map((axis) => (
            <YAxis orientation={axis.orientation} yAxisId={axis.orientation}>
              <Label
                value={axis.label}
                position={axis.orientation}
                angle={axis.orientation === "right" ? 90 : -90}
                style={{ textAnchor: "middle", fill: axis.color }}
              />
            </YAxis>
          ))}
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<CustomTooltip />}
          />
          <Legend />
          {data.keys.map((key, i) =>
            key.graphType === "line" ? (
              <Line
                type="monotone"
                key={i}
                connectNulls
                name={key.label}
                yAxisId={key.axis}
                dataKey={`keysValues.${key.key}`}
                stroke={key.color}
                activeDot={{
                  r: 6,
                  cursor: "pointer",
                  onClick: (event, payload) => {
                    openJob(payload);
                  },
                }}
              />
            ) : key.graphType === "scatter" ? (
              <Scatter
                key={i}
                name={key.label}
                yAxisId={key.axis}
                dataKey={`keysValues.${key.key}`}
                fill={key.color}
                cursor="pointer"
                onClick={openJob}
              />
            ) : (
              <Bar
                key={i}
                name={key.label}
                yAxisId={key.axis}
                dataKey={`keysValues.${key.key}`}
                fill={key.color}
                cursor="pointer"
                onClick={openJob}
              />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function KeyValuesGraphs({
  data,
  ticks,
  ...props
}: {
  data: IAnalyticsKeysValuesJob[];
  [key: string]: any;
}) {
  const graphRef = createRef<HTMLDivElement>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [graphs, setGraphs] = useState<IKeyValueGraph[]>(
    parseGraphsFromSearch(searchParams.get("graphs")),
  );

  useEffect(() => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    const graphSearch = createSearchFromGraphs(graphs);
    if (graphSearch) {
      updatedSearchParams.set("graphs", graphSearch);
    } else {
      updatedSearchParams.delete("graphs");
    }
    navigate(`?${updatedSearchParams.toString()}`);
  }, [graphs, graphs.length, navigate, searchParams]);

  const keys = extractKeys(data);

  if (keys.length === 0) {
    return (
      <Card {...props}>
        <CardBody>
          <EmptyState
            variant={EmptyStateVariant.xs}
            icon={FilterIcon}
            titleText="No job"
            headingLevel="h4"
          >
            <EmptyStateBody>
              We did not find any jobs with key values matching this search.
              Please modify your search.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  return (
    <div {...props}>
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <KeyValuesAddGraphModal
              keys={keys}
              onSubmit={(newGraph) => {
                setGraphs((oldGraphs) => [newGraph, ...oldGraphs]);
              }}
            />
            <ScreeshotNodeButton
              node={graphRef}
              filename="key-values-charts.png"
            />
          </div>
        </CardBody>
      </Card>
      <div ref={graphRef} className="pf-v6-u-pb-md">
        {graphs.map((graph, index) => (
          <Card className="pf-v6-u-mt-md" key={index}>
            <CardHeader>
              {graph.name}
              <KeyValuesEditGraphModal
                keys={keys}
                graph={graph}
                className="pf-v6-u-ml-md"
                onSubmit={(newGraph) =>
                  setGraphs((oldGraphs) =>
                    oldGraphs.map((g, i) =>
                      index === i ? { ...newGraph } : { ...g },
                    ),
                  )
                }
              />
              <Button
                onClick={() =>
                  setGraphs((oldGraphs) =>
                    oldGraphs.filter((g, i) => index !== i),
                  )
                }
                variant="plain"
                className="pf-v6-u-ml-xs"
              >
                <TrashAltIcon />
              </Button>
            </CardHeader>
            <CardBody>
              <KeyValueGraph
                data={extractKeysValues(graph, data)}
                graph={graph}
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function KeyValues({
  isLoading,
  data,
  after,
  before,
  ...props
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<IAnalyticsKeysValuesJob> | undefined;
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

  if (data === undefined) {
    return null;
  }

  return <KeyValuesGraphs data={data.jobs} />;
}

export default function KeyValuesPage() {
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
  const { data, isLoading, isFetching } = useGetAnalyticsKeysValuesJobsQuery(
    shouldSearch ? params : skipToken,
  );
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Key Values" },
        ]}
      />
      <Content component="h1">Key Values</Content>
      <Content component="p">Graph the key values of your jobs</Content>
      <AnalyticsToolbar
        onLoad={setParams}
        onSearch={setParams}
        isLoading={isFetching}
        data={data}
      />
      <KeyValues
        isLoading={isLoading}
        data={data}
        after={after}
        before={before}
        className="pf-v6-u-mt-md"
      />
    </PageSection>
  );
}
