/**
 * Import Modules
 */
import { SESSIONS_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useSessionsQuery - Custom hook to fetch sessions
 *
 * @param {*} options - Additional query options
 * @returns {object} - Sessions data and query status
 */
export const useSessionsQuery = (options) => {
  const { data, ...rest } = useApiGet([SESSIONS_API_KEY], options);

  return {
    ...rest,
    sessions: data?.data ?? [],
  };
};
