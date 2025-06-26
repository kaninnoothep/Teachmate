import { GET_AVAILABILITY_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useAvailabilityQuery - Custom hook to fetch availabilities
 *
 * @param {*} options - Additional query options
 * @returns {object} - Availability data and query status
 */
export const useAvailabilityQuery = (options) => {
  const { data, ...rest } = useApiGet([GET_AVAILABILITY_API_KEY], options);

  return {
    ...rest,
    availability: data?.data ?? [],
  };
};
