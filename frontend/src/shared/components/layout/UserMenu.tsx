import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/features/auth/useLogout";
import { useSession } from "@/features/auth/useSession";
import { ROUTES } from "@/shared/constants/routes";

export function UserMenu() {
  const logout = useLogout();
  const navigate = useNavigate();
  const { user } = useSession();
  const email = user?.email ?? "admin@netpulse.io";

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={<Avatar rounded size="sm" placeholderInitials={email.slice(0, 2).toUpperCase()} />}
    >
      <DropdownHeader>
        <span className="block text-sm font-semibold">Administrator</span>
        <span className="block truncate text-sm text-slate-500">{email}</span>
      </DropdownHeader>
      <DropdownItem onClick={() => navigate(ROUTES.settings)}>Profile</DropdownItem>
      <DropdownItem onClick={() => navigate(ROUTES.settings)}>Settings</DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={() => logout.mutate()}>Sign out</DropdownItem>
    </Dropdown>
  );
}
