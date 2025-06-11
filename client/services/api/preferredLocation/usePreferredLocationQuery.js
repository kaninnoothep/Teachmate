import { GET_PREFERRED_LOCATION_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

export const usePreferredLocationQuery = (options) => {
  const { data, ...rest } = useApiGet(
    [GET_PREFERRED_LOCATION_API_KEY],
    options
  );

  return {
    ...rest,
    preferredLocations: data?.data ?? {},
  };
};
