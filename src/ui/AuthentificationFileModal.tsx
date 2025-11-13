import { useEffect, useState } from "react";
import {
  Button,
  CodeBlock,
  CodeBlockCode,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";
import copyToClipboard from "services/copyToClipboard";
import type { IFeeder } from "types";

function getContent(id: string, api_secret: string, type: "sh" | "yaml") {
  return type === "sh"
    ? ` export DCI_CLIENT_ID='feeder/${id}'
 export DCI_API_SECRET='${api_secret}'
 export DCI_CS_URL='https://api.distributed-ci.io/'`
    : `---
  DCI_CLIENT_ID: feeder/${id}
  DCI_API_SECRET: ${api_secret}
  DCI_CS_URL: https://api.distributed-ci.io/`;
}

interface AuthentificationFileModalProps {
  feeder: IFeeder;
  type?: "sh" | "yaml";
  className?: string;
}

export function AuthentificationFileModal({
  feeder,
  type = "sh",
  className = "",
}: AuthentificationFileModalProps) {
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const api_secret = showPassword
    ? feeder.api_secret
    : "****************************************************************";

  useEffect(() => {
    if (copied) {
      const threeSeconds = 3 * 1000;
      const copiedTimeout = setTimeout(() => setCopied(false), threeSeconds);
      return () => {
        clearTimeout(copiedTimeout);
      };
    }
  }, [copied]);

  return (
    <>
      <Modal
        id="dci-credential-modal"
        aria-label="DCI credential modal"
        isOpen={show}
        onClose={() => setShow(false)}
        variant="large"
      >
        <ModalHeader title={`DCI credentials for ${feeder.name}`} />
        <ModalBody>
          <CodeBlock>
            <CodeBlockCode>
              {getContent(feeder.id, api_secret, type)}
            </CodeBlockCode>
          </CodeBlock>
        </ModalBody>
        <ModalFooter>
          <Button
            key="cancel"
            variant="secondary"
            onClick={() => setShow(false)}
          >
            close
          </Button>
          <Button
            variant="secondary"
            key="showPassword"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"} API secret
          </Button>
          <Button
            key="copy"
            onClick={(event) => {
              const content = getContent(feeder.id, feeder.api_secret, type);
              copyToClipboard(event, content);
              setCopied(true);
            }}
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </Button>
        </ModalFooter>
      </Modal>
      <Button
        variant="secondary"
        onClick={() => setShow(true)}
        className={className}
      >
        {type === "sh" ? "dcirc.sh" : "credentials.yaml"}
      </Button>
    </>
  );
}
