import { createRef, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Content,
  PageSection,
  Skeleton,
  Form,
  Flex,
  FormGroup,
  FlexItem,
} from "@patternfly/react-core";

import { Breadcrumb } from "ui";
import type { IAnalyticsJob, IGenericAnalyticsData } from "types";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useLazyGetAnalyticJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import ScreeshotNodeButton from "ui/ScreenshotNodeButton";
import TypeaheadSelect from "ui/form/TypeaheadSelect";

type HeatMapComponent = {
  id: string;
  display_name: string;
};

type HeatMapMatrix = {
  labelsY: HeatMapComponent[];
  labelsX: HeatMapComponent[];
  matrix: number[][];
  maxValue: number;
};

function createHeatMap(
  jobs: IAnalyticsJob[],
  sourceType: string,
  targetType: string,
): HeatMapMatrix {
  const sourceMap = new Map<string, HeatMapComponent>();
  const targetMap = new Map<string, HeatMapComponent>();

  for (const job of jobs) {
    for (const component of job.components) {
      if (component.type === sourceType && !sourceMap.has(component.id)) {
        sourceMap.set(component.id, {
          id: component.id,
          display_name: component.display_name,
        });
      }
      if (component.type === targetType && !targetMap.has(component.id)) {
        targetMap.set(component.id, {
          id: component.id,
          display_name: component.display_name,
        });
      }
    }
  }

  const labelsY = Array.from(sourceMap.values()); // rows
  const labelsX = Array.from(targetMap.values()); // cols

  const indexMapY = new Map<string, number>();
  const indexMapX = new Map<string, number>();
  labelsY.forEach((comp, i) => indexMapY.set(comp.id, i));
  labelsX.forEach((comp, i) => indexMapX.set(comp.id, i));

  const matrix = Array.from({ length: labelsY.length }, () =>
    Array(labelsX.length).fill(0),
  );

  let maxValue = 0;

  for (const job of jobs) {
    const sourceIds = job.components
      .filter((c) => c.type === sourceType)
      .map((c) => c.id);
    const targetIds = job.components
      .filter((c) => c.type === targetType)
      .map((c) => c.id);

    for (const sourceId of sourceIds) {
      const row = indexMapY.get(sourceId);
      if (row === undefined) continue;

      for (const targetId of targetIds) {
        const col = indexMapX.get(targetId);
        if (col === undefined) continue;

        matrix[row][col] += 1;
        if (matrix[row][col] > maxValue) {
          maxValue = matrix[row][col];
        }
      }
    }
  }

  return {
    labelsY,
    labelsX,
    matrix,
    maxValue,
  };
}

function viridisFixedColor(value: number, maxValue: number): string {
  if (value === 0) return "transparent";

  const VIRIDIS_REVERSED: string[] = [
    "rgb(68, 1, 84)",
    "rgb(72, 27, 109)",
    "rgb(70, 50, 126)",
    "rgb(63, 71, 136)",
    "rgb(54, 92, 141)",
    "rgb(46, 110, 142)",
    "rgb(39, 127, 142)",
    "rgb(33, 145, 140)",
    "rgb(31, 161, 135)",
    "rgb(45, 178, 125)",
    "rgb(74, 193, 109)",
    "rgb(115, 208, 86)",
    "rgb(160, 218, 57)",
    "rgb(208, 225, 28)",
  ];

  const ratio = Math.min(Math.max(value / maxValue, 0), 1);
  const index = Math.floor(ratio * (VIRIDIS_REVERSED.length - 1));
  return VIRIDIS_REVERSED[index];
}

export function HeatMapTable({
  labelsY,
  labelsX,
  matrix,
  maxValue,
}: HeatMapMatrix) {
  const CELL_SIZE = 42;
  const COLUMNS = labelsX.length + 1;
  const ROWS = labelsY.length + 1;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `300px repeat(${labelsX.length}, ${CELL_SIZE}px)`,
        gridTemplateRows: `300px repeat(${labelsY.length}, ${CELL_SIZE}px)`,
        overflow: "auto",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          width: "250px",
          height: "250px",
          gridArea: "1 / 1 / 2 / 2",
        }}
      />

      <div
        style={{
          display: "flex",
          overflow: "hidden",
          gridArea: `1 / 2 / 2 / ${COLUMNS + 1}`,
        }}
      >
        {labelsX.map((component) => (
          <div
            key={component.id}
            title={component.display_name}
            style={{
              width: `${CELL_SIZE}px`,
              display: "flex",
              alignItems: "center",
              paddingTop: "1em",
              transform: "rotate(180deg)",
              writingMode: "vertical-rl",
              textAlign: "center",
            }}
          >
            <Link to={`/components/${component.id}`}>
              {component.display_name}
            </Link>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          gridArea: `2 / 1 / ${ROWS + 1} / 2`,
        }}
      >
        {labelsY.map((comp) => (
          <div
            key={comp.id}
            title={comp.display_name}
            style={{
              height: `${CELL_SIZE}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              paddingLeft: "2px",
            }}
          >
            <Link to={`/components/${comp.id}`}>{comp.display_name}</Link>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, ${CELL_SIZE}px)`,
          gridAutoRows: `${CELL_SIZE}px`,
          gridArea: `2 / 2 / ${ROWS + 1} / ${COLUMNS + 1}`,
          overflow: "auto",
          backgroundColor: "#f0f0f0",
        }}
      >
        {matrix.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            const bgColor = viridisFixedColor(value, maxValue);
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                style={{
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`,
                  textAlign: "center",
                  lineHeight: `${CELL_SIZE}px`,
                  fontSize: "0.75rem",
                  backgroundColor: bgColor,
                  color: "white",
                }}
                title={`(${labelsY[rowIdx].display_name}, ${labelsX[colIdx].display_name}): ${value}`}
              >
                {value > 0 ? value : ""}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

function getUniqueComponentTypes(jobs: IAnalyticsJob[]): string[] {
  const typeSet = new Set<string>();

  for (const job of jobs) {
    for (const component of job.components) {
      typeSet.add(component.type);
    }
  }

  return Array.from(typeSet).sort();
}

function ComponentCoverageCard({
  data,
}: {
  data: IGenericAnalyticsData<IAnalyticsJob>;
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const graphRef = createRef<HTMLTableElement>();
  const [componentTypeSource, setComponentTypeSource] = useState<string>(
    searchParams.get("componentTypeSource") || "",
  );
  const [search, setSearch] = useState<string>("");
  const [componentTypeTarget, setComponentTypeTarget] = useState<string>(
    searchParams.get("componentTypeTarget") || "",
  );
  const componentTypes = getUniqueComponentTypes(data.jobs);
  const heatMap = createHeatMap(
    data.jobs,
    componentTypeSource,
    componentTypeTarget,
  );

  useEffect(() => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set("componentTypeSource", componentTypeSource);
    updatedSearchParams.set("componentTypeTarget", componentTypeTarget);
    navigate(`?${updatedSearchParams.toString()}`, { replace: true });
  }, [componentTypeSource, componentTypeTarget]);

  return (
    <>
      <Card className="pf-v6-u-mt-md">
        <CardBody>
          <Form>
            <Flex
              columnGap={{ default: "columnGap2xl" }}
              direction={{ default: "column", lg: "row" }}
              justifyContent={{ default: "justifyContentSpaceBetween" }}
            >
              <Flex
                flex={{ default: "flex_1" }}
                columnGap={{ default: "columnGapXl" }}
              >
                <FormGroup
                  label="Component type source"
                  htmlFor="component-type-source"
                >
                  <TypeaheadSelect
                    id="component-type-source"
                    name="component-type-source"
                    isFetching={false}
                    items={componentTypes
                      .filter(
                        (c) =>
                          search.length === 0 ||
                          c.toLowerCase().includes(search.toLowerCase()),
                      )
                      .slice(0, 10)
                      .map((key) => ({
                        id: key,
                        name: key,
                      }))}
                    onSelect={(selection) => {
                      if (selection) {
                        setComponentTypeSource(selection.name);
                      }
                    }}
                    onSearch={setSearch}
                  />
                </FormGroup>
                <FormGroup
                  label="Component type target"
                  htmlFor="component-type-target"
                >
                  <TypeaheadSelect
                    id="component-type-target"
                    name="component-type-target"
                    isFetching={false}
                    items={componentTypes
                      .filter(
                        (c) =>
                          search.length === 0 ||
                          (c.toLowerCase().includes(search.toLowerCase()) &&
                            c !== componentTypeSource),
                      )
                      .slice(0, 10)
                      .map((key) => ({
                        id: key,
                        name: key,
                      }))}
                    onSelect={(selection) => {
                      if (selection) {
                        setComponentTypeTarget(selection.name);
                      }
                    }}
                    onSearch={setSearch}
                  />
                </FormGroup>
              </Flex>
              <Flex alignSelf={{ default: "alignSelfFlexEnd" }}>
                <FlexItem>
                  <ScreeshotNodeButton
                    node={graphRef}
                    filename="component-coverage.png"
                  />
                </FlexItem>
              </Flex>
            </Flex>
          </Form>
        </CardBody>
      </Card>
      <Card className="pf-v6-u-mt-md" ref={graphRef}>
        <CardBody>
          {componentTypeSource && componentTypeTarget && (
            <HeatMapTable {...heatMap} />
          )}
        </CardBody>
      </Card>
    </>
  );
}

function ComponentsCoverage({
  isLoading,
  data,
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<IAnalyticsJob> | undefined;
}) {
  if (isLoading) {
    return (
      <>
        <Card>
          <CardBody>
            <Skeleton
              screenreaderText="Loading components coverage form"
              style={{ height: 114 }}
            />
          </CardBody>
        </Card>
        <Card className="pf-v6-u-mt-md">
          <CardBody>
            <Skeleton
              screenreaderText="Loading components coverage heat map"
              style={{ height: 242 }}
            />
          </CardBody>
        </Card>
      </>
    );
  }

  if (data === undefined) {
    return null;
  }

  return <ComponentCoverageCard data={data} />;
}

export default function ComponentCoveragePage() {
  const [getAnalyticJobs, { data, isLoading, isFetching }] =
    useLazyGetAnalyticJobsQuery();
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Component coverage" },
        ]}
      />
      <Content component="h1">Component coverage</Content>
      <Content component="p">
        See which components has been tested. Table of components and associated
        jobs.
      </Content>
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
      <div className="pf-v6-u-mt-md">
        <ComponentsCoverage isLoading={isLoading} data={data} />
      </div>
    </PageSection>
  );
}
