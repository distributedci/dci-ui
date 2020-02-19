import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { setJWT } from "services/localStorage";
import pages from "pages";
import { useAuth } from "./authContext";

const LoginCallbackPage = () => {
  const { sso, refreshIdentity } = useAuth();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [location, setLocation] = useState({ from: { pathname: "/jobs" } });

  useEffect(() => {
    sso
      .signinRedirectCallback()
      .then(user => {
        if (user) {
          setLocation(user.state);
          setJWT(user.access_token);
        }
        return refreshIdentity();
      })
      .catch(() => undefined)
      .then(() => setIsLoadingUser(false));
  }, [refreshIdentity, sso]);

  return isLoadingUser ? (
    <pages.NotAuthenticatedLoadingPage />
  ) : (
    <Redirect to={location.from} />
  );
};

export default LoginCallbackPage;
