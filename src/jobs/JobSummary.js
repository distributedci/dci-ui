import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Colors, Labels } from "../ui";
import { formatDate, duration } from "../services/date";
import { isEmpty } from "lodash";

function getBackground(status, backgroundColor = Colors.white) {
  switch (status) {
    case "success":
      return `linear-gradient(to right,${Colors.green400} 0,${
        Colors.green400
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "failure":
    case "error":
      return `linear-gradient(to right,${Colors.red} 0,${
        Colors.red
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    case "killed":
      return `linear-gradient(to right,${Colors.orange400} 0,${
        Colors.orange400
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
    default:
      return `linear-gradient(to right,${Colors.blue400} 0,${
        Colors.blue400
      } 5px,${backgroundColor} 5px,${backgroundColor} 100%) no-repeat`;
  }
}

const Job = styled.div`
  width: 100%;
  box-shadow: 0 1px 1px rgba(3, 3, 3, 0.175);
  background: ${props => getBackground(props.status)};
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14),
    0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (min-width: 720px) {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: 75px;
  }

  span {
    display: inline-block;
    margin: 0;
  }
`;

const JobClickable = styled(Job)`
  cursor: pointer;
  &:hover {
    background: ${props => getBackground(props.status, Colors.black200)};
  }
`;

const JobInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;

  @media only screen and (min-width: 720px) {
    width: 288px;
    padding: 1em;
  }
`;

const JobIcon = styled.div`
  width: 40px;
  text-align: center;
  margin-right: 1em;
`;

const JobTests = styled.div`
  padding: 1em;
  padding-top: 0;
  display: none;

  @media only screen and (min-width: 480px) {
    display: flex;
    flex-direction: column;
  }

  @media only screen and (min-width: 720px) {
    padding: 1em;
  }
`;

const JobNames = styled.div`
  display: flex;
  flex-direction: column;
`;

const JobComponents = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  padding-top: 0;

  @media only screen and (min-width: 720px) {
    width: 240px;
    margin-right: 1em;
    padding: 1em;
  }
`;

const JobExtraInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  padding-top: 0;

  @media only screen and (min-width: 720px) {
    width: 180px;
    margin-left: auto;
    padding: 1em;
  }
`;

function getIcon(job) {
  switch (job.status) {
    case "success":
      return (
        <i
          className="fa fa-fw fa-2x fa-check-circle"
          style={{ color: Colors.green400 }}
        />
      );
    case "failure":
    case "error":
      return (
        <i
          className="fa fa-fw fa-2x fa-exclamation-circle"
          style={{ color: Colors.red }}
        />
      );
    case "killed":
      return (
        <i
          className="fa fa-fw fa-2x fa-stop-circle"
          style={{ color: Colors.orange400 }}
        />
      );
    default:
      return (
        <i
          className="fa fa-fw fa-2x fa-pause-circle"
          style={{ color: Colors.blue400 }}
        />
      );
  }
}

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
      history,
      clickable = true,
      seeDetails = false
    } = this.props;
    if (typeof job.id === "undefined") return null;
    const Container = clickable ? JobClickable : Job;
    return (
      <Container
        status={job.status}
        onClick={() => history.push(`/jobs/${job.id}/jobStates`)}
      >
        <JobInfo>
          <JobIcon>{getIcon(job)}</JobIcon>
          <JobNames>
            <span>
              <b>{job.topic.name}</b>
            </span>
            {isEmpty(job.team) ? null : (
              <span>
                <i className="fa fa-fw fa-users mr-1" />
                {job.team.name}
              </span>
            )}
            <span>
              <i className="fa fa-fw fa-server mr-1" />
              {getRemoteciInfo(job)}
            </span>
            <span>
              {job.metas.map((meta, i) => (
                <span key={i} className="label label-primary mr-1">
                  {meta.name}
                </span>
              ))}
            </span>
          </JobNames>
        </JobInfo>
        {seeDetails ? (
          <JobComponents>
            <b>Components:</b>
            {job.components.map(component => (
              <span key={component.id}>{component.name}</span>
            ))}
          </JobComponents>
        ) : null}
        <JobTests>
          {seeDetails && !isEmpty(job.results) ? <b>Tests:</b> : null}
          {job.results.map(test => (
            <div key={test.id}>
              <span className="label label-success mr-1">{test.success}</span>
              <span className="label label-warning mr-1">{test.skips}</span>
              <span className="label label-danger mr-1">
                {test.errors + test.failures}
              </span>
              {test.regressions ? (
                <Labels.Regression>{test.regressions}</Labels.Regression>
              ) : null}
              <span>{test.name}</span>
            </div>
          ))}
        </JobTests>
        <JobExtraInfo>
          <time dateTime={job.created_at} title={job.created_at}>
            <i className="fa fa-fw fa-calendar mr-1" />
            {job.datetime}
          </time>
          {job.status !== "new" && job.status !== "running" ? (
            <span title={`From ${job.created_at} to ${job.updated_at}`}>
              <i className="fa fa-fw fa-clock-o mr-1" />
              Ran for {job.duration}
            </span>
          ) : null}
        </JobExtraInfo>
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { job } = ownProps;
  return {
    enhancedJob: {
      ...job,
      datetime: formatDate(job.created_at, state.currentUser.timezone),
      duration: duration(job.created_at, job.updated_at)
    }
  };
}
export default connect(mapStateToProps)(JobSummary);
