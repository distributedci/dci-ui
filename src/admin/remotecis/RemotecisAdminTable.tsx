import { CopyIconButton } from "ui";
import { Label } from "@patternfly/react-core";
import type { IRemoteci, IRemoteciWithTeam } from "types";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
  type IAction,
} from "@patternfly/react-table";
import { fromNow } from "services/date";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import {
  useDeactivateRemoteciMutation,
  useReactivateRemoteciMutation,
} from "remotecis/remotecisApi";

interface RemotecisAdminTableProps {
  remotecis: IRemoteciWithTeam[];
}

export default function RemotecisAdminTable({
  remotecis,
}: RemotecisAdminTableProps) {
  const [reactivateRemoteci] = useReactivateRemoteciMutation();
  const [deactivateRemoteci] = useDeactivateRemoteciMutation();

  const buildRemoteciActions = (remoteci: IRemoteci): IAction[] => {
    const actions: IAction[] = [];
    if (remoteci.state === "active") {
      actions.push({
        title: (
          <span style={{ color: t_global_color_status_danger_default.var }}>
            Deactivate
          </span>
        ),
        onClick: () => deactivateRemoteci(remoteci),
      });
    } else {
      actions.push({
        title: "Reactivate",
        onClick: () => reactivateRemoteci(remoteci),
      });
    }
    return actions;
  };

  return (
    <Table borders={false}>
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Name</Th>
          <Th className="text-center">Status</Th>
          <Th className="text-center">Team</Th>
          <Th>Last auth</Th>
          <Th>Created</Th>
          <Th className="text-center">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {remotecis.map((remoteci) => {
          const remoteciActions = buildRemoteciActions(remoteci);
          return (
            <Tr key={`${remoteci.id}.${remoteci.etag}`}>
              <Td>
                <span>
                  <CopyIconButton
                    text={remoteci.id}
                    textOnSuccess="copied"
                    className="pf-v6-u-mr-xs pointer"
                  />
                  {remoteci.id}
                </span>
              </Td>
              <Td>{remoteci.name}</Td>
              <Td className="text-center">
                {remoteci.state === "active" ? (
                  <Label color="green">active</Label>
                ) : (
                  <Label color="red">inactive</Label>
                )}
              </Td>
              <Td className="text-center">{remoteci.team.name}</Td>
              <Td>
                {remoteci.last_auth_at !== null && (
                  <time
                    title={remoteci.last_auth_at}
                    dateTime={remoteci.last_auth_at}
                  >
                    {fromNow(remoteci.last_auth_at)}
                  </time>
                )}
              </Td>
              <Td>
                <time
                  title={remoteci.created_at}
                  dateTime={remoteci.created_at}
                >
                  {fromNow(remoteci.created_at)}
                </time>
              </Td>
              <Td className="text-center">
                <ActionsColumn items={remoteciActions} />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
