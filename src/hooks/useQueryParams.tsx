import { useSearchParams } from "next/navigation";

export function useQueryParams() {
  const queryParams = useSearchParams();
  return new URLSearchParams(queryParams);
}
