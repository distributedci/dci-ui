import { Outlet, Navigate } from "react-router";
import { useAuth } from "auth/authSelectors";

export default function AdminOrEpmRoute() {
  const { currentUser } = useAuth();
  if (currentUser === null) {
    return null;
  }
  return currentUser.hasEPMRole ? <Outlet /> : <Navigate to="/" />;
}
