/**
 * Import Modules
 */
import { REVIEW_API_KEY, GET_REVIEWS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Reply to Review Request
const replyToReviewRequest = (payload) => {
  const { reviewId, ...data } = payload;
  return apiRequest(`${REVIEW_API_KEY}/${reviewId}/reply`, "POST", data);
};

/**
 * useReplyToReviewMutation - Custom hook to handle Reply to Review mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useReplyToReviewMutation = (options) =>
  useApiSend(replyToReviewRequest, [GET_REVIEWS_API_KEY], options);
