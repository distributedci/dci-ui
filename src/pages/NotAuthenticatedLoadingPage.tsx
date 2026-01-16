import { BlinkLogo, Breadcrumb } from "ui";
import NotAuthenticatedPage from "./NotAuthenticatedPage";
import {
  Content,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  Skeleton,
} from "@patternfly/react-core";

export default function NotAuthenticatedLoadingPage() {
  return (
    <NotAuthenticatedPage
      sidebar={
        <PageSidebar isSidebarOpen>
          <PageSidebarBody></PageSidebarBody>
        </PageSidebar>
      }
    >
      <PageSection>
        <Breadcrumb links={[{ to: "/", title: "DCI" }]} />
        <Content component="h1">
          <div style={{ maxWidth: "256px" }}>
            <Skeleton />
          </div>
        </Content>
        <BlinkLogo />
      </PageSection>
    </NotAuthenticatedPage>
  );
}
