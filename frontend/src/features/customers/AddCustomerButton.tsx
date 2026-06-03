import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/components/icons/Icon";
import { ROUTES } from "@/shared/constants/routes";

type Props = { onNavigate?: () => void; full?: boolean };

export function AddCustomerButton({ onNavigate, full }: Props) {
  const navigate = useNavigate();
  const go = () => {
    onNavigate?.();
    navigate(ROUTES.customerNew);
  };
  return (
    <Button color="primary" className={full ? "w-full" : ""} onClick={go}>
      <Icon name="plus" className="mr-2 h-4 w-4" /> Add customer
    </Button>
  );
}
