import { Outlet, Navigate } from "react-router";
import { useAuth } from "auth/authSelectors";

export default function AdminOrEpmRoute() {
  const { currentUser } = useAuth();

  return currentUser && currentUser.hasEPMRole ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}
