import { Breadcrumb } from "ui";
import {
  Button,
  Card,
  CardBody,
  Content,
  DatePicker,
  PageSection,
  Skeleton,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import TopicToolbarFilter from "topics/form/TopicToolbarFilter";
import { useEffect, useState } from "react";
import { IGraphData, IRefArea } from "types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { formatDate } from "services/date";
import { getDomain } from "./tasksDurationPerJob";
import { Link, useSearchParams } from "react-router";
import { LinkIcon } from "@patternfly/react-icons";
import { DateTime } from "luxon";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { useLazyGetTasksDurationCumulatedQuery } from "./tasksDurationPerJobApi";
import RemoteciToolbarFilter from "remotecis/form/RemoteciToolbarFilter";
import { humanizeJobDuration } from "jobs/components/duration";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "1em",
        }}
      >
        {payload
          .sort((p1: any, p2: any) => p2.value - p1.value)
          .map((p: any) => (
            <div key={p.name}>
              <p style={{ color: p.stroke }}>{`${p.name.substring(0, 7)} ${
                p.payload.name
              }`}</p>
              <p style={{ color: p.stroke }}>{`${humanizeJobDuration(
                p.value,
              )} (${p.value}s)`}</p>
            </div>
          ))}
      </div>
    );
  }

  return null;
};

const colors = [
  "#0066CC",
  "#4CB140",
  "#009596",
  "#5752D1",
  "#F4C145",
  "#EC7A08",
  "#7D1007",
];

function Graph({ data }: { data: IGraphData[] }) {
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [refArea, setRefArea] = useState<IRefArea>({ left: null, right: null });
  const [domain, setDomain] = useState(getDomain(data, refArea));
  useEffect(() => {
    setDomain(getDomain(data, refArea));
  }, [data, refArea]);
  const { minXDomain, maxXDomain, minYDomain, maxYDomain } = domain;
  const isZoomed = refArea.left && refArea.right;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {isZoomed && (
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setRefArea({ left: null, right: null })}
          >
            reset zoom
          </Button>
        )}
      </div>
      <ResponsiveContainer>
        <LineChart
          onMouseDown={(e: any) => e && setLeft(e.activeLabel)}
          onMouseMove={(e: any) => e && left && setRight(e.activeLabel)}
          onMouseUp={() => {
            if (left === right || right === null) {
              setLeft(null);
              setRight(null);
              return;
            }

            if (left && right && left > right) {
              setRefArea({
                left: right,
                right: left,
              });
            } else {
              setRefArea({
                left,
                right,
              });
            }
            setLeft(null);
            setRight(null);
          }}
        >
          <XAxis
            tick={false}
            dataKey="x"
            type="number"
            allowDuplicatedCategory={false}
            domain={[() => minXDomain, () => maxXDomain]}
          />
          <YAxis
            type="number"
            dataKey="y"
            interval="preserveEnd"
            allowDataOverflow
            domain={[() => minYDomain, () => Math.round(maxYDomain * 1.05)]}
          />

          {!left && (
            <Tooltip isAnimationActive={false} content={<CustomTooltip />} />
          )}

          {data.map((d, i) => (
            <Line
              key={d.id}
              dataKey="y"
              data={d.data}
              dot={false}
              name={`${d.id} ${d.name} ${d.status}`}
              type="stepAfter"
              stroke={colors[i % colors.length]}
            />
          ))}
          {left && right && (
            <ReferenceArea x1={left} x2={right} strokeOpacity={0.3} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function TasksDurationPerJob({
  remoteciId,
  topicId,
  after,
  before,
}: {
  remoteciId: string;
  topicId: string;
  after: string | null;
  before: string | null;
}) {
  const [getTasksDurationCumulated, { data, isLoading }] =
    useLazyGetTasksDurationCumulatedQuery();

  useEffect(() => {
    getTasksDurationCumulated({ remoteciId, topicId });
  }, [remoteciId, topicId, getTasksDurationCumulated]);

  if (isLoading) {
    return <Skeleton screenreaderText="Loading get tasks duration cumulated" />;
  }

  if (!data) {
    return null;
  }

  const maxJobs = 7;
  const filteredData = data
    .filter((d) => {
      if (after) {
        return DateTime.fromISO(d.created_at) >= DateTime.fromISO(after);
      }
      return true;
    })
    .filter((d) => {
      if (before) {
        return DateTime.fromISO(d.created_at) <= DateTime.fromISO(before);
      }
      return true;
    })
    .slice(-maxJobs);

  return (
    <>
      <div style={{ width: "100%", minHeight: "400px", height: "400px" }}>
        <Graph data={filteredData} />
      </div>
      <div className="pf-v6-u-p-xl">
        <Table aria-label="Job Legend">
          <Thead>
            <Tr>
              <Th role="columnheader" scope="col">
                id
              </Th>
              <Th role="columnheader" scope="col">
                name
              </Th>
              <Th role="columnheader" scope="col">
                status
              </Th>
              <Th role="columnheader" scope="col">
                created
              </Th>
              <Th className="text-center" role="columnheader" scope="col">
                Job link
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((d, i) => (
              <Tr key={i}>
                <Td
                  role="cell"
                  data-label="Job id"
                  style={{ color: colors[i % colors.length] }}
                >
                  {d.id}
                </Td>
                <Td role="cell" data-label="Job name">
                  {d.name}
                </Td>
                <Td role="cell" data-label="Job status">
                  {d.status}
                </Td>
                <Td role="cell" data-label="Job created at">
                  <time title={d.created_at} dateTime={d.created_at}>
                    {formatDate(d.created_at)}
                  </time>
                </Td>
                <Td className="text-center" role="cell" data-label="Job status">
                  <Link to={`/jobs/${d.id}/jobStates`}>
                    <LinkIcon />
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </>
  );
}

export default function TasksDurationPerJobPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [topicId, setTopicId] = useState<string | null>(
    searchParams.get("topic_id"),
  );
  const [remoteciId, setRemoteciId] = useState<string | null>(
    searchParams.get("remoteci_id"),
  );
  const [before, setBefore] = useState<string | null>(
    searchParams.get("end_date"),
  );
  const [after, setAfter] = useState<string | null>(
    searchParams.get("start_date"),
  );

  useEffect(() => {
    if (topicId) {
      searchParams.set("topic_id", topicId);
    } else {
      searchParams.delete("topic_id");
    }
    setSearchParams(searchParams);
  }, [topicId, searchParams, setSearchParams]);

  useEffect(() => {
    if (remoteciId) {
      searchParams.set("remoteci_id", remoteciId);
    } else {
      searchParams.delete("remoteci_id");
    }
    setSearchParams(searchParams);
  }, [remoteciId, searchParams, setSearchParams]);

  useEffect(() => {
    if (before) {
      searchParams.set("end_date", before);
    } else {
      searchParams.delete("end_date");
    }
    setSearchParams(searchParams);
  }, [before, searchParams, setSearchParams]);

  useEffect(() => {
    if (after) {
      searchParams.set("start_date", after);
    } else {
      searchParams.delete("start_date");
    }
    setSearchParams(searchParams);
  }, [after, searchParams, setSearchParams]);

  function clearAllFilters() {
    setTopicId(null);
    setRemoteciId(null);
    setAfter(null);
    setBefore(null);
  }

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Jobs tasks duration" },
        ]}
      />
      <Content component="h1">Tasks duration per job</Content>
      <Content component="p">
        Select your topic and remoteci to see duration of tasks per job
      </Content>
      <Card>
        <CardBody>
          <Toolbar
            id="toolbar-select-jobs"
            clearAllFilters={clearAllFilters}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem variant="label">Filter Jobs</ToolbarItem>
                <ToolbarItem>
                  <TopicToolbarFilter
                    id={topicId}
                    onClear={() => setTopicId(null)}
                    onSelect={(topic) => setTopicId(topic.id)}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <RemoteciToolbarFilter
                    id={remoteciId}
                    onSelect={(r) => setRemoteciId(r.id)}
                    onClear={() => setRemoteciId(null)}
                    placeholder="Search by remoteci"
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <ToolbarFilter
                    labels={after === null ? [] : [after]}
                    deleteLabel={() => setAfter(null)}
                    categoryName="Created after"
                    showToolbarItem
                  >
                    <DatePicker
                      value={after || ""}
                      placeholder="Created after"
                      onChange={(e, str) => setAfter(str)}
                      appendTo={() => document.body}
                    />
                  </ToolbarFilter>
                </ToolbarItem>
                <ToolbarItem>
                  <ToolbarFilter
                    labels={before === null ? [] : [before]}
                    deleteLabel={() => setBefore(null)}
                    categoryName="Created before"
                    showToolbarItem
                  >
                    <DatePicker
                      value={before || ""}
                      placeholder="Created before"
                      onChange={(e, str) => setBefore(str)}
                      appendTo={() => document.body}
                    />
                  </ToolbarFilter>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>

      {topicId !== null && remoteciId !== null && (
        <Card className="pf-v6-u-mt-lg">
          <CardBody>
            <TasksDurationPerJob
              remoteciId={remoteciId}
              topicId={topicId}
              before={before}
              after={after}
            />
          </CardBody>
        </Card>
      )}
    </PageSection>
  );
}
