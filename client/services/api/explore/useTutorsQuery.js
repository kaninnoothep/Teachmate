import { GET_TUTORS_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

export const useTutorsQuery = (search = "", country, state, city, options) => {
  const { data, ...rest } = useApiGet(
    [GET_TUTORS_API_KEY, { search, country, state, city }],
    options
  );

  return {
    ...rest,
    tutors: data?.data ?? [],
  };
};
