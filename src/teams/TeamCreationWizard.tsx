import { Button, Wizard } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TeamMembersForm, { TeamMembersFormSchema } from "./TeamMembersForm";
import TeamPermissionForm from "./TeamPermissionForm";
import { Formik } from "formik";
import CreateTeamForm, { CreateTeamFormSchema } from "./CreateTeamForm";
import TeamCreationWizardReviewStep from "./TeamCreationWizardReviewStep";
import { TeamCreationWizardValues } from "./TeamCreationWizardTypes";
import CreateTeamWithMembers from "./CreateTeamWithMembers";

const TeamCreationWizardSchema = CreateTeamFormSchema.concat(
  TeamMembersFormSchema
);

export default function TeamCreationWizard() {
  const { isOpen, show, hide } = useModal(false);
  return (
    <div>
      <Button variant="primary" onClick={show}>
        Create a new team
      </Button>
      <Formik
        initialValues={{
          name: "",
          external: true,
          teamMembers: "",
          permissions: {},
        }}
        validationSchema={TeamCreationWizardSchema}
        onSubmit={(values: TeamCreationWizardValues) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({ isValid, dirty }) => (
          <Wizard
            title="Team creation"
            description="Create a team, add users and set permissions."
            descriptionComponent="div"
            steps={[
              {
                name: "Create team",
                component: <CreateTeamForm />,
                enableNext: isValid && dirty,
              },
              {
                name: "Add users",
                component: <TeamMembersForm />,
                enableNext: isValid && dirty,
              },
              {
                name: "Set permissions",
                component: <TeamPermissionForm />,
                enableNext: isValid && dirty,
              },
              {
                name: "Review",
                component: <TeamCreationWizardReviewStep />,
                enableNext: isValid && dirty,
                nextButtonText: "Create",
              },
              {
                name: "Finish",
                component: <CreateTeamWithMembers onClose={hide} />,
                isFinishedStep: true,
              },
            ]}
            onClose={hide}
            isOpen={isOpen}
          />
        )}
      </Formik>
    </div>
  );
}
