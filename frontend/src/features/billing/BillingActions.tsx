import { Button } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenerateBillsModal } from "@/features/billing/GenerateBillsModal";
import { Icon } from "@/shared/components/icons/Icon";
import { ROUTES } from "@/shared/constants/routes";

export function BillingActions() {
  const navigate = useNavigate();
  const [bills, setBills] = useState(false);
  return (
    <>
      <Button color="light" onClick={() => setBills(true)}>
        <Icon name="fileText" className="mr-2 h-4 w-4" /> Generate bills
      </Button>
      <Button color="primary" onClick={() => navigate(ROUTES.payments)}>
        <Icon name="cash" className="mr-2 h-4 w-4" /> Record payment
      </Button>
      <GenerateBillsModal open={bills} onClose={() => setBills(false)} />
    </>
  );
}
