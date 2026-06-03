import { Label } from "flowbite-react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
};

export function FormField({ label, htmlFor, required, full, children }: Props) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label htmlFor={htmlFor} className="mb-1.5 block">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}
