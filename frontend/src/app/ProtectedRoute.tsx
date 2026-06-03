import { Spinner } from "flowbite-react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { useSession } from "@/features/auth/useSession";

export function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useSession();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" color="info" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}
