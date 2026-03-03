import {
  Button,
  CodeBlock,
  CodeBlockCode,
  Content,
  Modal,
  ModalBody,
  ModalHeader,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import type { INode } from "analytics/hardware/hardwareFormatter";
import { FileIcon } from "@patternfly/react-icons";
import { Link } from "react-router";

interface SeeHardwareDataModalProps {
  jobId: string;
  node: INode;
}

export default function SeeHardwareDataModal({
  jobId,
  node,
}: SeeHardwareDataModalProps) {
  const { isOpen, show, hide } = useModal(false);
  const content = JSON.stringify(node.hardware, null, 2);
  return (
    <>
      <Modal
        id="file-content-viewer-modal"
        aria-label="File content viewer modal"
        isOpen={isOpen}
        onClose={hide}
        variant="large"
      >
        <ModalHeader>
          <Content>
            <h1>Raw hardware data for {node.name}</h1>
            <p>
              The data are normalized from the file{" "}
              <Link to={`/jobs/${jobId}/files`}>
                {node.hardware.filename || "unknown file"}
              </Link>
            </p>
          </Content>
        </ModalHeader>
        <ModalBody>
          <CodeBlock>
            <CodeBlockCode>
              <pre style={{ overflowX: "auto", whiteSpace: "pre" }}>
                {content}
              </pre>
            </CodeBlockCode>
          </CodeBlock>
        </ModalBody>
      </Modal>
      <Button
        variant="secondary"
        aria-label="See ES data button"
        icon={<FileIcon />}
        onClick={show}
        size="sm"
      >
        {isOpen ? "hide ES data" : "see ES data"}
      </Button>
    </>
  );
}
