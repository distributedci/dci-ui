import React, { Component } from "react";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import Formsy from "formsy-react";
import { Button, Card, CardBody } from "@patternfly/react-core";
import { Select } from "../form";
import { unsubscribeFromARemoteci } from "../currentUser/currentUserActions";

export class UnsubscribeForm extends Component {
  state = {
    canSubmit: false
  };

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  render() {
    const { remotecis, unsubscribeFromARemoteci } = this.props;
    const { canSubmit } = this.state;
    const remoteciIds = remotecis.reduce((accumulator, remoteci) => {
      accumulator[remoteci.id] = remoteci;
      return accumulator;
    }, {});
    return (
      <Card>
        <CardBody>
          <Formsy
            id="unsubscription-form"
            className="pf-c-form"
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={remoteci =>
              unsubscribeFromARemoteci(remoteciIds[remoteci.id])
            }
          >
            <Select
              id="unsubscription-form__unsubscribeSelect"
              label="Subscribed RemoteCI"
              name="id"
              value={isEmpty(remotecis) ? null : remotecis[0].id}
              options={remotecis}
              required
            />
            <Button
              id="unsubscription-form__submitButton"
              type="submit"
              disabled={!canSubmit}
            >
              Unsubscribe
            </Button>
          </Formsy>
        </CardBody>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    unsubscribeFromARemoteci: remoteci =>
      dispatch(unsubscribeFromARemoteci(remoteci))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(UnsubscribeForm);
