import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import topicsActions from "topics/topicsActions";
import { getTopics } from "topics/topicsSelectors";
import { getTrends } from "./trendsActions";
import { Page } from "layout";
import TrendGraph from "./TrendGraph";
import { EmptyState } from "ui";
import { DateTime } from "luxon";
import {
  Card,
  CardBody,
  CardTitle,
  Gallery,
  GalleryItem,
  PageSection,
} from "@patternfly/react-core";

export class TrendsPage extends Component {
  state = {
    nbMonth: 6,
    topic: null,
    isFetching: true,
  };

  componentDidMount() {
    const { fetchTrends, fetchTopics } = this.props;
    Promise.all([fetchTopics(), fetchTrends()])
      .catch(() => undefined)
      .then(() => {
        this.setState({ isFetching: false });
      });
  }

  filterTrends = (trend, nbMonth) => {
    if (isEmpty(trend)) return [];
    return trend
      .sort((t1, t2) => t1[0] - t2[0])
      .filter(
        (d) =>
          DateTime.local().diff(DateTime.fromSeconds(d[0])).as("months") <
          nbMonth
      );
  };

  render() {
    const { trends, topics } = this.props;
    const { topic: selectedTopic, isFetching, nbMonth } = this.state;
    const xMin = DateTime.local().minus({ months: nbMonth }).toJSDate();
    const xMax = DateTime.local().toJSDate();
    return (
      <Page
        title="Trends"
        description="The number of jobs in success for all partners using DCI. Click on a topic to see more details"
        loading={isFetching && isEmpty(trends)}
        empty={!isFetching && isEmpty(trends)}
        EmptyComponent={
          <EmptyState
            title="There is no trends"
            info="Add some jobs to see trends"
          />
        }
      >
        <PageSection>
          {isEmpty(selectedTopic) ? (
            <Gallery hasGutter>
              {topics.map((topic) => {
                const filteredTrends = this.filterTrends(
                  trends[topic.id],
                  nbMonth
                );
                if (isEmpty(filteredTrends)) return null;
                return (
                  <GalleryItem key={topic.id}>
                    <Card
                      onClick={() => this.setState({ topic })}
                      title="Click to enlarge"
                      style={{ cursor: "pointer" }}
                    >
                      <CardTitle>{topic.name}</CardTitle>
                      <CardBody>
                        <TrendGraph
                          xMin={xMin}
                          xMax={xMax}
                          data={filteredTrends}
                        />
                      </CardBody>
                    </Card>
                  </GalleryItem>
                );
              })}
            </Gallery>
          ) : (
            <Card
              onClick={() => this.setState({ topic: null })}
              title="Click to hide"
              style={{ cursor: "pointer" }}
            >
              <CardTitle>
                {`Successful jobs per day for ${selectedTopic.name} during the last ${nbMonth} months`}
              </CardTitle>
              <CardBody>
                <TrendGraph
                  xMin={xMin}
                  xMax={xMax}
                  data={this.filterTrends(trends[selectedTopic.id], nbMonth)}
                />
              </CardBody>
            </Card>
          )}
        </PageSection>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    trends: state.trends,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTrends: () => dispatch(getTrends()),
    fetchTopics: () => dispatch(topicsActions.all()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrendsPage);
