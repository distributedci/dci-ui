import * as React from "react";
import { SearchIcon } from "@patternfly/react-icons";
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateFooter,
  type EmptyStateProps,
} from "@patternfly/react-core";

interface DCIEmptyStateProps {
  title: string;
  info?: React.ReactNode;
  icon?: EmptyStateProps["icon"];
  action?: React.ReactNode;
}

export default function DCIEmptyState({
  title,
  info = "Please contact a Distributed CI administrator",
  icon,
  action,
}: DCIEmptyStateProps) {
  return (
    <Bullseye>
      <EmptyState
        icon={icon ? icon : SearchIcon}
        titleText={title}
        headingLevel="h4"
      >
        <EmptyStateBody>{info}</EmptyStateBody>
        {action && (
          <EmptyStateFooter>
            <EmptyStateActions>{action}</EmptyStateActions>
          </EmptyStateFooter>
        )}
      </EmptyState>
    </Bullseye>
  );
}
