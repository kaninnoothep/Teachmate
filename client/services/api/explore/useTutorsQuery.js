/**
 * Import Modules
 */
import { GET_TUTORS_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useTutorsQuery - Custom hook to fetch tutors with optional search and filters
 *
 * @param {string} search - Search term
 * @param {string} country - Country filter
 * @param {string} state - State filter
 * @param {string} city - City filter
 * @param {*} options - Additional query options
 * @returns {object} - Tutors data and query status
 */
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
