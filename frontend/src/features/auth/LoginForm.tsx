import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useLogin } from "@/features/auth/useLogin";

export function LoginForm() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  const err = login.error as { response?: { data?: { detail?: string } } } | null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Welcome back. Please enter your details.
      </p>
      {login.isError ? (
        <Alert color="failure" className="mt-5">
          {err?.response?.data?.detail ?? "Invalid email or password."}
        </Alert>
      ) : null}
      <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
        <div>
          <Label htmlFor="email" className="mb-1.5 block">Email</Label>
          <TextInput id="email" type="email" required placeholder="admin@netpulse.io" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password" className="mb-1.5 block">Password</Label>
          <TextInput id="password" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" color="primary" className="mt-2 w-full" disabled={login.isPending}>
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
