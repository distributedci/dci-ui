import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button, DropdownItem, DropdownPosition } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  StopCircleIcon,
  InProgressIcon,
  UsersIcon,
  ServerIcon,
  CubesIcon,
  ClockIcon,
  CalendarAltIcon,
  WarningTriangleIcon,
  ThumbsUpIcon
} from "@patternfly/react-icons";
import {
  global_danger_color_100,
  global_success_color_100,
  global_active_color_100,
  global_warning_color_100,
  global_Color_light_100
} from "@patternfly/react-tokens";
import { Labels, KebabDropdown } from "../ui";
import { formatDate, duration } from "../services/date";
import { isEmpty, orderBy } from "lodash";
import jobsActions from "./jobsActions";

function getBackground(status, backgroundColor = global_Color_light_100.value) {
  switch (status) {
    case "success":
      return `linear-gradient(to right,${global_success_color_100.value} 0,${
        global_success_color_100.value
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "failure":
    case "error":
      return `linear-gradient(to right,${global_danger_color_100.value} 0,${
        global_danger_color_100.value
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "killed":
      return `linear-gradient(to right,${global_warning_color_100.value} 0,${
        global_warning_color_100.value
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    default:
      return `linear-gradient(to right,${global_active_color_100.value} 0,${
        global_active_color_100.value
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
  }
}

const Job = styled.li`
  align-items: center;
  background: ${props => getBackground(props.status)};
`;

const JobTests = styled.div`
  display: flex;
  flex-direction: column;
`;

const JobTest = styled.div`
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }
`;

function getIcon(status) {
  switch (status) {
    case "success":
      return (
        <CheckCircleIcon
          size="lg"
          style={{ color: global_success_color_100.value }}
        />
      );
    case "failure":
    case "error":
      return (
        <ExclamationCircleIcon
          size="lg"
          style={{ color: global_danger_color_100.value }}
        />
      );
    case "killed":
      return (
        <StopCircleIcon
          size="lg"
          style={{ color: global_warning_color_100.value }}
        />
      );
    default:
      return (
        <InProgressIcon
          size="lg"
          style={{ color: global_active_color_100.value }}
        />
      );
  }
}

const TextRed = styled.span`
  color: ${global_danger_color_100.value};
`;

const TextGreen = styled.span`
  color: ${global_success_color_100.value};
`;

const Regressions = ({ regressions }) => (
  <TextRed className="pf-u-ml-md">
    <WarningTriangleIcon
      color={global_danger_color_100.value}
      className="pf-u-mr-xs"
    />
    <span>{`${regressions} regression${regressions > 1 ? "s" : ""}`}</span>
  </TextRed>
);

const Successfixes = ({ successfixes }) => (
  <TextGreen className="pf-u-ml-md">
    <ThumbsUpIcon
      color={global_success_color_100.value}
      className="pf-u-mr-xs"
    />
    <span>{`${successfixes} fix${successfixes > 1 ? "es" : ""}`}</span>
  </TextGreen>
);

function getRemoteciInfo(job) {
  if (job.rconfiguration && job.rconfiguration.name) {
    return `${job.remoteci.name} (${job.rconfiguration.name})`;
  }
  return `${job.remoteci.name}`;
}

export class JobSummary extends Component {
  render() {
    const {
      enhancedJob: job,
      deleteJob,
      currentUser,
      history,
      seeDetailsButton
    } = this.props;
    if (typeof job.id === "undefined") return null;
    const status = job.status;
    return (
      <Job status={status} className="pf-c-data-list__item">
        <div className="pf-c-data-list__check">{getIcon(status)}</div>
        <div className="pf-c-data-list__cell pf-m-flex-2">
          <b>{job.topic.name}</b>
          {isEmpty(job.team) ? null : (
            <p>
              <UsersIcon className="pf-u-mr-xs" />
              {job.team.name}
            </p>
          )}
          <p>
            <ServerIcon className="pf-u-mr-xs" />
            {getRemoteciInfo(job)}
          </p>
        </div>
        <div className="pf-c-data-list__cell pf-m-flex-4">
          <CubesIcon />
          {job.components.map(component => (
            <p key={component.id}>
              <small>{component.name}</small>
            </p>
          ))}
        </div>
        <div className="pf-c-data-list__cell pf-m-flex-4">
          <JobTests key={`${job.id}.tests`}>
            {orderBy(job.results, [test => test.name.toLowerCase()]).map(
              test => (
                <JobTest key={test.id}>
                  <Labels.Success
                    title={`${test.success} tests in success`}
                    className="pf-u-mr-xs"
                  >
                    {test.success}
                  </Labels.Success>
                  <Labels.Warning
                    title={`${test.skips} skipped tests`}
                    className="pf-u-mr-xs"
                  >
                    {test.skips}
                  </Labels.Warning>
                  <Labels.Error
                    title={`${test.errors +
                      test.failures} errors and failures tests`}
                    className="pf-u-mr-xs"
                  >
                    {test.errors + test.failures}
                  </Labels.Error>
                  <small>
                    {test.name}
                    {test.successfixes ? (
                      <Successfixes successfixes={test.successfixes} />
                    ) : null}
                    {test.regressions ? (
                      <Regressions regressions={test.regressions} />
                    ) : null}
                  </small>
                </JobTest>
              )
            )}
          </JobTests>
        </div>
        <div className="pf-c-data-list__cell pf-m-flex-2">
          <p>
            <small>
              <CalendarAltIcon className="pf-u-mr-xs" />
              {job.datetime}
            </small>
          </p>
          <p>
            <small>
              {job.status !== "new" && job.status !== "running" ? (
                <span title={`From ${job.created_at} to ${job.updated_at}`}>
                  <ClockIcon className="pf-u-mr-xs" />
                  Ran for {job.duration}
                </span>
              ) : null}
            </small>
          </p>
        </div>
        {seeDetailsButton && (
          <div className="pf-c-data-list__cell">
            <Button onClick={() => history.push(`/jobs/${job.id}/jobStates`)}>
              See details
            </Button>
          </div>
        )}
        <div className="pf-c-data-list__action">
          {currentUser.hasAdminRole ? (
            <KebabDropdown
              position={DropdownPosition.right}
              items={[
                <DropdownItem component="button" onClick={() => deleteJob(job)}>
                  <TextRed>
                    <WarningTriangleIcon
                      color={global_danger_color_100.value}
                      className="pf-u-mr-xs"
                    />
                    delete job
                  </TextRed>
                </DropdownItem>
              ]}
            />
          ) : null}
        </div>
      </Job>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { job } = ownProps;
  return {
    currentUser: state.currentUser,
    enhancedJob: {
      ...job,
      datetime: formatDate(job.created_at, state.currentUser.timezone),
      duration: duration(job.created_at, job.updated_at)
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteJob: job => {
      dispatch(jobsActions.delete(job));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobSummary);
