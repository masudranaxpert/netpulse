import { Navigate } from "react-router-dom";
import { LoginForm } from "@/features/auth/LoginForm";
import { useSession } from "@/features/auth/useSession";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import { ROUTES } from "@/shared/constants/routes";
import { LoadingState } from "@/shared/components/ui/LoadingState";

export function LoginPage() {
  const { isLoading, isAuthenticated } = useSession();

  if (isLoading) return <LoadingState />;
  if (isAuthenticated) return <Navigate to={ROUTES.dashboard} replace />;

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
