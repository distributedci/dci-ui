import {
  DatePicker,
  Flex,
  FlexItem,
  FormSelect,
  FormSelectOption,
} from "@patternfly/react-core";
import { RangeOptionValue } from "types";
import { getRangeDates } from "services/date";
import { useEffect, useState } from "react";

const labels: { [k in RangeOptionValue]: string } = {
  previousWeek: "Previous week",
  previousMonth: "Previous month",
  currentWeek: "Current week",
  previousQuarter: "Previous quarter",
  lastMonth: "Last month",
  lastYear: "Last year",
  yesterday: "Yesterday",
  today: "Today",
  currentMonth: "Current month",
  currentQuarter: "Current quarter",
  currentYear: "Year to date",
  last7Days: "Last 7 days",
  last30Days: "Last 30 days",
  last90Days: "Last 90 days",
  last365Days: "Last 365 days",
  custom: "Custom period",
};

export default function RangeSelect({
  now,
  range,
  ranges = Object.keys(labels) as Array<keyof typeof labels>,
  after,
  before,
  onChange,
}: {
  now?: string;
  ranges?: RangeOptionValue[];
  range: RangeOptionValue | null;
  after: string | null;
  before: string | null;
  onChange: (range: RangeOptionValue, after: string, before: string) => void;
}) {
  const defaultRangeValue: RangeOptionValue = range || ranges[0] || "last7Days";
  const [innerRange, setInnerRange] =
    useState<RangeOptionValue>(defaultRangeValue);
  const dates = getRangeDates(innerRange, now);
  const [innerAfter, setInnerAfter] = useState(after || dates.after);
  const [innerBefore, setInnerBefore] = useState(before || dates.before);
  const shouldDisplayDatePickers = innerRange === "custom";

  useEffect(() => {
    if (innerRange === "custom") {
      onChange(innerRange, innerAfter, innerBefore);
    } else {
      onChange(innerRange, dates.after, dates.before);
    }
  }, [innerRange]);

  useEffect(() => {
    if (innerRange === "custom") {
      onChange(innerRange, innerAfter, innerBefore);
    }
  }, [innerAfter, innerBefore]);

  return (
    <Flex columnGap={{ default: "columnGapXs" }}>
      <FlexItem>
        <FormSelect
          id="select-range-option"
          value={innerRange}
          onChange={(event, newRange) => {
            setInnerRange(newRange as RangeOptionValue);
          }}
          style={{ width: 150 }}
        >
          {ranges.map((range, index) => (
            <FormSelectOption key={index} value={range} label={labels[range]} />
          ))}
        </FormSelect>
      </FlexItem>
      {shouldDisplayDatePickers && (
        <>
          <FlexItem>
            <DatePicker
              value={innerAfter}
              placeholder="After"
              aria-label="After input date picker"
              buttonAriaLabel="Toggle after date picker"
              appendTo={() => document.body}
              onChange={(e, newAfterDate) => setInnerAfter(newAfterDate)}
            />
          </FlexItem>
          <FlexItem>
            <DatePicker
              value={innerBefore}
              aria-label="Before input date picker"
              buttonAriaLabel="Toggle before date picker"
              placeholder="Before"
              appendTo={() => document.body}
              onChange={(e, newBeforeDate) => setInnerBefore(newBeforeDate)}
            />
          </FlexItem>
        </>
      )}
    </Flex>
  );
}
