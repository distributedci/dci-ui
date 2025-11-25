import {
  Banner,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import RemoteciForm from "./RemoteciForm";
import type { IRemoteciWithApiSecret } from "types";
import { ExclamationTriangleIcon } from "@patternfly/react-icons";

interface CreateRemoteciModalProps {
  onSubmit: (remoteci: Partial<IRemoteciWithApiSecret>) => void;
  showReadOnlyWarning: boolean;
  [x: string]: any;
}

export default function CreateRemoteciModal({
  onSubmit,
  showReadOnlyWarning,
  ...props
}: CreateRemoteciModalProps) {
  const { isOpen, show, hide } = useModal(false);
  return (
    <>
      <Modal
        id="create_remoteci_modal"
        aria-label="Create remoteci modal"
        variant={ModalVariant.medium}
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Create a new remoteci" />
        <ModalBody>
          {showReadOnlyWarning && (
            <div className="pf-v6-u-mb-md">
              <Banner
                screenReaderText="No RemoteCI in Red Hat warning"
                status="warning"
              >
                <div className="flex items-center gap-md">
                  <ExclamationTriangleIcon />
                  <div>
                    <p>
                      You should not create a remoteci under the{" "}
                      <b>Red Hat team</b>. Please select a different team.
                    </p>
                    <p>This feature will be removed in a future release.</p>
                  </div>
                </div>
              </Banner>
            </div>
          )}
          <RemoteciForm
            id="create-remoteci-form"
            onSubmit={(remoteci) => {
              hide();
              onSubmit(remoteci);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="create-remoteci-form"
          >
            Create
          </Button>
          <Button key="cancel" variant="link" onClick={hide}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Button variant="primary" onClick={show} {...props}>
        Create a new remoteci
      </Button>
    </>
  );
}
