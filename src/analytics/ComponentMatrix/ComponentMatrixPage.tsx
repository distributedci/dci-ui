import { useEffect, useState } from "react";
import { Page } from "layout";
import { isEmpty } from "lodash";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";
import { EmptyState, Breadcrumb } from "ui";
import { IComponentMatrixESData } from "types";
import {
  buildComponentMatrix,
  getComponentMatrixDomain,
} from "./componentMatrix";
import { scaleSequential } from "d3-scale";
import { interpolateRdYlGn } from "d3-scale-chromatic";
import http from "services/http";
import { useDispatch } from "react-redux";
import { showAPIError } from "alerts/alertsActions";

export default function ComponentMatrixPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [ESData, setESData] = useState<IComponentMatrixESData[]>([]);
  const componentsPerProductIds = buildComponentMatrix(ESData);
  const { min, max } = getComponentMatrixDomain(componentsPerProductIds);
  const colorScale = scaleSequential(interpolateRdYlGn).domain([min, max]);

  useEffect(() => {
    http
      .get(`/api/v1/analytics/tasks_components_coverage`)
      .then((response) => {
        setESData(response.data as IComponentMatrixESData[]);
      })
      .catch((error) => {
        dispatch(showAPIError(error));
        return error;
      })
      .then(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Page
      title="Component matrix"
      description="See which components has been tested. Table of components and associated jobs."
      loading={isLoading && isEmpty(ESData)}
      empty={!isLoading && isEmpty(ESData)}
      EmptyComponent={
        <EmptyState
          title="This page is empty"
          info="There is no information to display in this page at the moment. If you think this is an error contact the DCI team."
        />
      }
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
      <Card
        title="Click to see detailed stats for this topic"
        className="pointer"
      >
        <CardTitle>Component matrix</CardTitle>
        <CardBody>
          <div style={{ maxWidth: "640px" }}>
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
                    Object.values(componentsPerProduct).map((component, i) => (
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
                            backgroundColor: colorScale(
                              component.nbOfSuccessfulJobs
                            ),
                          }}
                        >
                          {component.nbOfSuccessfulJobs}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </Page>
  );
}
