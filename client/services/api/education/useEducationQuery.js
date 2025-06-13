import { EDUCATION_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

export const useEducationQuery = (options) => {
  const { data, ...rest } = useApiGet([EDUCATION_API_KEY], options);

  return {
    ...rest,
    education: data?.data ?? [],
  };
};
