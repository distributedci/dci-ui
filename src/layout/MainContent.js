import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty, values } from "lodash";
import { withRouter, Route, Link } from "react-router-dom";
import {
  Brand,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  Nav,
  NavGroup,
  NavItem,
  Page,
  PageHeader,
  PageSidebar,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Avatar
} from "@patternfly/react-core";
import accessibleStyles from "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
import { css } from "@patternfly/react-styles";
import Logo from "logo-no-icon.svg";
import { setCurrentTeam } from "currentUser/currentUserActions";
import { UserIcon, UsersIcon } from "@patternfly/react-icons";
import avatarImg from "./img_avatar.svg";

class MenuDropdown extends React.Component {
  state = {
    isDropdownOpen: false
  };

  onDropdownToggle = isDropdownOpen => {
    this.setState({
      isDropdownOpen
    });
  };

  onDropdownSelect = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };

  render() {
    const { isDropdownOpen } = this.state;
    const { title, position, dropdownItems } = this.props;
    return (
      <Dropdown
        isPlain
        position={position}
        onSelect={this.onDropdownSelect}
        isOpen={isDropdownOpen}
        toggle={
          <DropdownToggle onToggle={this.onDropdownToggle}>
            {title}
          </DropdownToggle>
        }
        dropdownItems={dropdownItems}
      />
    );
  }
}

function DCINavItem({ children, to, exact = true }) {
  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }) => (
        <NavItem isActive={!isEmpty(match)}>
          <Link to={to}>{children}</Link>
        </NavItem>
      )}
    />
  );
}

class MainContent extends Component {
  render() {
    const {
      children,
      currentUser,
      currentUserTeams,
      setCurrentTeam,
      history
    } = this.props;
    const PageNav = (
      <Nav aria-label="Nav" theme="dark">
        <NavGroup title="DCI">
          <DCINavItem to="/jobs" exact={false}>
            Jobs
          </DCINavItem>
          {currentUser.isSuperAdmin && (
            <React.Fragment>
              <DCINavItem to="/feeders">Feeders</DCINavItem>
              <DCINavItem to="/products">Products</DCINavItem>
            </React.Fragment>
          )}
          <DCINavItem to="/topics">Topics</DCINavItem>
          <DCINavItem to="/components">Components</DCINavItem>
          <DCINavItem to="/remotecis">Remotecis</DCINavItem>
        </NavGroup>
        {currentUser.hasReadOnlyRole && (
          <NavGroup title="Stats">
            <DCINavItem to="/globalStatus">Global Status</DCINavItem>
            <DCINavItem to="/trends">Trends</DCINavItem>
            <DCINavItem to="/performance">Performance</DCINavItem>
          </NavGroup>
        )}
        {currentUser.hasEPMRole && (
          <NavGroup title="Admin">
            <DCINavItem to="/teams">Teams</DCINavItem>
            <DCINavItem to="/users">Users</DCINavItem>
            {currentUser.hasEPMRole && (
              <DCINavItem to="/permissions">Permissions</DCINavItem>
            )}
          </NavGroup>
        )}
        <NavGroup title="User Preferences">
          <DCINavItem to="/currentUser/settings">Settings</DCINavItem>
          <DCINavItem to="/currentUser/notifications">Notifications</DCINavItem>
        </NavGroup>
      </Nav>
    );
    const PageToolbar = (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem
            className={css(
              accessibleStyles.srOnly,
              accessibleStyles.visibleOnMd
            )}
          >
            <MenuDropdown
              position="right"
              title={
                <span>
                  <UserIcon className="pf-u-mr-md" />
                  {currentUser.fullname || currentUser.name}
                </span>
              }
              dropdownItems={[
                <DropdownItem
                  key="dropdown_user_settings"
                  component="button"
                  onClick={() => history.push("/currentUser/settings")}
                >
                  Settings
                </DropdownItem>,
                <DropdownSeparator key="dropdown_user_separator" />,
                <DropdownItem
                  key="dropdown_user_logout"
                  component="button"
                  onClick={() => history.push("/logout")}
                >
                  Logout
                </DropdownItem>
              ]}
            />
          </ToolbarItem>
        </ToolbarGroup>
        {currentUserTeams.length > 1 && (
          <ToolbarGroup
            className={css(
              accessibleStyles.screenReader,
              accessibleStyles.visibleOnLg
            )}
          >
            <ToolbarItem
              className={css(
                accessibleStyles.srOnly,
                accessibleStyles.visibleOnMd
              )}
            >
              <MenuDropdown
                position="right"
                title={
                  <span>
                    <UsersIcon className="pf-u-mr-md" />
                    {currentUser.team.name}
                  </span>
                }
                dropdownItems={currentUserTeams.map(team => (
                  <DropdownItem
                    key={team.name}
                    component="button"
                    onClick={() => setCurrentTeam(team)}
                  >
                    {team.name}
                  </DropdownItem>
                ))}
              />
            </ToolbarItem>
          </ToolbarGroup>
        )}
      </Toolbar>
    );

    const Header = (
      <PageHeader
        logo={<Brand src={Logo} alt="DCI Logo" />}
        toolbar={PageToolbar}
        avatar={<Avatar src={avatarImg} alt="Avatar" />}
        showNavToggle
      />
    );
    const Sidebar = <PageSidebar nav={PageNav} theme="dark" />;
    return (
      <React.Fragment>
        <Page header={Header} sidebar={Sidebar} isManagedSidebar>
          {children}
        </Page>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    currentUserTeams: values(state.currentUser.teams)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentTeam: team => dispatch(setCurrentTeam(team))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContent)
);
