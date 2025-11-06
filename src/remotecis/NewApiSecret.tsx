import {
  Alert,
  ClipboardCopy,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import type { IRemoteciWithApiSecret } from "types";
import { useEffect, useState } from "react";
import copyToClipboard from "services/copyToClipboard";
import { ExternalLinkSquareAltIcon } from "@patternfly/react-icons";

interface NewApiSecretProps {
  remoteci: IRemoteciWithApiSecret;
}

export default function NewApiSecret({
  remoteci,
  ...props
}: NewApiSecretProps) {
  const [dcircDotSHCopied, setDcircDotSHCopied] = useState(false);
  const [credentialsDotYAMLCopied, setCredentialsDotYAMLCopied] =
    useState(false);

  const threeSeconds = 3 * 1000;
  useEffect(() => {
    if (dcircDotSHCopied) {
      const copiedTimeout = setTimeout(
        () => setDcircDotSHCopied(false),
        threeSeconds,
      );
      return () => {
        clearTimeout(copiedTimeout);
      };
    }
  }, [dcircDotSHCopied]);

  useEffect(() => {
    if (credentialsDotYAMLCopied) {
      const copiedTimeout = setTimeout(
        () => setCredentialsDotYAMLCopied(false),
        threeSeconds,
      );
      return () => {
        clearTimeout(copiedTimeout);
      };
    }
  }, [credentialsDotYAMLCopied]);

  const dcircDotSH = String.raw`  export DCI_CLIENT_ID='remoteci/${remoteci.id}'
  export DCI_API_SECRET='${remoteci.api_secret}'
  export DCI_CS_URL='https://api.distributed-ci.io/'`;

  const dcircDotSHWithoutSecret = String.raw` export DCI_CLIENT_ID='remoteci/${remoteci.id}'
 export DCI_API_SECRET='xxxxxxxxxxxxxxxxxxxxxxxxxx'
 export DCI_CS_URL='https://api.distributed-ci.io/'`;

  const credentialsDotYAML = String.raw`---
  DCI_CLIENT_ID: remoteci/${remoteci.id}
  DCI_API_SECRET: ${remoteci.api_secret}
  DCI_CS_URL: https://api.distributed-ci.io/`;

  const credentialsDotYAMLWithoutSecret = String.raw`---
  DCI_CLIENT_ID: remoteci/${remoteci.id}
  DCI_API_SECRET: xxxxxxxxxxxxxxxxxxxxxxxxxx
  DCI_CS_URL: https://api.distributed-ci.io/`;

  return (
    <Alert
      variant="info"
      title="Don't forget to copy your new API Secret"
      {...props}
    >
      <p>This API Secret won&apos;t be shown again for your security.</p>
      <br />
      <Flex direction={{ default: "column" }} rowGap={{ default: "rowGapMd" }}>
        <Flex flex={{ default: "flex_1" }}>
          <FlexItem>
            API Secret
            <ClipboardCopy
              copyAriaLabel="Copy API Secret"
              hoverTip="Copy"
              clickTip="Copied"
              isCode
              isReadOnly
            >
              {remoteci.api_secret}
            </ClipboardCopy>
          </FlexItem>
        </Flex>
        <Flex flex={{ default: "flex_1" }}>
          <FlexItem>
            dcirc.sh
            <CodeBlock
              actions={[
                <CodeBlockAction key="copy-dcirc-action">
                  <ClipboardCopyButton
                    id="copy-dcirc-button"
                    onClick={(e) => {
                      copyToClipboard(e, dcircDotSH);
                      setDcircDotSHCopied(true);
                    }}
                    exitDelay={dcircDotSHCopied ? 1500 : 600}
                    variant="plain"
                    onTooltipHidden={() => setDcircDotSHCopied(false)}
                  >
                    {dcircDotSHCopied ? "Copied!" : "Copy to clipboard"}
                  </ClipboardCopyButton>
                </CodeBlockAction>,
              ]}
            >
              <CodeBlockCode>{dcircDotSHWithoutSecret}</CodeBlockCode>
            </CodeBlock>
          </FlexItem>
        </Flex>
        <Flex flex={{ default: "flex_1" }}>
          <FlexItem>
            credentials.yaml
            <CodeBlock
              actions={[
                <CodeBlockAction key="copy-credentials-action">
                  <ClipboardCopyButton
                    id="copy-credentials-button"
                    onClick={(e) => {
                      copyToClipboard(e, credentialsDotYAML);
                      setCredentialsDotYAMLCopied(true);
                    }}
                    exitDelay={credentialsDotYAMLCopied ? 1500 : 600}
                    variant="plain"
                    onTooltipHidden={() => setCredentialsDotYAMLCopied(false)}
                  >
                    {credentialsDotYAMLCopied ? "Copied!" : "Copy to clipboard"}
                  </ClipboardCopyButton>
                </CodeBlockAction>,
              ]}
            >
              <CodeBlockCode>{credentialsDotYAMLWithoutSecret}</CodeBlockCode>
            </CodeBlock>
          </FlexItem>
        </Flex>
      </Flex>
      <br />
      <a
        href="https://docs.distributed-ci.io/general_concepts/#secure-communication-between-the-agent-and-the-control-server"
        target="_blank"
        rel="noopener noreferrer"
      >
        Documentation
        <ExternalLinkSquareAltIcon />
      </a>
      <br />
    </Alert>
  );
}
