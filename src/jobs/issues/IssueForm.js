import React, { Component } from "react";
import FormModal from "../../FormModal";
import { Button } from "patternfly-react";
import Formsy from "formsy-react";
import { Input } from "../../form";

export default class IssueForm extends Component {
  constructor(props) {
    super(props);
    const initialIssue = { url: "" };
    this.state = {
      canSubmit: false,
      show: false,
      issue: {
        ...initialIssue,
        ...this.props.issue
      }
    };
  }

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
    const { title, okButton, submit, showModalButton } = this.props;
    return (
      <React.Fragment>
        <FormModal
          title={title}
          okButton={okButton}
          formRef="issue-form"
          canSubmit={this.state.canSubmit}
          show={this.state.show}
          close={this.closeModal}
        >
          <Formsy
            id="issue-form"
            onValidSubmit={issue => {
              this.closeModal();
              submit(issue);
            }}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
          >
            <Input
              id="issue-form__url"
              label="Url"
              name="url"
              value={this.state.issue.url}
              validations="isUrl"
              validationError="This is not a valid url"
              required
            />
          </Formsy>
        </FormModal>
        <Button bsStyle="primary" onClick={this.showModal}>
          {showModalButton}
        </Button>
      </React.Fragment>
    );
  }
}
