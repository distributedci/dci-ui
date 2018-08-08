import React, { Component } from "react";
import { connect } from "react-redux";
import TeamForm from "./TeamForm";
import actions from "./teamsActions";

export class NewTeamButton extends Component {
  render() {
    return (
      <TeamForm
        title="Create a new team"
        showModalButton="Create a new team"
        okButton="Create"
        submit={this.props.createTeam}
        className={this.props.className}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTeam: team => dispatch(actions.create(team))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(NewTeamButton);
