/**
 * Import Modules
 */
import { GET_REVIEWS_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useReviewsQuery - Custom hook to fetch reviews
 *
 * @param {*} userId - The user ID to fetch
 * @param {*} options - Additional query options
 * @returns {object} - Reviews data
 */
export const useReviewsQuery = (userId, options) => {
  const { data, ...rest } = useApiGet(
    [`${GET_REVIEWS_API_KEY}/${userId}`],
    options
  );

  return {
    ...rest,
    reviews: data?.data?.reviews ?? [],
    totalReviews: data?.data?.totalReviews ?? 0,
    averageRating: data?.data?.averageRating ?? 0,
  };
};
