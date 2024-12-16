import {
  Grid,
  GridItem,
  Card,
  CardBody,
  PageSection,
  Content,
} from "@patternfly/react-core";
import CreateFeederForm from "./CreateFeederForm";
import { useNavigate } from "react-router";
import { Breadcrumb } from "ui";
import { useCreateFeederMutation } from "feeders/feedersApi";

export default function CreateFeederPage() {
  const [createFeeder] = useCreateFeederMutation();
  const navigate = useNavigate();

  return (
    <PageSection>
      <Breadcrumb
        links={[
          { to: "/", title: "DCI" },
          { to: "/feeders", title: "Feeders" },
          { title: "Create a feeder" },
        ]}
      />
      <Content component="h1">Create a feeder</Content>
      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <CreateFeederForm
                onSubmit={(feeder) => {
                  createFeeder(feeder).then(() => navigate("/feeders"));
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
}
