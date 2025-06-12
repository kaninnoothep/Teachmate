import { SESSIONS_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

export const useSessionsQuery = (options) => {
  const { data, ...rest } = useApiGet([SESSIONS_API_KEY], options);

  return {
    ...rest,
    sessions: data?.data ?? [],
  };
};
