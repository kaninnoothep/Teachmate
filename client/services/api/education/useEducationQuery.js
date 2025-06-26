/**
 * Import Modules
 */
import { EDUCATION_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useEducationQuery - Custom hook to fetch educations
 *
 * @param {*} options - Additional query options
 * @returns {object} - Education data and query status
 */
export const useEducationQuery = (options) => {
  const { data, ...rest } = useApiGet([EDUCATION_API_KEY], options);

  return {
    ...rest,
    education: data?.data ?? [],
  };
};
