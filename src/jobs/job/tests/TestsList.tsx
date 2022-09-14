import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import Test from "./Test";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  PageSection,
  PageSectionVariants,
  Title,
} from "@patternfly/react-core";
import { ITest } from "types";

interface TestsListProps {
  tests: ITest[];
}

export default function TestsList({ tests }: TestsListProps) {
  if (isEmpty(tests))
    return (
      <EmptyState title="No tests" info="There is no tests for this job" />
    );
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h2" size="2xl" className="mb-md">
        Tests
      </Title>

      <Accordion isBordered>
        {tests.map((test, i) => (
          <Test key={i} test={test} />
        ))}
      </Accordion>
    </PageSection>
  );
}
