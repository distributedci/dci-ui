import React, { Component } from "react";
import { connect } from "react-redux";
import Formsy from "formsy-react";
import { Toolbar, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { isEmpty } from "lodash";
import { Page } from "../layout";
import usersActions from "./usersActions";
import rolesActions from "../roles/rolesActions";
import teamsActions from "../teams/teamsActions";
import { EmptyState, Pagination } from "../ui";
import { Input } from "../form";
import NewUserButton from "./NewUserButton";
import { getUsers } from "./usersSelectors";
import { getTeams } from "../teams/teamsSelectors";
import { getRoles } from "../roles/rolesSelectors";
import UserRow from "./UserRow";

export class UsersContainer extends Component {
  state = {
    search: ""
  };
  componentDidMount() {
    const { fetchUsers } = this.props;
    fetchUsers();
  }
  render() {
    const {
      users,
      teams,
      roles,
      isFetching,
      currentUser,
      deleteUser
    } = this.props;
    const { search } = this.state;
    const filteredUsers = users.filter(user => {
      const lowerSearch = search.toLowerCase();
      return (
        user.email.toLowerCase().includes(lowerSearch) ||
        user.name.toLowerCase().includes(lowerSearch) ||
        user.fullname.toLowerCase().includes(lowerSearch)
      );
    });
    return (
      <Page
        title="Users"
        loading={isFetching && isEmpty(users)}
        empty={!isFetching && isEmpty(users)}
        EmptyComponent={
          <EmptyState
            title="There is no users"
            info="Do you want to create one?"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th colSpan={6}>
                <Toolbar className="pf-u-justify-content-space-between pf-u-mv-md">
                  <ToolbarGroup>
                    <ToolbarItem className="pf-u-mr-md">
                      <NewUserButton teams={teams} roles={roles} />
                    </ToolbarItem>
                    <ToolbarItem>
                      <Formsy
                        onChange={({ search }) => this.setState({ search })}
                        className="pf-c-form"
                      >
                        <Input name="search" placeholder="Search a user" />
                      </Formsy>
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    {/* <Pagination
                      pagination={{
                        page: 1,
                        perPage: 20
                      }}
                      count={100}
                      goTo={page => alert(page)}
                      items="users"
                      aria-label="Users pagination"
                    /> */}
                  </ToolbarGroup>
                </Toolbar>
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>ID</th>
              <th>Login</th>
              <th>Full name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <UserRow
                key={`${user.id}.${user.etag}`}
                user={user}
                isDisabled={currentUser.id === user.id}
                deleteConfirmed={() => deleteUser(user)}
              />
            ))}
          </tbody>
        </table>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: getUsers(state),
    teams: getTeams(state),
    roles: getRoles(state),
    isFetching:
      state.teams.isFetching ||
      state.users.isFetching ||
      state.roles.isFetching,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => {
      dispatch(usersActions.all({ embed: "team,role" }));
      dispatch(teamsActions.all());
      dispatch(rolesActions.all());
    },
    deleteUser: user => dispatch(usersActions.delete(user))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersContainer);
