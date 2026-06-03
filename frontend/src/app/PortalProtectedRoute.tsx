import { Navigate, Outlet } from "react-router-dom";
import { getPortalToken } from "@/shared/api/portalClient";
import { ROUTES } from "@/shared/constants/routes";

export function PortalProtectedRoute() {
  if (!getPortalToken()) {
    return <Navigate to={ROUTES.portalLogin} replace />;
  }
  return <Outlet />;
}
