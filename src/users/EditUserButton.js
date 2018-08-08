import React, { Component } from "react";
import { connect } from "react-redux";
import UserForm from "./UserForm";
import actions from "./usersActions";

export class EditUserButton extends Component {
  render() {
    const { user, teams, roles, editUser, ...props } = this.props;
    return (
      <UserForm
        {...props}
        title="Edit user"
        user={user}
        showModalButton={<i className="fa fa-pencil" />}
        okButton="Edit"
        submit={newUser => {
          editUser({
            id: user.id,
            ...newUser
          });
        }}
        teams={teams}
        roles={roles}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editUser: user => dispatch(actions.update(user))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EditUserButton);
