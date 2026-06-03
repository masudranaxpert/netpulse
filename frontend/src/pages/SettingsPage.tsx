import { Avatar, Button, DarkThemeToggle } from "flowbite-react";
import { useLogout } from "@/features/auth/useLogout";
import { useSession } from "@/features/auth/useSession";
import { Icon } from "@/shared/components/icons/Icon";
import { PageHeader } from "@/shared/components/layout/PageHeader";

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white">{children}</span>
    </div>
  );
}

export function SettingsPage() {
  const { user, isLoading } = useSession();
  const logout = useLogout();
  const email = user?.email ?? "admin@netpulse.io";

  return (
    <>
      <PageHeader title="Settings" description="Manage your administrator account and preferences." />
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5">
        <Card title="Profile" description="Your administrator account details.">
          <div className="mb-4 flex items-center gap-4">
            <Avatar rounded size="lg" placeholderInitials={email.slice(0, 2).toUpperCase()} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900 dark:text-white">Administrator</p>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{email}</p>
            </div>
          </div>
          <Row label="Email">{isLoading ? "…" : email}</Row>
          <Row label="Account ID">{user?.pk ?? "—"}</Row>
          <Row label="Role">Administrator</Row>
        </Card>

        <Card title="Preferences" description="Appearance and interface options.">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Theme</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark mode.</p>
            </div>
            <DarkThemeToggle className="rounded-lg" />
          </div>
        </Card>

        <Card title="Session" description="Sign out of the admin console.">
          <Button color="light" onClick={() => logout.mutate()} disabled={logout.isPending}>
            <Icon name="logout" className="mr-2 h-4 w-4" />
            {logout.isPending ? "Signing out…" : "Sign out"}
          </Button>
        </Card>
      </div>
    </>
  );
}
