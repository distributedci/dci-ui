import { Breadcrumb } from "ui";
import {
  Card,
  CardTitle,
  CardBody,
  Content,
  Gallery,
  GalleryItem,
  PageSection,
} from "@patternfly/react-core";
import { useAuth } from "auth/authSelectors";
import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";

export default function AdminPage() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;
  return (
    <PageSection>
      <Breadcrumb links={[{ to: "/", title: "DCI" }, { title: "Admin" }]} />
      <Content component="h1">Admin page</Content>
      <Content component="p">
        This page provides administrative tools for managing DCI application
        resources.
      </Content>
      <Content component="p">
        You have been redirected here because administrators cannot access the
        main application interface anymore.
      </Content>
      <Content component="p">
        You can switch teams using the team selector in the top-right menu.
      </Content>
      <Gallery hasGutter>
        <GalleryItem>
          <Card isCompact>
            <CardTitle>
              <Link to={`/admin/teams`}>Teams</Link>
            </CardTitle>
            <CardBody>
              Manage existing teams, update their settings, or create new ones.
            </CardBody>
          </Card>
        </GalleryItem>
        <GalleryItem>
          <Card isCompact>
            <CardTitle>
              <Link to={`/admin/users`}>Users</Link>
            </CardTitle>
            <CardBody>
              View and edit user accounts and team affiliations.
            </CardBody>
          </Card>
        </GalleryItem>
        {currentUser.isSuperAdmin && (
          <Fragment>
            <GalleryItem>
              <Card isCompact>
                <CardTitle>
                  <Link to={`/admin/topics`}>Topics</Link>
                </CardTitle>
                <CardBody>Manage existing topics or create new ones.</CardBody>
              </Card>
            </GalleryItem>
            <GalleryItem>
              <Card isCompact>
                <CardTitle>
                  <Link to={`/admin/remotecis`}>Remotecis</Link>
                </CardTitle>
                <CardBody>
                  Manage existing remotecis or create new ones.
                </CardBody>
              </Card>
            </GalleryItem>
            <GalleryItem>
              <Card isCompact>
                <CardTitle>
                  <Link to={`/admin/feeders`}>Feeders</Link>
                </CardTitle>
                <CardBody>Manage existing feeders or create new ones.</CardBody>
              </Card>
            </GalleryItem>
          </Fragment>
        )}
      </Gallery>
    </PageSection>
  );
}
