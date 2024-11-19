import {
  Banner,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  SearchInput,
  Content,
  ContentVariants,
} from "@patternfly/react-core";
import { IGetJunitTestSuites, ITestCaseActionType } from "types";
import { Table, Thead, Tr, Th } from "@patternfly/react-table";
import TestCase, { TestCaseState } from "./TestCase";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  t_global_border_color_status_danger_default,
  t_global_border_color_status_info_default,
  t_global_border_color_status_success_default,
  t_global_border_color_status_warning_default,
  t_global_color_nonstatus_blue_default,
  t_global_color_nonstatus_green_default,
  t_global_color_nonstatus_orange_default,
  t_global_color_nonstatus_red_default,
  t_global_color_status_danger_default,
  t_global_color_status_info_default,
  t_global_color_status_success_default,
  t_global_color_status_warning_default,
} from "@patternfly/react-tokens";

interface TestsCasesProps {
  junit: IGetJunitTestSuites;
}

const testscaseActions: ITestCaseActionType[] = [
  "error",
  "failure",
  "skipped",
  "success",
];

type Color = "blue" | "green" | "orange" | "red";

function SummaryItem({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: Color;
}) {
  const colors = {
    blue: {
      backgroundColor: t_global_color_nonstatus_blue_default.value,
      borderColor: t_global_border_color_status_info_default.value,
      color: t_global_color_status_info_default.value,
    },
    green: {
      backgroundColor: t_global_color_nonstatus_green_default.value,
      borderColor: t_global_border_color_status_success_default.value,
      color: t_global_color_status_success_default.value,
    },
    red: {
      backgroundColor: t_global_color_nonstatus_red_default.value,
      borderColor: t_global_border_color_status_danger_default.value,
      color: t_global_color_status_danger_default.value,
    },
    orange: {
      backgroundColor: t_global_color_nonstatus_orange_default.value,
      borderColor: t_global_border_color_status_warning_default.value,
      color: t_global_color_status_warning_default.value,
    },
  };
  return (
    <div
      className="text-center pf-v6-u-p-md"
      style={{
        ...colors[color],
        borderWidth: 1,
        borderStyle: "solid",
        width: 100,
      }}
    >
      <div>
        <span>{title}</span>
      </div>
      <div>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</span>
      </div>
    </div>
  );
}

export default function TestSuites({ junit }: TestsCasesProps) {
  const [searchParams] = useSearchParams();
  const testCaseParamName = "testcase";
  const testcaseToExpand = searchParams.get(testCaseParamName);
  const [search, setSearch] = useState("");
  return (
    <div>
      {junit.testsuites.map((testsuite, i) => (
        <div key={i}>
          <div>
            <Content component={ContentVariants.h3}>Summary</Content>
            {junit.previous_job !== null && (
              <Content component={ContentVariants.p}>
                This{" "}
                <Link to={`/jobs/${junit.job.id}/jobStates`}>
                  job ({junit.job.name})
                </Link>{" "}
                was compared with the{" "}
                <Link to={`/jobs/${junit.previous_job.id}/jobStates`}>
                  previous job ({junit.previous_job.name})
                </Link>
                .
              </Content>
            )}
          </div>
          <Flex
            columnGap={{ default: "columnGap2xl" }}
            className="pf-v6-u-my-md"
          >
            <FlexItem>
              <SummaryItem
                title={testsuite.tests > 1 ? "Tests" : "Test"}
                value={testsuite.tests}
                color="blue"
              />
            </FlexItem>
            <FlexItem>
              <SummaryItem
                title="Passed"
                value={testsuite.success}
                color="green"
              />
            </FlexItem>
            <FlexItem>
              <SummaryItem
                title="Failed"
                value={testsuite.failures}
                color="red"
              />
            </FlexItem>
            <FlexItem>
              <SummaryItem title="Error" value={testsuite.errors} color="red" />
            </FlexItem>
            <FlexItem>
              <SummaryItem
                title="Skipped"
                value={testsuite.skipped}
                color="orange"
              />
            </FlexItem>
          </Flex>
          <Content className="pf-v6-u-my-md" component={ContentVariants.h3}>
            {testsuite.name || `test suite ${i + 1}`}
          </Content>
          <Flex>
            <FlexItem>
              <SearchInput
                placeholder="Find test by name"
                value={search}
                onChange={(_event, value) => setSearch(value)}
                onClear={() => setSearch("")}
              />
            </FlexItem>
          </Flex>
          <div>
            {testsuite.properties.length > 0 && (
              <DescriptionList isHorizontal isFluid>
                {testsuite.properties.map((property, i) => (
                  <DescriptionListGroup key={i}>
                    <DescriptionListTerm>{property.name}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {property.value}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                ))}
              </DescriptionList>
            )}
            {testsuite.testcases.length === 0 ? (
              <Banner
                screenReaderText="No test case banner"
                color="blue"
                className="pf-v6-u-mt-sm"
              >
                <Flex spaceItems={{ default: "spaceItemsSm" }}>
                  <FlexItem>
                    <InfoCircleIcon />
                  </FlexItem>
                  <FlexItem>There is no test case in this test suite</FlexItem>
                </Flex>
              </Banner>
            ) : (
              <Table role="grid" aria-label="Testsuite table" variant="compact">
                <Thead>
                  <Tr role="row">
                    <Th modifier="fitContent"></Th>
                    <Th>Name</Th>
                    <Th
                      textCenter
                      modifier="fitContent"
                      info={{
                        popover: (
                          <div>
                            <Content component={ContentVariants.p}>
                              The result of a test case is compared with its
                              previous result in the previous test. A test case
                              can have 5 states.
                            </Content>
                            <Content component={ContentVariants.p}>
                              If state is empty, the test has the same state as
                              before
                            </Content>
                            <TestCaseState
                              state="REMOVED"
                              className="pf-v6-u-mb-xs"
                            />
                            <Content component={ContentVariants.p}>
                              The test was present in the previous job and it
                              was deleted in this job.
                            </Content>
                            <TestCaseState
                              state="ADDED"
                              className="pf-v6-u-mb-xs"
                            />
                            <Content component={ContentVariants.p}>
                              The test is not present in the previous job.
                            </Content>
                            <TestCaseState
                              state="RECOVERED"
                              className="pf-v6-u-mb-xs"
                            />
                            <Content component={ContentVariants.p}>
                              The test is successful now, congratulation
                            </Content>
                            <TestCaseState
                              state="REGRESSED"
                              className="pf-v6-u-mb-xs"
                            />
                            <Content component={ContentVariants.p}>
                              The test is no longer successful
                            </Content>
                          </div>
                        ),
                      }}
                    >
                      State
                    </Th>
                    <Th textCenter modifier="fitContent">
                      Action
                    </Th>
                    <Th textCenter modifier="fitContent">
                      Duration
                    </Th>
                    <Th modifier="fitContent">Class name</Th>
                    <Th>Type</Th>
                  </Tr>
                </Thead>
                {testsuite.testcases
                  .sort(
                    (tc1, tc2) =>
                      testscaseActions.indexOf(tc1.action) -
                      testscaseActions.indexOf(tc2.action),
                  )
                  .filter((tc) =>
                    tc.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((testcase, i) => (
                    <TestCase
                      key={i}
                      index={i}
                      testcase={testcase}
                      isExpanded={testcaseToExpand === testcase.name}
                      expand={(isExpanded) => {
                        if (isExpanded) {
                          searchParams.set(testCaseParamName, testcase.name);
                        }
                        window.history.replaceState(
                          {},
                          "",
                          `?${searchParams.toString()}`,
                        );
                      }}
                    />
                  ))}
              </Table>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
