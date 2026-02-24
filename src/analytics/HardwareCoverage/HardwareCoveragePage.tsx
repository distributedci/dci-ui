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
import type {
  AnalyticsToolbarSearch,
  IAnalyticsJob,
  IGenericAnalyticsData,
} from "types";
import { useSearchParams } from "react-router";
import { useLazyGetAnalyticsHardwareJobsQuery } from "analytics/analyticsApi";
import AnalyticsToolbar from "analytics/toolbar/AnalyticsToolbar";
import ScreeshotNodeButton from "ui/ScreenshotNodeButton";
import TypeaheadSelect from "ui/form/TypeaheadSelect";
import {
  createHardwareCoverageHeatMap,
  HARDWARE_TYPES,
  type HardwareType,
} from "./heatMap";
import HeatMapTable from "./HeatMapTable";

function getUniqueComponentTypes(jobs: IAnalyticsJob[]): string[] {
  const typeSet = new Set<string>();

  for (const job of jobs) {
    for (const component of job.components ?? []) {
      typeSet.add(component.type);
    }
  }

  return Array.from(typeSet).sort();
}

function HardwareCoverageCard({
  data,
}: {
  data: IGenericAnalyticsData<IAnalyticsJob & { nodes?: import("analytics/hardware/hardwareFormatter").ESNode[] }>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const graphRef = createRef<HTMLTableElement>();
  const [hardwareType, setHardwareType] = useState<string>(
    searchParams.get("hardwareType") || "",
  );
  const [search, setSearch] = useState<string>("");
  const [componentTypeTarget, setComponentTypeTarget] = useState<string>(
    searchParams.get("componentTypeTarget") || "",
  );
  const componentTypes = getUniqueComponentTypes(data.jobs);
  const heatMap = createHardwareCoverageHeatMap(
    data.jobs,
    hardwareType as HardwareType,
    componentTypeTarget,
  );

  useEffect(() => {
    if (hardwareType && componentTypeTarget) {
      searchParams.set("hardwareType", hardwareType);
      searchParams.set("componentTypeTarget", componentTypeTarget);
      setSearchParams(searchParams);
    }
  }, [hardwareType, componentTypeTarget]);

  const hardwareTypeOptions = HARDWARE_TYPES.map((type) => ({
    id: type,
    name: type,
  }));

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
                  label="Hardware type source"
                  htmlFor="hardware-type-source"
                >
                  <TypeaheadSelect
                    id="hardware-type-source"
                    name="hardware-type-source"
                    item={{
                      id: hardwareType,
                      name: hardwareType,
                    }}
                    isFetching={false}
                    items={hardwareTypeOptions
                      .filter(
                        (c) =>
                          search.length === 0 ||
                          c.name.toLowerCase().includes(search.toLowerCase()),
                      )
                      .slice(0, 50)}
                    onSelect={(selection) => {
                      if (selection) {
                        setHardwareType(selection.name);
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
                    item={{
                      id: componentTypeTarget,
                      name: componentTypeTarget,
                    }}
                    items={componentTypes
                      .filter(
                        (c) =>
                          search.length === 0 ||
                          c.toLowerCase().includes(search.toLowerCase()),
                      )
                      .slice(0, 50)
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
                    filename="hardware-coverage.png"
                  />
                </FlexItem>
              </Flex>
            </Flex>
          </Form>
        </CardBody>
      </Card>
      <Card className="pf-v6-u-mt-md" ref={graphRef}>
        <CardBody>
          {hardwareType && componentTypeTarget && (
            <HeatMapTable {...heatMap} />
          )}
        </CardBody>
      </Card>
    </>
  );
}

function HardwareCoverage({
  isLoading,
  data,
}: {
  isLoading: boolean;
  data: IGenericAnalyticsData<IAnalyticsJob & { nodes?: import("analytics/hardware/hardwareFormatter").ESNode[] }> | undefined;
}) {
  if (isLoading) {
    return (
      <>
        <Card>
          <CardBody>
            <Skeleton
              screenreaderText="Loading hardware coverage form"
              style={{ height: 114 }}
            />
          </CardBody>
        </Card>
        <Card className="pf-v6-u-mt-md">
          <CardBody>
            <Skeleton
              screenreaderText="Loading hardware coverage heat map"
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

  return <HardwareCoverageCard data={data} />;
}

export default function HardwareCoveragePage() {
  const [getAnalyticJobs, { data, isLoading, isFetching }] =
    useLazyGetAnalyticsHardwareJobsQuery();
  const search = (values: AnalyticsToolbarSearch) => {
    if (values.query) {
      getAnalyticJobs(values);
    }
  };
  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/analytics", title: "Analytics" },
          { title: "Hardware coverage" },
        ]}
      />
      <Content component="h1">Hardware coverage</Content>
      <Content component="p">
        The hardware coverage page gives you the coverage matrix between hardware
        types and component types. Select a hardware type source and a target
        component type. And check how many jobs have been launched with these
        hardware and components.
      </Content>
      <AnalyticsToolbar
        onLoad={search}
        onSearch={search}
        isLoading={isFetching}
        data={data}
      />
      <div className="pf-v6-u-mt-md">
        <HardwareCoverage isLoading={isLoading} data={data} />
      </div>
    </PageSection>
  );
}
