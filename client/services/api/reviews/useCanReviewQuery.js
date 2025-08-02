/**
 * Import Modules
 */
import { CHECK_CAN_REVIEW_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useCanReviewQuery - Custom hook to check review eligibility
 *
 * @param {*} otherUserId - The other user ID to check
 * @param {*} options - Additional query options
 * @returns {object} - Can review boolean to the other user
 */
export const useCanReviewQuery = (otherUserId, options) => {
  const { data, ...rest } = useApiGet(
    [CHECK_CAN_REVIEW_API_KEY, { otherUserId }],
    options
  );

  return {
    ...rest,
    canReview: data?.data?.canReview ?? false,
  };
};
