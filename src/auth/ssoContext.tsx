import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import pages from "../pages";
import { removeToken, setJWT } from "services/localStorage";
import Keycloak, { KeycloakInstance } from "keycloak-js";

export type SSOContextProps = {
  keycloak: KeycloakInstance;
};

const SSOContext = createContext({} as SSOContextProps);

const SSOUrl = process.env.REACT_APP_SSO_URL || "https://sso.redhat.com";
const SSORealm = process.env.REACT_APP_SSO_REALM || "redhat-external";
const SSOClientId = process.env.REACT_APP_SSO_CLIENT_ID || "dci";

type SSOProviderProps = {
  children: ReactNode;
};

function SSOProvider({ children }: SSOProviderProps) {
  const keycloak = Keycloak({
    url: `${SSOUrl}/auth`,
    clientId: SSOClientId,
    realm: SSORealm,
  });
  const [isLoadingIdentity, setIsLoadingIdentity] = useState(true);

  useEffect(() => {
    window.keycloak = keycloak;
    keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      })
      .then((isAuthenticated) => {
        if (isAuthenticated && keycloak.token) {
          setJWT(keycloak.token);
        } else {
          removeToken();
        }
      })
      .catch(console.error)
      .then(() => setIsLoadingIdentity(false));
  }, [keycloak]);
  if (isLoadingIdentity) {
    return <pages.NotAuthenticatedLoadingPage />;
  }
  return (
    <SSOContext.Provider value={{ keycloak }}>{children}</SSOContext.Provider>
  );
}

const useKeycloak = () => useContext(SSOContext);

export { SSOProvider, useKeycloak };
