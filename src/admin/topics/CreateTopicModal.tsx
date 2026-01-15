import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from "@patternfly/react-core";
import { useCreateTopicMutation } from "topics/topicsApi";
import TopicForm from "./TopicForm";

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTopicModal({
  isOpen,
  onClose,
}: CreateTopicModalProps) {
  const [createTopic, { isLoading: isCreating }] = useCreateTopicMutation();

  return (
    <Modal
      id="create_topic_modal"
      aria-label="Create topic modal"
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader title="Create a new topic" />
      <ModalBody>
        <TopicForm
          id="create-topic-form"
          onSubmit={(topic) => {
            onClose();
            createTopic(topic);
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          key="create"
          variant="primary"
          type="submit"
          form="create-topic-form"
          isDisabled={isCreating}
        >
          Create
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
