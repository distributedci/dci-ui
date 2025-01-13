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
import { Breadcrumb } from "ui";
import { formatDate } from "services/date";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DateTime } from "luxon";
import { extractKeyValues } from "./keyValues";
import { FilterIcon, TrashAltIcon } from "@patternfly/react-icons";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import {
  IGetAnalyticsJobsEmptyResponse,
  IGetAnalyticsJobsResponse,
  IGraphKeyValue,
  IGraphKeyValues,
} from "types";
import KeyValuesAddGraphModal, {
  IKeyValueGraph,
} from "./KeyValuesAddGraphModal";
import { createSearchFromGraphs, parseGraphsFromSearch } from "./filters";
import { useLocation, useNavigate, useSearchParams } from "react-router";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const jobName = payload[0].payload.job.name;
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        <p>{`Job ${jobName}`}</p>
        {payload.map(
          (p: { name: string; value: number; payload: IGraphKeyValue }) => (
            <div key={p.name}>
              <p>
                {p.name === "created_at"
                  ? `Created on ${formatDate(DateTime.fromMillis(p.value), DateTime.DATE_MED)}`
                  : `${p.payload.key}: ${p.value}`}
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
  graph,
  keyValues,
  onDelete,
}: {
  graph: IKeyValueGraph;
  keyValues: IGraphKeyValues;
  onDelete: () => void;
}) {
  return (
    <Card className="pf-v6-u-mt-md">
      <CardHeader>
        Graph {graph.keys.map((k) => k.key).join(" ")}
        <Button
          onClick={() => {
            onDelete();
          }}
          variant="control"
          className="pf-v6-u-ml-md"
        >
          <TrashAltIcon />
        </Button>
      </CardHeader>
      <CardBody>
        {graph.graphType === "scatter" && (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis
                dataKey="created_at"
                type="number"
                domain={["auto", "auto"]}
                scale="time"
                hide
              />
              <YAxis dataKey="value" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />}
              />
              {graph.keys.map((key, index) => (
                <Scatter
                  key={index}
                  name={key.key}
                  data={keyValues[key.key]}
                  fill={key.color}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
        {/* {graph.graphType === "bar" && (
             <ResponsiveContainer width="100%" height={400}>
               <BarChart
                 width={500}
                 height={400}
                 margin={{
                   top: 20,
                   right: 20,
                   bottom: 20,
                   left: 20,
                 }}
                 data={keyValue}
               >
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="created_at" hide />
                 <YAxis />
                 <Tooltip
                   cursor={{ strokeDasharray: "3 3" }}
                   content={<CustomTooltip />}
                 />
                 <Bar dataKey="value" fill="#3E8635" />
               </BarChart>
             </ResponsiveContainer>
           )}
           {graph.graphType === "line" && (
             <ResponsiveContainer width="100%" height={400}>
               <LineChart
                 width={500}
                 height={400}
                 margin={{
                   top: 20,
                   right: 20,
                   bottom: 20,
                   left: 20,
                 }}
                 data={keyValue}
               >
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="created_at" hide />
                 <YAxis />
                 <Tooltip
                   cursor={{ strokeDasharray: "3 3" }}
                   content={<CustomTooltip />}
                 />
                 <Line
                   dot={false}
                   type="monotone"
                   dataKey="value"
                   fill="#3E8635"
                 />
               </LineChart>
             </ResponsiveContainer>
           )} */}
      </CardBody>
    </Card>
  );
}

function KeyValuesGraphs({
  keyValues,
  ...props
}: {
  keyValues: IGraphKeyValues;
  [key: string]: any;
}) {
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
  }, [graphs.length]);

  return (
    <div>
      <KeyValuesAddGraphModal
        keyValues={keyValues}
        onSubmit={(newGraph) => {
          setGraphs((oldGraphs) => [...oldGraphs, newGraph]);
        }}
        className="pf-v6-u-mt-md"
      />
      {graphs.map((graph, index) => (
        <KeyValueGraph
          key={index}
          graph={graph}
          keyValues={keyValues}
          onDelete={() =>
            setGraphs((oldGraphs) => oldGraphs.filter((g, i) => index !== i))
          }
        />
      ))}
    </div>
  );
  // return (
  //   <div {...props}>
  //     <FormSelect
  //       id="select-graph-type"
  //       value={graphType}
  //       onChange={(event, newGraph) => {
  //         setGraphType(newGraph as IGraphType);
  //       }}
  //       {...props}
  //     >
  //       {(
  //         Object.keys(graphTypeLabels) as Array<keyof typeof graphTypeLabels>
  //       ).map((gT, index) => (
  //         <FormSelectOption
  //           key={index}
  //           value={gT}
  //           label={graphTypeLabels[gT]}
  //         />
  //       ))}
  //     </FormSelect>

  //     {Object.entries(keyValues).map(([key, keyValue]) => (
  //       <Card className="pf-v6-u-mt-md">
  //         <CardHeader>{key}</CardHeader>
  //         <CardBody>
  //           {graphType === "scatter" && (
  //             <ResponsiveContainer width="100%" height={400}>
  //               <ScatterChart
  //                 margin={{
  //                   top: 20,
  //                   right: 20,
  //                   bottom: 20,
  //                   left: 20,
  //                 }}
  //               >
  //                 <CartesianGrid />
  //                 <XAxis
  //                   dataKey="created_at"
  //                   type="number"
  //                   domain={["auto", "auto"]}
  //                   scale="time"
  //                   hide
  //                 />
  //                 <YAxis dataKey="value" />
  //                 <Tooltip
  //                   cursor={{ strokeDasharray: "3 3" }}
  //                   content={<CustomTooltip />}
  //                 />
  //                 <Scatter name={key} data={keyValue} fill="#3E8635" />
  //               </ScatterChart>
  //             </ResponsiveContainer>
  //           )}
  //           {graphType === "bar" && (
  //             <ResponsiveContainer width="100%" height={400}>
  //               <BarChart
  //                 width={500}
  //                 height={400}
  //                 margin={{
  //                   top: 20,
  //                   right: 20,
  //                   bottom: 20,
  //                   left: 20,
  //                 }}
  //                 data={keyValue}
  //               >
  //                 <CartesianGrid strokeDasharray="3 3" />
  //                 <XAxis dataKey="created_at" hide />
  //                 <YAxis />
  //                 <Tooltip
  //                   cursor={{ strokeDasharray: "3 3" }}
  //                   content={<CustomTooltip />}
  //                 />
  //                 <Bar dataKey="value" fill="#3E8635" />
  //               </BarChart>
  //             </ResponsiveContainer>
  //           )}
  //           {graphType === "line" && (
  //             <ResponsiveContainer width="100%" height={400}>
  //               <LineChart
  //                 width={500}
  //                 height={400}
  //                 margin={{
  //                   top: 20,
  //                   right: 20,
  //                   bottom: 20,
  //                   left: 20,
  //                 }}
  //                 data={keyValue}
  //               >
  //                 <CartesianGrid strokeDasharray="3 3" />
  //                 <XAxis dataKey="created_at" hide />
  //                 <YAxis />
  //                 <Tooltip
  //                   cursor={{ strokeDasharray: "3 3" }}
  //                   content={<CustomTooltip />}
  //                 />
  //                 <Line
  //                   dot={false}
  //                   type="monotone"
  //                   dataKey="value"
  //                   fill="#3E8635"
  //                 />
  //               </LineChart>
  //             </ResponsiveContainer>
  //           )}
  //         </CardBody>
  //       </Card>
  //     ))}
  //   </div>
  // );
}

function KeyValues({
  isLoading,
  data,
  ...props
}: {
  isLoading: boolean;
  data: IGetAnalyticsJobsResponse | IGetAnalyticsJobsEmptyResponse | undefined;
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

  if (!data || !data.hits) {
    return null;
  }

  const keyValues = extractKeyValues(data);

  if (Object.keys(keyValues).length === 0) {
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
              We did not find any jobs matching this search. Please modify your
              search.
            </EmptyStateBody>
          </EmptyState>
        </CardBody>
      </Card>
    );
  }

  return <KeyValuesGraphs keyValues={keyValues} />;
  // return (
  //   <div {...props}>
  //     <FormSelect
  //       id="select-graph-type"
  //       value={graphType}
  //       onChange={(event, newGraph) => {
  //         setGraphType(newGraph as IGraphType);
  //       }}
  //       {...props}
  //     >
  //       {(
  //         Object.keys(graphTypeLabels) as Array<keyof typeof graphTypeLabels>
  //       ).map((gT, index) => (
  //         <FormSelectOption
  //           key={index}
  //           value={gT}
  //           label={graphTypeLabels[gT]}
  //         />
  //       ))}
  //     </FormSelect>

  //     {Object.entries(keyValues).map(([key, keyValue]) => (
  //       <Card className="pf-v6-u-mt-md">
  //         <CardHeader>{key}</CardHeader>
  //         <CardBody>
  //           {graphType === "scatter" && (
  //             <ResponsiveContainer width="100%" height={400}>
  //               <ScatterChart
  //                 margin={{
  //                   top: 20,
  //                   right: 20,
  //                   bottom: 20,
  //                   left: 20,
  //                 }}
  //               >
  //                 <CartesianGrid />
  //                 <XAxis
  //                   dataKey="created_at"
  //                   type="number"
  //                   domain={["auto", "auto"]}
  //                   scale="time"
  //                   hide
  //                 />
  //                 <YAxis dataKey="value" />
  //                 <Tooltip
  //                   cursor={{ strokeDasharray: "3 3" }}
  //                   content={<CustomTooltip />}
  //                 />
  //                 <Scatter name={key} data={keyValue} fill="#3E8635" />
  //               </ScatterChart>
  //             </ResponsiveContainer>
  //           )}
  //           {graphType === "bar" && (
  //             <ResponsiveContainer width="100%" height={400}>
  //               <BarChart
  //                 width={500}
  //                 height={400}
  //                 margin={{
  //                   top: 20,
  //                   right: 20,
  //                   bottom: 20,
  //                   left: 20,
  //                 }}
  //                 data={keyValue}
  //               >
  //                 <CartesianGrid strokeDasharray="3 3" />
  //                 <XAxis dataKey="created_at" hide />
  //                 <YAxis />
  //                 <Tooltip
  //                   cursor={{ strokeDasharray: "3 3" }}
  //                   content={<CustomTooltip />}
  //                 />
  //                 <Bar dataKey="value" fill="#3E8635" />
  //               </BarChart>
  //             </ResponsiveContainer>
  //           )}
  //           {graphType === "line" && (
  //             <ResponsiveContainer width="100%" height={400}>
  //               <LineChart
  //                 width={500}
  //                 height={400}
  //                 margin={{
  //                   top: 20,
  //                   right: 20,
  //                   bottom: 20,
  //                   left: 20,
  //                 }}
  //                 data={keyValue}
  //               >
  //                 <CartesianGrid strokeDasharray="3 3" />
  //                 <XAxis dataKey="created_at" hide />
  //                 <YAxis />
  //                 <Tooltip
  //                   cursor={{ strokeDasharray: "3 3" }}
  //                   content={<CustomTooltip />}
  //                 />
  //                 <Line
  //                   dot={false}
  //                   type="monotone"
  //                   dataKey="value"
  //                   fill="#3E8635"
  //                 />
  //               </LineChart>
  //             </ResponsiveContainer>
  //           )}
  //         </CardBody>
  //       </Card>
  //     ))}
  //   </div>
  // );
}

export default function KeyValuesPage() {
  const [getAnalyticJobs, { data, isLoading, isFetching }] =
    useLazyGetAnalyticJobsQuery();
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
        onLoad={({ query, after, before }) => {
          if (query !== "" && after !== "" && before !== "") {
            getAnalyticJobs({ query, after, before });
          }
        }}
        onSearch={({ query, after, before }) => {
          getAnalyticJobs({ query, after, before });
        }}
        isLoading={isFetching}
        data={data}
      />
      <KeyValues isLoading={isLoading} data={data} className="pf-v6-u-mt-md" />
    </PageSection>
  );
}
