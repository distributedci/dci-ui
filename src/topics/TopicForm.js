import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@patternfly/react-core";
import Formsy from "formsy-react";
import {
  Input,
  Select,
  TextAreaJSON,
  HiddenInput,
  Checkbox,
  FormModal,
} from "ui/form";
import { getProducts } from "products/productsSelectors";
import { getTopics } from "./topicsSelectors";
import { isEmpty } from "lodash";

export class TopicForm extends Component {
  state = {
    canSubmit: false,
    show: false,
    topic: {
      name: "",
      export_control: false,
      state: "active",
      ...this.props.topic,
    },
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    const {
      title,
      okButton,
      submit,
      topics,
      products,
      className,
      showModalButton,
      currentUser,
    } = this.props;
    const { canSubmit, show, topic } = this.state;
    return (
      <>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="topic-form"
          canSubmit={canSubmit}
          show={show}
          close={this.closeModal}
        >
          <Formsy
            id="topic-form"
            className="pf-c-form"
            onValidSubmit={(topic) => {
              this.closeModal();
              submit(topic);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <HiddenInput id="topic-form__etag" name="etag" value={topic.etag} />
            <Input
              id="topic-form__name"
              label="Name"
              name="name"
              value={topic.name}
              required
            />
            <Select
              id="topic-form__next_topic"
              label="Next topic"
              name="next_topic_id"
              options={[{ id: null, name: "" }, ...topics]}
              value={topic.next_topic_id}
            />
            {currentUser.isSuperAdmin ? (
              <>
                <Select
                  id="topic-form__state"
                  label="State"
                  name="state"
                  options={[
                    { id: "active", name: "active" },
                    { id: "inactive", name: "inactive" },
                    { id: "archived", name: "archived" },
                  ]}
                  value={topic.state}
                />
                <Checkbox
                  label="Export Control"
                  name="export_control"
                  value={topic.export_control}
                />
              </>
            ) : null}

            {isEmpty(products) ? null : (
              <Select
                id="topic-form__product_id"
                label="Product"
                name="product_id"
                options={products}
                value={topic.product_id || products[0].id}
                required
              />
            )}
            <TextAreaJSON
              id="topic-form__component_types"
              label="Component types"
              name="component_types"
              required
              validations="isJSON"
              validationError="Component types should be a valid JSON"
              value={topic.component_types || []}
            />
            <TextAreaJSON
              id="topic-form__data"
              label="Data"
              name="data"
              required
              validations="isJSON"
              validationError="Component data field should be a valid JSON"
              value={topic.data || {}}
            />
          </Formsy>
        </FormModal>
        <Button
          id="topics-screen__show-modal-button"
          variant="primary"
          className={className}
          onClick={this.showModal}
        >
          {showModalButton}
        </Button>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: getProducts(state),
    topics: getTopics(state),
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(TopicForm);
