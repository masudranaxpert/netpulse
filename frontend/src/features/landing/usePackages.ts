import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type PublicPackage = {
  id: number;
  name: string;
  package_type: string;
  speed: string;
  price: string;
  description: string;
};

export function usePackages() {
  return useQuery({
    queryKey: ["public-packages"],
    queryFn: async (): Promise<PublicPackage[]> => {
      const { data } = await axios.get<PublicPackage[]>("/api/portal/packages/");
      return data;
    },
  });
}
