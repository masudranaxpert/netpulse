import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Brand } from "@/shared/components/layout/Brand";
import { usePortalLogin } from "@/features/portal/portalAuth";
import { getPortalToken } from "@/shared/api/portalClient";
import { ROUTES } from "@/shared/constants/routes";

export function PortalLoginPage() {
  const login = usePortalLogin();
  const [pppoe_name, setName] = useState("");
  const [pppoe_pass, setPass] = useState("");

  if (getPortalToken()) return <Navigate to={ROUTES.portal} replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ pppoe_name, pppoe_pass });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-ink-900 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl dark:bg-ink-900">
        <Brand />
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Customer Portal</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in with your PPPoE credentials.</p>
        {login.isError ? (
          <Alert color="failure" className="mt-5">Invalid PPPoE username or password.</Alert>
        ) : null}
        <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
          <div>
            <Label htmlFor="pppoe" className="mb-1.5 block">PPPoE username</Label>
            <TextInput id="pppoe" required value={pppoe_name} onChange={(e) => setName(e.target.value)} placeholder="your-username" />
          </div>
          <div>
            <Label htmlFor="pass" className="mb-1.5 block">Password</Label>
            <TextInput id="pass" type="password" required value={pppoe_pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" color="primary" className="mt-2 w-full" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <a href={ROUTES.home} className="mt-5 block text-center text-sm text-slate-400 hover:text-brand-600">← Back to home</a>
      </div>
    </div>
  );
}
