import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import type { ITopic } from "types";
import { useUpdateTopicMutation } from "topics/topicsApi";
import TopicForm from "./TopicForm";

interface EditTopicModalProps {
  topic: ITopic;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTopicModal({
  topic,
  isOpen,
  onClose,
}: EditTopicModalProps) {
  const [updateTopic, { isLoading: isUpdating }] = useUpdateTopicMutation();

  return (
    <Modal
      id="edit-topic-modal"
      aria-label="Edit topic modal"
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader title={`Edit topic ${topic.name}`} />
      <ModalBody>
        <TopicForm
          id="edit-topic-form"
          topic={topic}
          onSubmit={(t) => {
            onClose();
            updateTopic(t);
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          key="edit"
          variant="primary"
          type="submit"
          form="edit-topic-form"
          isDisabled={isUpdating}
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
