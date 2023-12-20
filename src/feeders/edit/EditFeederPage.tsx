import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import feedersActions from "../feedersActions";
import EditFeederForm from "./EditFeederForm";
import { AppDispatch } from "store";
import { useNavigate, useParams } from "react-router-dom";
import { IFeeder } from "types";
import { Breadcrumb } from "ui";
import LoadingPage from "pages/LoadingPage";
import { useListTeamsQuery } from "teams/teamsApi";

export default function EditFeederPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [feeder, setFeeder] = useState<IFeeder | null>(null);
  const { feeder_id } = useParams();

  const { data, isLoading } = useListTeamsQuery();

  useEffect(() => {
    if (feeder_id) {
      dispatch(feedersActions.one(feeder_id)).then((response) => {
        setFeeder(response.data.feeder);
      });
    }
  }, [dispatch, feeder_id]);

  if (!feeder_id || !data) return null;

  const breadcrumb = (
    <Breadcrumb
      links={[
        { to: "/", title: "DCI" },
        { to: "/feeders", title: "Feeders" },
        { to: `/feeders/${feeder_id}`, title: feeder_id },
      ]}
    />
  );

  if (feeder === null) {
    return <LoadingPage title="Edit a feeder" Breadcrumb={breadcrumb} />;
  }

  return (
    <MainPage
      title="Edit a feeder"
      description="A feeder is a script in charge of uploading newer versions of components to the control server."
      Breadcrumb={breadcrumb}
      isLoading={isLoading}
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <EditFeederForm
                feeder={feeder}
                teams={data.teams}
                onSubmit={(feeder) => {
                  dispatch(feedersActions.update(feeder)).then(() =>
                    navigate("/feeders"),
                  );
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </MainPage>
  );
}
