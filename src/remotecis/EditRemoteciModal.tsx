import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import RemoteciForm from "./RemoteciForm";
import type { IRemoteci } from "types";
import { useUpdateRemoteciMutation } from "./remotecisApi";

interface EditRemoteciModalProps {
  remoteci: IRemoteci | null;
  onClose: () => void;
  [x: string]: any;
}

export default function EditRemoteciModal({
  remoteci,
  onClose,
  ...props
}: EditRemoteciModalProps) {
  if (remoteci === null) return null;
  const [updateRemoteci] = useUpdateRemoteciMutation();

  return (
    <Modal
      id="edit_remoteci_modal"
      aria-label="Edit remoteci modal"
      variant={ModalVariant.medium}
      isOpen
      onClose={onClose}
      {...props}
    >
      <ModalHeader title={`Edit ${remoteci.name}`} />
      <ModalBody>
        <RemoteciForm
          id="edit-remoteci-form"
          remoteci={remoteci}
          onSubmit={(editedRemoteci) => {
            const { id, etag, name } = editedRemoteci as Partial<IRemoteci>;
            updateRemoteci({
              id,
              etag,
              name,
            }).finally(() => {
              onClose();
            });
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          key="edit"
          variant="primary"
          type="submit"
          form="edit-remoteci-form"
        >
          Edit
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
