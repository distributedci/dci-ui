import { useEffect, useState } from "react";
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { BlinkLogo, Breadcrumb, EmptyState } from "ui";
import { IComponentMatrixESData, ITopic } from "types";
import {
  buildComponentMatrix,
  getComponentMatrixDomain,
} from "./componentMatrix";
import http from "services/http";
import { useDispatch } from "react-redux";
import { showAPIError } from "alerts/alertsActions";
import MainPage from "pages/MainPage";
import TopicsFilter from "jobs/toolbar/TopicsFilter";
import { InfoCircleIcon, SearchIcon } from "@patternfly/react-icons";
import chroma from "chroma-js";

export default function ComponentMatrixPage() {
  const dispatch = useDispatch();
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ESData, setESData] = useState<IComponentMatrixESData | null>(null);
  const componentsPerProductIds = buildComponentMatrix(ESData);
  const { min, max } = getComponentMatrixDomain(componentsPerProductIds);
  const colorScale = chroma.scale("OrRd").domain([max,min]);
  // const colorScale1 = chroma.scale("YlGn").domain([min, max]);
  // const colorScale2 = chroma.scale(['#f00', '#0f0']).mode('lrgb').domain([min, max]);
  // const colorScale3 = chroma.scale("YlGnBu").domain([min, max]);

  function contrastedColor(color: chroma.Color) {
    const white = chroma("white");
    const contrastWithWhite = chroma.contrast(color, white);
    const black = chroma("black");
    const contrastWithBlack = chroma.contrast(color, black);
    if (contrastWithWhite >= contrastWithBlack) {
      return white;
    }
    return black;
  }

  useEffect(() => {
    setIsLoading(true);
    if (topic) {
      http
        .get(`/api/v1/analytics/tasks_components_coverage?topic_id=${topic.id}`)
        .then((response) => {
          setESData(response.data as IComponentMatrixESData);
        })
        .catch((error) => {
          dispatch(showAPIError(error));
          return error;
        })
        .then(() => setIsLoading(false));
    }
  }, [topic, dispatch]);

  return (
    <MainPage
      title="Component matrix"
      description="See which components has been tested. Table of components and associated jobs."
      breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/analytics", title: "Analytics" },
            { title: "Component matrix" },
          ]}
        />
      }
    >
      <Card>
        <CardBody>
          <Toolbar
            id="toolbar-select-jobs"
            clearAllFilters={() => {
              setTopic(null);
            }}
            collapseListedFiltersBreakpoint="xl"
          >
            <ToolbarContent>
              <ToolbarGroup>
                <ToolbarItem>Choose a topic</ToolbarItem>
              </ToolbarGroup>
              <ToolbarGroup>
                <ToolbarItem>
                  <TopicsFilter
                    topic_id={topic ? topic.id : null}
                    onClear={() => setTopic(null)}
                    onSelect={setTopic}
                  />
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarContent>
          </Toolbar>

          {topic === null ? (
            <EmptyState
              title="Choose a topic"
              info="Select a topic in the topic list to display the components matrix"
              icon={() => <InfoCircleIcon size="lg" />}
            />
          ) : isLoading ? (
            <Bullseye>
              <BlinkLogo />
            </Bullseye>
          ) : Object.keys(componentsPerProductIds).length === 0 ? (
            <EmptyState
              title="No results found"
              info="No results match the filter criteria. Clear all filters and try again."
              action={
                <Button variant="link" onClick={() => setTopic(null)}>
                  Clear all filters
                </Button>
              }
              icon={SearchIcon}
            />
          ) : (
            <table
              className="pf-c-table pf-m-compact pf-m-grid-md"
              role="grid"
              aria-label="Job Legend"
            >
              <thead>
                <tr role="row">
                  <th role="columnheader" scope="col">
                    Component name
                  </th>
                  <th className="text-center" role="columnheader" scope="col">
                    # jobs
                  </th>
                  <th className="text-center" role="columnheader" scope="col">
                    # successful jobs
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(componentsPerProductIds).map(
                  (componentsPerProduct, i) =>
                    Object.values(componentsPerProduct).map((component, i) => {
                      const backgroundColor = colorScale(
                        component.nbOfSuccessfulJobs
                      );
                      const color = contrastedColor(backgroundColor);
                      return (
                        <tr key={i} role="row">
                          <td role="cell" data-label="Component name">
                            {component.name}
                          </td>
                          <td
                            role="cell"
                            className="text-center"
                            data-label="Nb of jobs"
                          >
                            {component.nbOfJobs}
                          </td>
                          <td
                            role="cell"
                            className="text-center"
                            data-label="Nb of successful jobs"
                            style={{
                              backgroundColor: backgroundColor.hex(),
                              color: color.hex(),
                            }}
                          >
                            {component.nbOfSuccessfulJobs}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </MainPage>
  );
}
