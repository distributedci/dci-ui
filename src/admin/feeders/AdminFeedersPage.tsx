import { CopyButton, EmptyState, ConfirmDeleteModal, Breadcrumb } from "ui";
import { TrashIcon } from "@patternfly/react-icons";
import {
  Button,
  Content,
  InputGroup,
  InputGroupItem,
  Label,
  PageSection,
} from "@patternfly/react-core";
import { Link } from "react-router";
import { AuthentificationFileModal } from "ui/AuthentificationFileModal";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import {
  useCreateFeederMutation,
  useDeleteFeederMutation,
  useListFeedersQuery,
  useUpdateFeederMutation,
} from "./feedersApi";
import { fromNow } from "services/date";
import LoadingPageSection from "ui/LoadingPageSection";
import CreateFeederModal from "./CreateFeederModal";
import EditFeederModal from "./EditFeederModal";

function FeedersTable() {
  const { data, isLoading } = useListFeedersQuery();
  const [updateFeeder, { isLoading: isUpdating }] = useUpdateFeederMutation();
  const [deleteFeeder] = useDeleteFeederMutation();

  if (isLoading) {
    return <LoadingPageSection />;
  }

  if (!data || data.feeders.length === 0) {
    return (
      <EmptyState
        title="There is no feeders"
        info="Do you want to create one?"
      />
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th className="text-center">ID</Th>
          <Th>Name</Th>
          <Th>Team Owner</Th>
          <Th className="text-center">Authentication</Th>
          <Th className="text-center">Status</Th>
          <Th className="text-center">Last auth</Th>
          <Th className="text-center">Created</Th>
          <Th className="text-center">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.feeders.map((feeder) => (
          <Tr key={`${feeder.id}.${feeder.etag}`}>
            <Td isActionCell>
              <CopyButton text={feeder.id} />
            </Td>
            <Td>{feeder.name}</Td>
            <Td>
              <Link to={`/admin/teams/${feeder.team_id}`}>
                {feeder.team_id}
              </Link>
            </Td>
            <Td isActionCell>
              <InputGroup>
                <InputGroupItem>
                  <AuthentificationFileModal
                    type="sh"
                    feeder={feeder}
                    className="pf-v6-u-mr-xs"
                  />
                </InputGroupItem>
                <InputGroupItem>
                  <AuthentificationFileModal type="yaml" feeder={feeder} />
                </InputGroupItem>
              </InputGroup>
            </Td>
            <Td className="text-center">
              {feeder.state === "active" ? (
                <Label color="green">active</Label>
              ) : (
                <Label color="red">inactive</Label>
              )}
            </Td>
            <Td className="text-center">
              {feeder.last_auth_at !== null && (
                <time
                  title={feeder.last_auth_at}
                  dateTime={feeder.last_auth_at}
                >
                  {fromNow(feeder.last_auth_at)}
                </time>
              )}
            </Td>
            <Td className="text-center">{fromNow(feeder.created_at)}</Td>
            <Td isActionCell>
              <InputGroup>
                <InputGroupItem>
                  <EditFeederModal
                    onSubmit={updateFeeder}
                    feeder={feeder}
                    isDisabled={isUpdating}
                  />
                </InputGroupItem>
                <InputGroupItem>
                  <ConfirmDeleteModal
                    title={`Delete feeder ${feeder.name}`}
                    message={`Are you sure you want to delete ${feeder.name}?`}
                    onOk={() => deleteFeeder(feeder)}
                  >
                    {(openModal) => (
                      <Button
                        icon={<TrashIcon />}
                        variant="secondary"
                        isDanger
                        onClick={openModal}
                      >
                        Delete
                      </Button>
                    )}
                  </ConfirmDeleteModal>
                </InputGroupItem>
              </InputGroup>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default function FeedersPage() {
  const [createFeeder, { isLoading: isCreating }] = useCreateFeederMutation();

  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Feeders" }]} />
      <Content component="h1">Feeders</Content>
      <div className="pf-v6-u-mb-md">
        <CreateFeederModal onSubmit={createFeeder} isDisabled={isCreating} />
      </div>
      <FeedersTable />
    </PageSection>
  );
}
