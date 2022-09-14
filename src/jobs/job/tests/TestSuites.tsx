import { Title } from "@patternfly/react-core";
import { global_Color_100 } from "@patternfly/react-tokens";
import { ITestSuite } from "types";
import TestCases from "./TestCases";

interface TestsCasesProps {
  testsuites: ITestSuite[];
}

export default function TestSuites({ testsuites }: TestsCasesProps) {
  const showTitle = testsuites.length > 1;
  return (
    <div>
      {testsuites.map((testsuite, i) => (
        <div className="mt-lg mb-lg">
          {showTitle ? (
            <Title
              headingLevel="h4"
              size="xl"
              style={{ color: global_Color_100.value, marginBottom: "1em" }}
            >
              {testsuite.name || `test suite ${i + 1}`}
            </Title>
          ) : null}
          <TestCases key={i} testcases={testsuite.testcases} />
        </div>
      ))}
    </div>
  );
}
