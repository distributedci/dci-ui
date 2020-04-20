import React, { Component } from "react";
import { Labels } from "ui";
import { Button } from "@patternfly/react-core";

export default class TestHeader extends Component {
  render() {
    const { test, toggleDetails } = this.props;
    return (
      <div className="pf-c-data-list__item">
        <div className="pf-c-data-list__cell">
          {test.name || "Test"} (Duration: {test.time} msec)
        </div>
        <div className="pf-c-data-list__cell">
          <small>
            <Labels.Default className="mr-xs">
              {test.total} tests
            </Labels.Default>
            {test.successfixes ? (
              <Labels.Success className="mr-xs">
                {test.successfixes} fixes
              </Labels.Success>
            ) : null}
            {test.success ? (
              <Labels.Success className="mr-xs">
                {test.success} success
              </Labels.Success>
            ) : null}
            {test.skips ? (
              <Labels.Warning className="mr-xs">
                {test.skips} skipped
              </Labels.Warning>
            ) : null}
            {test.errors ? (
              <Labels.Error className="mr-xs">
                {test.errors} errors
              </Labels.Error>
            ) : null}
            {test.failures ? (
              <Labels.Failure className="mr-xs">
                {test.failures} failures
              </Labels.Failure>
            ) : null}
            {test.regressions ? (
              <Labels.Regression>
                {`${test.regressions} regression${
                  test.regressions > 1 ? "s" : ""
                }`}
              </Labels.Regression>
            ) : null}
          </small>
        </div>
        <div className="pf-c-data-list__cell text-right">
          <Button
            type="button"
            variant="tertiary"
            onClick={() => toggleDetails()}
          >
            See tests details
          </Button>
        </div>
      </div>
    );
  }
}
