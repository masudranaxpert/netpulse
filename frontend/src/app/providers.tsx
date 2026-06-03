import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "flowbite-react";
import type { ReactNode } from "react";
import { ispTheme } from "@/shared/theme/flowbiteTheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

type Props = { children: ReactNode };

export function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={ispTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
