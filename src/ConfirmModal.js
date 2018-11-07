import React, { Component } from "react";
import { Button, Modal } from "@patternfly/react-core";

export default class ConfirmModal extends Component {
  render() {
    const {
      title,
      close,
      onValidSubmit,
      children,
      okButton = "ok",
      cancelButton = "cancel",
      show = false
    } = this.props;
    return (
      <Modal
        title={title}
        isOpen={show}
        onClose={close}
        isLarge
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            className="btn-cancel"
            onClick={close}
          >
            {cancelButton}
          </Button>,
          <Button key="ok" variant="danger" onClick={onValidSubmit}>
            {okButton}
          </Button>
        ]}
      >
        {children}
      </Modal>
    );
  }
}
