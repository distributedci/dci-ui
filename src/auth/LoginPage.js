import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Title } from "@patternfly/react-core";
import LoginForm from "./LoginForm";
import SSOForm from "./SSOForm";
import { getIdentity } from "currentUser/currentUserActions";
import { setBasicToken } from "services/localStorage";
import Logo from "logo.svg";
import { showError } from "alerts/alertsActions";

export class LoginPage extends Component {
  state = {
    seeSSOForm: true
  };

  submit = user => {
    const token = window.btoa(user.username.concat(":", user.password));
    setBasicToken(token);
    const { getIdentity, showError, history } = this.props;
    getIdentity()
      .then(() => history.push("/jobs"))
      .catch(error => {
        if (error.response && error.response.status) {
          showError("Invalid username or password");
        } else {
          showError(
            "Network error, check your connectivity or contact a DCI administrator"
          );
        }
      });
  };

  render() {
    const { seeSSOForm } = this.state;
    return (
      <div className="pf-c-login">
        <div className="pf-c-login__container">
          <header className="pf-c-login__header">
            <img className="pf-c-brand" src={Logo} alt="Distributed CI" />
            <p>
              DCI or Distributed CI is a continuous integration project that
              aims to bring partners inside Red Hat CI framework by running CI
              on dedicated lab environments that are running in their data
              centers with their configurations and their applications.
            </p>
          </header>
          <div className="pf-c-login__main">
            <header className="pf-c-login__main-header">
              <Title headingLevel="h1" size="4xl">
                {seeSSOForm ? "SSO Login" : "DCI Login"}
              </Title>
            </header>
            <div className="pf-c-login__main-body">
              {seeSSOForm ? <SSOForm /> : <LoginForm submit={this.submit} />}
            </div>
            <div className="pf-c-login__main-body">
              <Button
                variant="link"
                className="pf-u-p-0"
                onClick={() =>
                  this.setState(prevState => ({
                    seeSSOForm: !prevState.seeSSOForm
                  }))
                }
              >
                toggle login form
              </Button>
            </div>
          </div>
          <footer className="pf-c-login__footer">
            <ul className="pf-c-list pf-m-inline">
              <li>
                <a
                  href="https://doc.distributed-ci.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pf-c-login__footer-link"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getIdentity: () => dispatch(getIdentity()),
    showError: message => dispatch(showError(message))
  };
}

export default connect(null, mapDispatchToProps)(LoginPage);
