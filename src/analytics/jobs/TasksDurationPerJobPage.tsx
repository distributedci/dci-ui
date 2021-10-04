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
import { useState } from "react";
import { IRemoteci, ITopic } from "types";

interface IDataFromES {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
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
  };
}

function transform(dataFromES: IDataFromES) {
  return dataFromES.hits.hits.reduce((acc, hit) => {
    acc[hit._source.job_id] = hit._source.data.reduce(
      (dataAcc, d) => {
        dataAcc.push({
          x: d.name,
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
  }, {} as { [jobId: string]: { x: string; y: number }[] });
}

export default function TasksDurationPerJobPage() {
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [remoteci, setRemoteci] = useState<IRemoteci | null>(null);

  function clearAllFilters() {
    setTopic(null);
    setRemoteci(null);
  }

  const data = transform({
    took: 1,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: {
        value: 2,
        relation: "eq",
      },
      max_score: 1.0,
      hits: [
        {
          _index: "tasks_duration_cumulated",
          _type: "_doc",
          _id: "81f71c4b-62b6-415a-b406-17a58f8d6ada",
          _score: 1.0,
          _source: {
            job_id: "81f71c4b-62b6-415a-b406-17a58f8d6ada",
            created_at: "2021-09-29T15:41:17.173600",
            topic_id: "8728c241-eb90-47eb-b080-b957bd2d818e",
            remoteci_id: "207e6a77-7a50-49b1-82b1-64c07f42e68a",
            data: [
              {
                name: "PLAYBOOK: agent.yml",
                duration: 0,
              },
              {
                name: "PLAY [Schedule a job]",
                duration: 0,
              },
              {
                name: "TASK [Read credentials from env vars]",
                duration: 6,
              },
              {
                name: "TASK [print job id]",
                duration: 9,
              },
              {
                name: "TASK [Set global variables]",
                duration: 14,
              },
              {
                name: "TASK [set job state]",
                duration: 20,
              },
              {
                name: "PLAY [Preparation]",
                duration: 22,
              },
              {
                name: "TASK [pre-run]",
                duration: 25,
              },
              {
                name: "TASK [get CNF version from job_info]",
                duration: 26,
              },
              {
                name: "TASK [do some checks]",
                duration: 27,
              },
              {
                name: "TASK [display cnf_version]",
                duration: 28,
              },
              {
                name: "TASK [validate extravars]",
                duration: 29,
              },
              {
                name: "PLAY [Running cnf]",
                duration: 30,
              },
              {
                name: "TASK [running]",
                duration: 31,
              },
              {
                name: "TASK [print the hosts input file path]",
                duration: 32,
              },
              {
                name: "TASK [install cnf]",
                duration: 33,
              },
              {
                name: "PLAY [success tasks]",
                duration: 34,
              },
              {
                name: "TASK [success]",
                duration: 35,
              },
              {
                name: "TASK [success message]",
                duration: 35,
              },
            ],
          },
        },
        {
          _index: "tasks_duration_cumulated",
          _type: "_doc",
          _id: "748e8468-ed85-454d-a96b-206b0506ab76",
          _score: 1.0,
          _source: {
            job_id: "748e8468-ed85-454d-a96b-206b0506ab76",
            created_at: "2021-09-29T15:41:50.111249",
            topic_id: "97893873-9e13-47b4-bdf0-47f8b884352d",
            remoteci_id: "23f1ed0f-c7b6-46ef-ac06-1a81d0443de2",
            data: [
              {
                name: "PLAYBOOK: agent.yml",
                duration: 0,
              },
              {
                name: "PLAY [Schedule a job]",
                duration: 0,
              },
              {
                name: "TASK [Read credentials from env vars]",
                duration: 5,
              },
              {
                name: "TASK [print job id]",
                duration: 8,
              },
              {
                name: "TASK [Set global variables]",
                duration: 13,
              },
              {
                name: "TASK [set job state]",
                duration: 15,
              },
              {
                name: "PLAY [Preparation]",
                duration: 17,
              },
              {
                name: "TASK [pre-run]",
                duration: 20,
              },
              {
                name: "TASK [get CNF version from job_info]",
                duration: 21,
              },
              {
                name: "TASK [do some checks]",
                duration: 22,
              },
              {
                name: "TASK [display cnf_version]",
                duration: 23,
              },
              {
                name: "TASK [validate extravars]",
                duration: 24,
              },
              {
                name: "PLAY [Running cnf]",
                duration: 25,
              },
              {
                name: "TASK [running]",
                duration: 26,
              },
              {
                name: "TASK [print the hosts input file path]",
                duration: 27,
              },
              {
                name: "TASK [install cnf]",
                duration: 28,
              },
              {
                name: "PLAY [success tasks]",
                duration: 29,
              },
              {
                name: "TASK [success]",
                duration: 30,
              },
              {
                name: "TASK [success message]",
                duration: 30,
              },
            ],
          },
        },
      ],
    },
  });
  const CursorVoronoiContainer = createContainer("voronoi", "cursor");
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
          {topic && remoteci ? (
            <div style={{ height: "560px" }}>
              <Chart
                legendData={Object.keys(data).map((jobId) => ({ name: jobId }))}
                legendOrientation="vertical"
                legendPosition="right"
                maxDomain={{ y: 40 }}
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
                    <ChartLine data={data[jobId]} name={jobId} />
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
