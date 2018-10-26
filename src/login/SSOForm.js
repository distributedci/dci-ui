import React, { Component } from "react";
import {
  Button,
  ActionGroup,
  Toolbar,
  ToolbarGroup
} from "@patternfly/react-core";

export default class SSOForm extends Component {
  constructor(props) {
    super(props);
    this.state = { canSubmit: false };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { from } = this.props;
    return (
      <ActionGroup>
        <Toolbar>
          <ToolbarGroup>
            <Button
              variant="danger"
              onClick={() => {
                const redirectUri = `${window.location.origin}${from.pathname}`;
                window._sso.login({ redirectUri });
              }}
            >
              Red Hat SSO
            </Button>
          </ToolbarGroup>
        </Toolbar>
      </ActionGroup>
    );
  }
}
