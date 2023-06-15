import {
  Banner,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Progress,
  Title,
} from "@patternfly/react-core";
import { CogsIcon } from "@patternfly/react-icons";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { TeamCreationWizardValues } from "./TeamCreationWizardTypes";
import { useNavigate } from "react-router-dom";
import { createTeam } from "./teamsActions";
import { addUserToTeam, getOrCreateUser } from "users/usersActions";
import { splitTeamMembersString } from "./TeamMembersForm";
import { grantTeamProductPermission } from "permissions/permissionsActions";

export default function CreateTeamWithMembers({
  onClose,
}: {
  onClose: () => void;
}) {
  const { values } = useFormikContext<TeamCreationWizardValues>();
  const [newTeamId, setNewTeamId] = useState<string | null>(null);
  const [percent, setPercent] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    createTeam({
      name: values.name,
      external: values.external,
      state: "active",
    })
      .then((response) => {
        const newTeam = response.data.team;
        setPercent(25);
        setNewTeamId(newTeam.id);
        const createUsersPromises = splitTeamMembersString(
          values.teamMembers
        ).map(getOrCreateUser);

        Promise.all(createUsersPromises)
          .then((users) => {
            setPercent(50);
            const associateUsersToTeamPromises = users.map((user) =>
              addUserToTeam(user.id, newTeam)
            );
            Promise.all(associateUsersToTeamPromises)
              .then(() => {
                setPercent(75);
                const productPermissionPromises = Object.values(
                  values.permissions
                ).map((product) => {
                  grantTeamProductPermission(newTeam, product);
                });

                Promise.all(productPermissionPromises)
                  .then(() => {
                    setPercent(100);
                  })
                  .catch(() =>
                    setErrors([
                      ...errors,
                      "Error associating the team to the products",
                    ])
                  );
              })
              .catch(() =>
                setErrors([...errors, "Error associating users to the team"])
              );
          })
          .catch(() => setErrors([...errors, "Error creating users"]));
      })
      .catch(() => setErrors([...errors, "Team creation failed"]));
  }, []);

  return (
    <div className="pf-l-bullseye">
      <EmptyState variant="large">
        <EmptyStateIcon icon={CogsIcon} />
        <Title headingLevel="h4" size="lg">
          {percent === 100 ? "Team creation complete" : "Creating team"}
        </Title>
        <EmptyStateBody>
          <Progress
            value={percent}
            measureLocation="outside"
            aria-label="validation-progress"
          />
        </EmptyStateBody>
        <EmptyStateBody>
          Please give us a few seconds to complete this process. We will create
          this team, with users and associated permissions.
        </EmptyStateBody>
        <EmptyStateBody>
          {errors.map((error) => (
            <Banner variant="danger" className="pf-u-mb-xs">
              {error}
            </Banner>
          ))}
        </EmptyStateBody>
        <EmptyStateSecondaryActions>
          <Button
            isDisabled={percent !== 100 || newTeamId === null}
            onClick={() => {
              navigate(`/teams/${newTeamId}`);
              onClose();
            }}
          >
            Close
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </div>
  );
}
