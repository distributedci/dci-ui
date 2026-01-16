import { useAuth } from "auth/authSelectors";
import { Outlet, Navigate } from "react-router";

export default function NonPrivilegedUserRoute() {
  const { currentUser } = useAuth();

  return currentUser && currentUser.hasEPMRole ? (
    <Navigate to="/admin" />
  ) : (
    <Outlet />
  );
}
