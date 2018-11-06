import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  Button,
  KebabToggle,
  Dropdown,
  DropdownItem,
  DropdownPosition
} from "@patternfly/react-core";
import { Labels } from "../ui";
import { formatDate, duration } from "../services/date";
import { isEmpty, orderBy } from "lodash";
import jobsActions from "./jobsActions";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  StopCircleIcon,
  PauseCircleIcon,
  UsersIcon,
  ServerIcon,
  CubesIcon,
  WarningTriangleIcon
} from "@patternfly/react-icons";
import {
  global_danger_color_100,
  global_success_color_100,
  global_active_color_100,
  global_warning_color_100,
  global_Color_light_100
} from "@patternfly/react-tokens";

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
        <PauseCircleIcon
          size="lg"
          style={{ color: global_active_color_100.value }}
        />
      );
  }
}

const TextRed = styled.span`
  color: ${global_danger_color_100.value};
`;

const RegressionWarningSpan = styled(TextRed)`
  padding: 1em;
`;

const RegressionWarning = ({ regressions }) => (
  <RegressionWarningSpan>
    <span>( </span>
    <WarningTriangleIcon
      color={global_danger_color_100.value}
      className="pf-u-mr-xs"
    />
    <span>
      {regressions} regression
      {regressions > 1 ? "s" : ""} )
    </span>
  </RegressionWarningSpan>
);

function getRemoteciInfo(job) {
  if (job.rconfiguration && job.rconfiguration.name) {
    return `${job.remoteci.name} (${job.rconfiguration.name})`;
  }
  return `${job.remoteci.name}`;
}

export class KebabDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = event => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isOpen } = this.state;
    const { children, ...props } = this.props;
    return (
      <Dropdown
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        toggle={<KebabToggle onToggle={this.onToggle} />}
        isOpen={isOpen}
        {...props}
      >
        {children}
      </Dropdown>
    );
  }
}

export class JobSummary extends Component {
  render() {
    const { enhancedJob: job, deleteJob, currentUser, history } = this.props;
    if (typeof job.id === "undefined") return null;
    const status = job.status;
    return (
      <Job status={status} className="pf-c-data-list__item">
        <div className="pf-c-data-list__check">{getIcon(status)}</div>
        <div className="pf-c-data-list__cell pf-m-flex-2">
          <b>{job.topic.name}</b>
          {isEmpty(job.team) ? null : (
            <p>
              <UsersIcon />
              {job.team.name}
            </p>
          )}
          <p>
            <ServerIcon />
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
                    {test.regressions ? (
                      <RegressionWarning regressions={test.regressions} />
                    ) : null}
                  </small>
                </JobTest>
              )
            )}
          </JobTests>
        </div>
        <div className="pf-c-data-list__cell">
          <Button onClick={() => history.push(`/jobs/${job.id}/jobStates`)}>
            See details
          </Button>
        </div>
        <div className="pf-c-data-list__action">
          {currentUser.hasAdminRole ? (
            <KebabDropdown position={DropdownPosition.right}>
              <DropdownItem component="button" onClick={() => deleteJob(job)}>
                <TextRed>
                  <WarningTriangleIcon
                    color={global_danger_color_100.value}
                    className="pf-u-mr-xs"
                  />
                  delete job
                </TextRed>
              </DropdownItem>
            </KebabDropdown>
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
