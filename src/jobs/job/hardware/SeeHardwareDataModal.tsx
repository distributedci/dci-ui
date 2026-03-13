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
  node: INode;
}

export default function SeeHardwareDataModal({
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
              <Link to={`/files/${node.hardware.file_id}`} target="_blank">
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
        aria-label="See raw data button"
        icon={<FileIcon />}
        onClick={show}
        size="sm"
      >
        {isOpen ? "hide raw data" : "see raw data"}
      </Button>
    </>
  );
}
