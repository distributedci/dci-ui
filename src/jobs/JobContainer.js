import React, { Component } from "react";
import { Page } from "../layout";
import { connect } from "react-redux";
import { Nav, NavList, NavItem, NavVariants } from "@patternfly/react-core";
import FilesList from "./files/FilesList";
import IssuesList from "./issues/IssuesList";
import TestsList from "./tests/TestsList";
import JobStatesList from "./jobStates/JobStatesList";
import jobsActions from "./jobsActions";
import { getResults } from "./tests/testsActions";
import { getJobStatesWithFiles } from "./jobStates/jobStatesActions";
import { getIssues, createIssue, deleteIssue } from "./issues/issuesActions";
import JobSummary from "./JobSummary";

export class JobContainer extends Component {
  state = {
    job: {
      tests: [],
      jobstates: [],
      issues: [],
      files: []
    },
    isFetching: true,
    tab: "jobStates"
  };

  componentDidMount() {
    const { id, tab } = this.props.match.params;
    this.props
      .fetchJob(id)
      .then(response => {
        const job = response.data.job;
        const getResults = this.props.getResults(job);
        const getJobStates = this.props.getJobStates(job);
        const getIssues = this.props.getIssues(job);
        return Promise.all([getResults, getJobStates, getIssues]).then(
          values => {
            this.setState({
              job: {
                ...job,
                tests: values[0].data.results,
                jobstates: values[1].data.jobstates,
                issues: values[2].data.issues
              },
              tab
            });
          }
        );
      })
      .catch(error => console.log(error))
      .then(() => this.setState({ isFetching: false }));
  }

  createIssue = issue => {
    this.props.createIssue(this.state.job, issue).then(response => {
      const newIssue = response.data.issue;
      this.setState(prevState => {
        return {
          job: {
            ...prevState.job,
            issues: prevState.job.issues.reduce(
              (accumulator, issue) => {
                accumulator.push(issue);
                return accumulator;
              },
              [newIssue]
            )
          }
        };
      });
    });
  };

  deleteIssue = issue => {
    this.props.deleteIssue(this.state.job, issue).then(() =>
      this.setState(prevState => {
        return {
          job: {
            ...prevState.job,
            issues: prevState.job.issues.filter(i => i.id !== issue.id)
          }
        };
      })
    );
  };

  onNavSelect = result => {
    const tabs = { 0: "jobStates", 1: "tests", 2: "issues", 3: "files" };
    this.setState({ tab: tabs[result.itemId] });
  };

  render() {
    const { history } = this.props;
    const { job, isFetching, tab } = this.state;
    const tabsIndexes = {
      jobStates: { id: 0, name: "Logs" },
      tests: { id: 1, name: "Tests" },
      issues: { id: 2, name: "Issues" },
      files: { id: 3, name: "Files" }
    };
    const activeTab = tabsIndexes[tab];
    const activeId = activeTab.id;
    const topNav = (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavList variant={NavVariants.horizontal}>
          <NavItem itemId={0} isActive={activeId === 0}>
            <span>Logs</span>
          </NavItem>
          <NavItem itemId={1} isActive={activeId === 1}>
            <span>Tests</span>
          </NavItem>
          <NavItem itemId={2} isActive={activeId === 2}>
            <span>Issues</span>
          </NavItem>
          <NavItem itemId={3} isActive={activeId === 3}>
            <span>Files</span>
          </NavItem>
        </NavList>
      </Nav>
    );
    return (
      <Page title={activeTab.name} topNav={topNav} loading={isFetching}>
        <div className="pf-l-stack pf-m-gutter">
          <div className="pf-l-stack__item">
            <ul
              className="pf-c-data-list pf-u-box-shadow-md"
              role="list"
              aria-label="job detail"
            >
              <JobSummary job={job} history={history} />
            </ul>
          </div>
          <div className="pf-l-stack__item pf-m-main">
            {activeId === 0 && <JobStatesList jobstates={job.jobstates} />}
            {activeId === 1 && <TestsList tests={job.tests} />}
            {activeId === 2 && (
              <IssuesList
                issues={job.issues}
                createIssue={this.createIssue}
                deleteIssue={this.deleteIssue}
              />
            )}
            {activeId === 3 && <FilesList files={job.files} />}
          </div>
        </div>
      </Page>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJob: id =>
      dispatch(
        jobsActions.one(
          { id },
          {
            embed:
              "results,team,remoteci,components,metas,topic,rconfiguration,files"
          }
        )
      ),
    getResults: job => dispatch(getResults(job)),
    getJobStates: job => dispatch(getJobStatesWithFiles(job)),
    getIssues: job => dispatch(getIssues(job)),
    createIssue: (job, issue) => dispatch(createIssue(job, issue)),
    deleteIssue: (job, issue) => dispatch(deleteIssue(job, issue))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(JobContainer);
