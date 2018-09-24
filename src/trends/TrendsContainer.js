import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Row, Col, SplitButton, MenuItem } from "patternfly-react";
import topicsActions from "../topics/topicsActions";
import { getTopics } from "../topics/topicsSelectors";
import { getTrends } from "./trendsActions";
import { MainContentWithLoader } from "../layout";
import TrendGraph from "./TrendGraph";
import { EmptyState } from "../ui";

export class TrendsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: null
    };
  }

  componentDidMount() {
    this.props.fetchTrends();
  }

  render() {
    const { topics, trends } = this.props;
    const { topic } = this.state;
    return (
      <MainContentWithLoader loading={isEmpty(trends) || isEmpty(topics)}>
        <Row>
          <Col xs={12}>
            <SplitButton
              bsStyle="default"
              id="trends_topic_select"
              title={isEmpty(topic) ? "Select a topic" : topic.name}
              className="mb-3"
            >
              {topics.map(topic => (
                <MenuItem
                  key={topic.id}
                  onClick={() => this.setState({ topic: topic })}
                >
                  {topic.name}
                </MenuItem>
              ))}
            </SplitButton>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {isEmpty(topic) ? (
              <EmptyState
                title="Select a topic"
                info="Select a topic in the top left corner to see its trend."
                icon={<i className="fa fa-line-chart fa-3x fa-fw" />}
              />
            ) : (
              <TrendGraph trend={trends[topic.id]} topic={topic} />
            )}
          </Col>
        </Row>
      </MainContentWithLoader>
    );
  }
}

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    trends: state.trends
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTrends: () => {
      dispatch(topicsActions.all());
      dispatch(getTrends());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendsContainer);
