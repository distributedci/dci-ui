import { Button, Modal, ModalHeader, ModalBody } from "@patternfly/react-core";

import type { IAnalyticsJob } from "@/types";
import useModal from "@/hooks/useModal";
import AnalyticsJobTable from "../jobs/AnalyticsJobTable";

export default function AnalyticsJobsModal<T extends IAnalyticsJob>({
  jobs,
  ...props
}: {
  jobs: T[];
  [key: string]: any;
}) {
  const { isOpen, show, hide } = useModal(false);

  return (
    <>
      <Button variant="link" isInline onClick={show} {...props}>
        See the job{jobs.length > 1 ? "s" : ""}
      </Button>
      .
      <Modal
        id="jobs-list-modal"
        aria-label="Analytics jobs list"
        isOpen={isOpen}
        onClose={hide}
      >
        <ModalHeader title="Jobs list" />
        <ModalBody>
          <AnalyticsJobTable jobs={jobs} />
        </ModalBody>
      </Modal>
    </>
  );
}
