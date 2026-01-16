import { useState } from "react";
import {
  Link,
  useResolvedPath,
  useLocation,
  Outlet,
  Navigate,
} from "react-router";
import {
  Nav,
  NavGroup,
  NavItem,
  Page,
  PageSidebar,
  PageSidebarBody,
} from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import NotAuthenticatedLoadingPage from "./NotAuthenticatedLoadingPage";
import { useAuth } from "auth/authSelectors";
import { useGetCurrentUserQuery } from "auth/authApi";
import { ProfilePageUrl } from "auth/sso";
import ReadOnlyBanner from "ui/ReadOnlyBanner";
import Header from "./Header";

function DCINavItem({
  children,
  to,
  ...props
}: {
  children: React.ReactNode;
  to: string;
  exact?: boolean;
}) {
  const location = useLocation();
  const path = useResolvedPath(to);
  const isActive = location.pathname.startsWith(path.pathname);
  return (
    <NavItem isActive={isActive}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </NavItem>
  );
}

interface SidebarProps {
  isNavOpen: boolean;
}

function Sidebar({ isNavOpen }: SidebarProps) {
  const { currentUser } = useAuth();
  if (currentUser === null) return null;
  const currentUserTeams = Object.values(currentUser.teams);

  const PageNav = currentUser.hasEPMRole ? (
    <Nav aria-label="Nav">
      <NavGroup title="Administration">
        <DCINavItem to="/admin/teams">Teams</DCINavItem>
        <DCINavItem to="/admin/users">Users</DCINavItem>
        {currentUser.isSuperAdmin && (
          <>
            <DCINavItem to="/admin/products">Products</DCINavItem>
            <DCINavItem to="/admin/topics">Topics</DCINavItem>
            <DCINavItem to="/admin/remotecis">Remotecis</DCINavItem>
            <DCINavItem to="/admin/feeders">Feeders</DCINavItem>
          </>
        )}
      </NavGroup>
    </Nav>
  ) : (
    <Nav aria-label="Nav">
      <NavGroup title="DCI">
        <DCINavItem to="/analytics">Analytics</DCINavItem>
        <DCINavItem to="/jobs">Jobs</DCINavItem>
        <DCINavItem to="/products">Products</DCINavItem>
        <DCINavItem to="/topics">Topics</DCINavItem>
        <DCINavItem to="/components">Components</DCINavItem>
      </NavGroup>
      {currentUserTeams.length === 0 ? null : (
        <NavGroup title="Access Management">
          <DCINavItem to="/remotecis">Remotecis</DCINavItem>
        </NavGroup>
      )}
      <NavGroup title=" User Preferences">
        <NavItem>
          <a target="_blank" rel="noopener noreferrer" href={ProfilePageUrl}>
            My profile <ExternalLinkAltIcon style={{ height: "0.8em" }} />
          </a>
        </NavItem>
        <DCINavItem to="/notifications">Notifications</DCINavItem>
      </NavGroup>
    </Nav>
  );
  return (
    <PageSidebar isSidebarOpen={isNavOpen}>
      <PageSidebarBody>{PageNav}</PageSidebarBody>
    </PageSidebar>
  );
}

export default function AuthenticatedRoute({ ...props }) {
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth >= 1450);
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const location = useLocation();

  if (isLoading) {
    return <NotAuthenticatedLoadingPage />;
  }

  return currentUser ? (
    <>
      {currentUser.isReadOnly && <ReadOnlyBanner />}
      <Page
        masthead={
          <Header toggleSidebarVisibility={() => setIsNavOpen(!isNavOpen)} />
        }
        sidebar={<Sidebar isNavOpen={isNavOpen} />}
        isManagedSidebar={false}
        onPageResize={(_event, { windowSize }) => {
          if (windowSize >= 1450) {
            setIsNavOpen(true);
          } else {
            setIsNavOpen(false);
          }
        }}
        {...props}
      >
        <Outlet />
      </Page>
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}
