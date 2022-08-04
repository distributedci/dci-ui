import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import MainPage from "pages/MainPage";
import { EmptyState, Breadcrumb, CopyButton } from "ui";
import { AppDispatch } from "store";
import pipelinesActions from "./pipelinesActions";
import { getActivePipelines, isFetchingPipelines } from "./pipelinesSelectors";
import { Link } from "react-router-dom";

export default function PipelinesPage() {
  const pipelines = useSelector(getActivePipelines);
  const isFetching = useSelector(isFetchingPipelines);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(pipelinesActions.all());
  }, [dispatch]);

  return (
    <MainPage
      title="Pipelines"
      description="See the latest pipelines"
      loading={isFetching && isEmpty(pipelines)}
      empty={!isFetching && isEmpty(pipelines)}
      EmptyComponent={
        <EmptyState title="There is no pipelines" info="See documentation" />
      }
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Pipelines" }]}
        />
      }
    >
      <table
        className="pf-c-table pf-m-compact pf-m-grid-md"
        role="grid"
        aria-label="Teams table"
        id="teams-table"
      >
        <thead>
          <tr>
            <th>Id</th>
            <th>Pipeline Name</th>
            <th>Team</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {pipelines.map((pipeline) => (
            <tr key={pipeline.id}>
              <th>
                <CopyButton text={pipeline.id} />
              </th>
              <th>{pipeline.name}</th>
              <th>
                <Link to={`/teams/${pipeline.team.id}`}>
                  {pipeline.team.name}
                </Link>
              </th>
              <td>{pipeline.from_now}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainPage>
  );
}
