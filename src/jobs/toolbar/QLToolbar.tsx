import {
  ToolbarItem,
  Button,
  ButtonVariant,
  ToolbarGroup,
  Modal,
  ModalVariant,
  Text,
  TextVariants,
  TextContent,
  CodeBlock,
} from "@patternfly/react-core";
import { QuestionCircleIcon } from "@patternfly/react-icons";
import { useState } from "react";
import JobSearchAutoComplete from "./DSL/JobSearchAutoComplete";

export default function QLToolbar({
  query,
  onSearch,
  onClear,
  showToolbarItem = true,
}: {
  query: string | null;
  onSearch: (search: string | null) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
}) {
  const [showHelperModal, setShowHelperModal] = useState(false);
  return (
    <>
      <Modal
        id="advanced-search-modal"
        aria-label="Advanced search modal"
        variant={ModalVariant.medium}
        title="Advanced search"
        isOpen={showHelperModal}
        onClose={() => setShowHelperModal(false)}
      >
        <TextContent>
          <Text component={TextVariants.p}>
            The advanced search allows you to build structured queries using the
            DCI DSL to search for jobs. You can specify criteria that cannot be
            defined in the basic search.
          </Text>
          <Text component={TextVariants.h3}>Constructing queries</Text>
          <Text component={TextVariants.h4}>Example 1</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              foo
            </span>
          </Text>
          <CodeBlock>name=foo</CodeBlock>
          <Text component={TextVariants.h4}>Example 2</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              bar
            </span>
            and status
            <span className="pf-v5-u-background-color-success pf-v5-u-px-xs pf-v5-u-mx-xs">
              success
            </span>
          </Text>
          <CodeBlock>name=bar and status=success</CodeBlock>
          <Text component={TextVariants.h4}>Example 3</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              baz
            </span>
            and status
            <span className="pf-v5-u-background-color-danger pf-v5-u-px-xs pf-v5-u-mx-xs">
              failure
            </span>
            or
            <span className="pf-v5-u-background-color-danger pf-v5-u-px-xs pf-v5-u-mx-xs">
              error
            </span>
          </Text>
          <CodeBlock>name=baz and (status=failure or status=error)</CodeBlock>
        </TextContent>
      </Modal>
      <ToolbarItem widths={{ default: "calc(100% - 1000px)" }}>
        <JobSearchAutoComplete />
      </ToolbarItem>
      <ToolbarGroup variant="icon-button-group">
        <ToolbarItem>
          <Button variant="secondary" type="button">
            Search
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            variant={ButtonVariant.plain}
            aria-label="refresh"
            type="button"
            onClick={() => setShowHelperModal(!showHelperModal)}
          >
            <QuestionCircleIcon />
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
    </>
  );
}
