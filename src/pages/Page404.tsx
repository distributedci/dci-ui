import { Link } from "react-router";
import NotAuthenticatedPage from "./NotAuthenticatedPage";
import { Content, ContentVariants, PageSection } from "@patternfly/react-core";

export default function Page404() {
  return (
    <NotAuthenticatedPage>
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PageSection>
          <Content component={ContentVariants.h1}>Page not found</Content>
          <Content component={ContentVariants.p}>
            We are sorry, we are looking for your page...but we can&apos;t find
            it.
          </Content>
          <Link to="/">Go back to the index page</Link>
        </PageSection>
      </div>
    </NotAuthenticatedPage>
  );
}
