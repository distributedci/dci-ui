import { Page } from "layout";
import { Breadcrumb } from "ui";
import {
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import TopicsFilter from "jobs/toolbar/TopicsFilter";
import RemotecisFilter from "jobs/toolbar/RemotecisFilter";
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartThemeColor,
  createContainer,
} from "@patternfly/react-charts";
import { useEffect, useState } from "react";
import { IRemoteci, ITopic } from "types";
import http from "services/http";
import { useDispatch } from "react-redux";
import { showAPIError } from "alerts/alertsActions";

interface IDataFromES {
  total: {
    value: number;
    relation: string;
  };
  max_score: number;
  hits: {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: {
      job_id: string;
      created_at: string;
      topic_id: string;
      remoteci_id: string;
      data: {
        name: string;
        duration: number;
      }[];
    };
  }[];
}

interface IGraphData {
  [jobId: string]: { x: string; y: number }[];
}

function transform(dataFromES: IDataFromES) {
  return dataFromES.hits.reduce((acc, hit) => {
    acc[hit._source.job_id] = hit._source.data.reduce(
      (dataAcc, d, i) => {
        dataAcc.push({
          x: `task ${i + 1}: ${d.name}`,
          y: d.duration,
        });
        return dataAcc;
      },
      [] as {
        x: string;
        y: number;
      }[]
    );
    return acc;
  }, {} as IGraphData);
}

export default function TasksDurationPerJobPage() {
  const dispatch = useDispatch();
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [remoteci, setRemoteci] = useState<IRemoteci | null>(null);
  const [data, setData] = useState<IGraphData | null>(null);

  function clearAllFilters() {
    setTopic(null);
    setRemoteci(null);
  }

  useEffect(() => {
    if (topic && remoteci) {
      http
        .get(
          `/api/v1/analytics/tasks_duration_cumulated?remoteci_id=${remoteci.id}&topic_id=${topic.id}`
        )
        .then((response) => {
          const ESData = response.data as IDataFromES;
          setData(transform(ESData));
        })
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        });
    }
  }, [topic, remoteci, dispatch]);
  const CursorVoronoiContainer = createContainer("voronoi", "cursor");
  const maxYDomain =
    data === null
      ? 0
      : Object.values(data).reduce((acc, job) => {
          for (let i = 0; i < job.length; i++) {
            const y = job[i].y;
            if (y > acc) {
              acc = y;
            }
          }
          return acc;
        }, 0);
  return (
    <Page
      title="Tasks duration per job"
      description="Select your topic and remoteci to see duration of tasks per job."
      breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Jobs tasks duration" }]}
        />
      }
    >
      <Card>
        <CardBody>
          <Toolbar
            id="toolbar-select-jobs"
            clearAllFilters={clearAllFilters}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>
                  <TopicsFilter
                    topic_id={topic ? topic.id : null}
                    onClear={() => setTopic(null)}
                    onSelect={setTopic}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <RemotecisFilter
                    remoteci_id={remoteci ? remoteci.id : null}
                    onClear={() => setRemoteci(null)}
                    onSelect={setRemoteci}
                  />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>
        </CardBody>
      </Card>
      <Card className="mt-lg">
        <CardBody>
          {topic && remoteci && data ? (
            <div style={{ height: "560px" }}>
              <Chart
                legendData={Object.keys(data).map((jobId) => ({ name: jobId }))}
                legendOrientation="vertical"
                legendPosition="right"
                maxDomain={{ y: maxYDomain }}
                minDomain={{ y: 0 }}
                containerComponent={
                  <CursorVoronoiContainer
                    cursorDimension="x"
                    labels={({ datum }: { datum: { x: string; y: number } }) =>
                      `${datum.x}: ${datum.y}`
                    }
                    mouseFollowTooltips
                    voronoiDimension="x"
                    voronoiPadding={50}
                  />
                }
                padding={{
                  bottom: 50,
                  left: 50,
                  right: 200,
                  top: 50,
                }}
                themeColor={ChartThemeColor.green}
              >
                <ChartAxis
                  style={{
                    axis: { stroke: "transparent" },
                    ticks: { stroke: "transparent" },
                    tickLabels: { fill: "transparent" },
                  }}
                />

                <ChartAxis dependentAxis />

                <ChartGroup>
                  {Object.keys(data).map((jobId) => (
                    <ChartLine key={jobId} data={data[jobId]} name={jobId} />
                  ))}
                </ChartGroup>
              </Chart>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </Page>
  );
}
