import { Alert } from "flowbite-react";

type Props = { message: string };

export function ErrorAlert({ message }: Props) {
  return (
    <Alert color="failure" className="mb-4">
      <span className="font-medium">Something went wrong.</span> {message}
    </Alert>
  );
}
