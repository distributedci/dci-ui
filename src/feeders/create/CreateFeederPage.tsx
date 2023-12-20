import { useDispatch } from "react-redux";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import feedersActions from "../feedersActions";
import CreateFeederForm from "./CreateFeederForm";
import { AppDispatch } from "store";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "ui";
import { useListTeamsQuery } from "teams/teamsApi";

export default function CreateFeederPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useListTeamsQuery();
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <MainPage
      title="Create a feeder"
      description=""
      isLoading={isLoading}
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Create a feeder" }]}
        />
      }
    >
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <CreateFeederForm
                teams={data.teams}
                onSubmit={(feeder) => {
                  dispatch(feedersActions.create(feeder)).then(() =>
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
