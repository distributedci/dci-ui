import { Page, PageSidebar, PageSidebarBody } from "@patternfly/react-core";
import Header from "./Header";
import { useState } from "react";

interface NotAuthenticatedPageProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function NotAuthenticatedPage({
  children,
  sidebar,
}: NotAuthenticatedPageProps) {
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth >= 1450);

  return (
    <Page
      masthead={
        <Header toggleSidebarVisibility={() => setIsNavOpen(!isNavOpen)} />
      }
      sidebar={
        sidebar ? (
          <PageSidebar isSidebarOpen={isNavOpen}>
            <PageSidebarBody>{sidebar}</PageSidebarBody>
          </PageSidebar>
        ) : undefined
      }
    >
      {children}
    </Page>
  );
}
