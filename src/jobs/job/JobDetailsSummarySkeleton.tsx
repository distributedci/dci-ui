import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";

import { BlinkLogo } from "ui";

export default function JobDetailsSummarySkeleton() {
  return (
    <div>
      <PageSection
        variant={PageSectionVariants.light}
        style={{
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <EmptyState>
          <EmptyStateHeader icon={<EmptyStateIcon icon={BlinkLogo} />} />
        </EmptyState>
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        style={{
          minHeight: "136px",
          margin: "0.5rem 0",
        }}
      ></PageSection>
    </div>
  );
}
