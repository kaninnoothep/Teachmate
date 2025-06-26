/**
 * Import Modules
 */
import { GET_USER_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useUserQuery - Custom hook to fetch user details by ID
 *
 * @param {*} userId - The user ID to fetch
 * @param {*} options - Additional query options
 * @returns {object} - User data and query status
 */
export const useUserQuery = (userId, options) => {
  const { data, ...rest } = useApiGet(
    [`${GET_USER_API_KEY}/${userId}`],
    options
  );

  return {
    ...rest,
    user: data?.data ?? {},
  };
};
