import { useRef } from "react";
import * as React from "react";
import { FormikProps } from "formik";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import useModal from "hooks/useModal";
import TeamForm from "./TeamForm";
import { INewTeam } from "types";

interface CreateTeamModalProps {
  onSubmit: (team: INewTeam) => void;
  children: (open: () => void) => React.ReactNode;
}

export default function CreateTeamModal({
  onSubmit,
  children,
}: CreateTeamModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const formRef = useRef<FormikProps<INewTeam>>(null);
  return (
    <>
      <Modal
        id="create_team_modal"
        aria-label="Create team modal"
        variant={ModalVariant.medium}
        title="Create a new team"
        isOpen={isOpen}
        onClose={hide}
        actions={[
          <Button
            key="create"
            variant="primary"
            onClick={() => {
              hide();
              if (formRef.current) {
                formRef.current.handleSubmit();
              }
            }}
          >
            Create
          </Button>,
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>,
        ]}
      >
        <TeamForm ref={formRef} onSubmit={onSubmit} />
      </Modal>
      {children(show)}
    </>
  );
}
