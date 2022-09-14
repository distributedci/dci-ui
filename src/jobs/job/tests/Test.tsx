import { Button, Label } from "@patternfly/react-core";
import { useCallback, useState } from "react";
import { IFile, ITest, ITestSuite } from "types";
import { isEmpty } from "lodash";
import { humanizeDuration } from "services/date";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from "@patternfly/react-icons";
import { getJunit } from "./testsActions";
import TestSuites from "./TestSuites";
import {
  AccordionItem,
  AccordionContent,
  AccordionToggle,
} from "@patternfly/react-core";

interface TestProps {
  test: ITest;
}

export default function Test({ test }: TestProps) {
  const [isLoadingTestsCases, setIsLoadingTestsCases] = useState(false);
  const [seeDetails, setSeeDetails] = useState(false);
  const [testsuites, setTestsuites] = useState<ITestSuite[]>([]);

  const loadTestCases = useCallback(() => {
    if (isEmpty(testsuites)) {
      setIsLoadingTestsCases(true);
      const file = { id: test.file_id } as IFile;
      getJunit(file)
        .then((r) => {
          setTestsuites(r.data.testsuites);
        })
        .finally(() => {
          setIsLoadingTestsCases(false);
        });
    }
  }, [test.file_id, testsuites]);

  return (
    <div>
      <AccordionItem>
        <AccordionToggle
          id={test.name}
          onClick={() => {
            setSeeDetails(!seeDetails);
            loadTestCases();
          }}
          isExpanded={seeDetails}
        >
          <div>
            <span className="mr-lg">
              {test.name || "Test"} ({humanizeDuration(test.time)})
            </span>
            <Label color="blue" className="mr-xs">
              {test.total} tests
            </Label>
            {test.successfixes ? (
              <Label icon={<CheckCircleIcon />} color="green" className="mr-xs">
                {test.successfixes} fixes
              </Label>
            ) : null}
            {test.success ? (
              <Label icon={<CheckCircleIcon />} color="green" className="mr-xs">
                {test.success} success
              </Label>
            ) : null}
            {test.skips ? (
              <Label
                icon={<ExclamationTriangleIcon />}
                color="orange"
                className="mr-xs"
              >
                {test.skips} skipped
              </Label>
            ) : null}
            {test.errors ? (
              <Label
                icon={<ExclamationCircleIcon />}
                color="red"
                className="mr-xs"
              >
                {test.errors} errors
              </Label>
            ) : null}
            {test.failures ? (
              <Label
                icon={<ExclamationCircleIcon />}
                color="red"
                className="mr-xs"
              >
                {test.failures} failures
              </Label>
            ) : null}
            {test.regressions ? (
              <Label icon={<ExclamationCircleIcon />} color="red">
                {test.regressions} regressions
              </Label>
            ) : null}
          </div>
        </AccordionToggle>
        <AccordionContent id="def-list-expand1" isHidden={!seeDetails}>
          {isLoadingTestsCases ? (
            <span>Loading...</span>
          ) : isEmpty(testsuites) ? (
            <div>There are no test cases for this test</div>
          ) : (
            <TestSuites testsuites={testsuites} />
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
