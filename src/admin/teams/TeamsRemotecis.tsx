import {
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Skeleton,
} from "@patternfly/react-core";
import type { ITeam } from "types";
import { useGetTeamsRemotecisQuery } from "./teamsApi";
import RemotecisAdminTable from "admin/remotecis/RemotecisAdminTable";

function TeamsRemotecisTable({ team }: { team: ITeam }) {
  const { data, isLoading } = useGetTeamsRemotecisQuery(team.id);

  if (isLoading) {
    return <Skeleton screenreaderText="Loading teams's remotecis" />;
  }

  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return (
      <EmptyState>
        <EmptyStateBody>
          There is no remotecis in the {team.name} team.
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return <RemotecisAdminTable remotecis={data} />;
}

export default function TeamsRemotecis({ team }: { team: ITeam }) {
  return (
    <Card>
      <CardTitle>Teams&apos;s remotecis</CardTitle>
      <CardBody>
        <TeamsRemotecisTable team={team} />
      </CardBody>
    </Card>
  );
}
