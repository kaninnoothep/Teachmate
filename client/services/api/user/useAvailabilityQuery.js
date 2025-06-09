import { GET_AVAILABILITY_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

export const useAvailabilityQuery = (options) => {
  const { data, ...rest } = useApiGet([GET_AVAILABILITY_API_KEY], options);

  return {
    ...rest,
    availability: data?.data ?? [],
  };
};
