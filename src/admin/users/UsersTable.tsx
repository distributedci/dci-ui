import { CopyButton } from "ui";
import { Link } from "react-router";
import type { IUser } from "types";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import { fromNow } from "services/date";
import { Label } from "@patternfly/react-core";

interface UsersTableProps {
  users: IUser[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <Table aria-label="Users table">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Login</Th>
          <Th>Full name</Th>
          <Th>Email</Th>
          <Th>Active</Th>
          <Th>Red Hat login</Th>
          <Th>Last auth</Th>
          <Th>Created</Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((user) => (
          <Tr key={user.id}>
            <Td dataLabel="ID" isActionCell>
              <CopyButton text={user.id} />
            </Td>
            <Td dataLabel="Login">
              <Link to={`/admin/users/${user.id}`}>{user.name}</Link>
            </Td>
            <Td dataLabel="Full name">{user.fullname}</Td>
            <Td dataLabel="Email">{user.email}</Td>
            <Td>
              {user.state === "active" ? (
                <Label color="green">active</Label>
              ) : (
                <Label color="red">inactive</Label>
              )}
            </Td>
            <Td dataLabel="Red Hat login">{user.sso_username}</Td>
            <Td>
              {user.last_auth_at !== null && (
                <time title={user.last_auth_at} dateTime={user.last_auth_at}>
                  {fromNow(user.last_auth_at)}
                </time>
              )}
            </Td>
            <Td dataLabel="Created">
              <time title={user.created_at} dateTime={user.created_at}>
                {fromNow(user.created_at)}
              </time>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
