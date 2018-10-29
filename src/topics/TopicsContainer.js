import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "../layout";
import productsActions from "../products/producstActions";
import topicsActions from "./topicsActions";
import { CopyButton, EmptyState, Labels } from "../ui";
import NewTopicButton from "./NewTopicButton";
import EditTopicButton from "./EditTopicButton";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getTopics } from "./topicsSelectors";

export class TopicsContainer extends Component {
  componentDidMount() {
    this.props.fetchTopics();
  }
  render() {
    const { topics, isFetching } = this.props;
    return (
      <Page
        title="Topics"
        loading={isFetching && isEmpty(topics)}
        empty={!isFetching && isEmpty(topics)}
        HeaderButton={<NewTopicButton />}
        EmptyComponent={
          <EmptyState
            title="There is no topics"
            info="Do you want to create one?"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th className="pf-u-text-align-center">ID</th>
              <th
                className="pf-u-text-align-center"
                title="This column indicates whether export control was performed on the topic"
              >
                Export control
              </th>
              <th>Name</th>
              <th>Next Topic</th>
              <th>Product</th>
              <th>Created</th>
              <th className="pf-u-text-align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map(topic => (
              <tr key={`${topic.id}.${topic.etag}`}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={topic.id} />
                </td>
                <th className="pf-u-text-align-center">
                  {topic.export_control ? (
                    <Labels.Success>yes</Labels.Success>
                  ) : (
                    <Labels.Warning>no</Labels.Warning>
                  )}
                </th>
                <td>{topic.name}</td>
                <td>{topic.next_topic ? topic.next_topic.name : null}</td>
                <td>{topic.product ? topic.product.name : null}</td>
                <td>{topic.from_now}</td>
                <td className="pf-u-text-align-center">
                  <EditTopicButton className="pf-u-mr-xl" topic={topic} />
                  <ConfirmDeleteButton
                    name="topic"
                    resource={topic}
                    whenConfirmed={topic => this.props.deleteTopic(topic)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    isFetching: state.topics.isFetching || state.products.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopics: () => {
      dispatch(topicsActions.all({ embed: "next_topic,product" }));
      dispatch(productsActions.all());
    },
    deleteTopic: topic => dispatch(topicsActions.delete(topic))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsContainer);
