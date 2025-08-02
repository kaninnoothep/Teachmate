/**
 * Import Modules
 */
import { REVIEW_API_KEY, GET_REVIEWS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Delete Review Request
const deleteReviewRequest = (reviewId) =>
  apiRequest(`${REVIEW_API_KEY}/${reviewId}`, "DELETE");

/**
 * useDeleteReviewMutation - Custom hook to handle Delete Review mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useDeleteReviewMutation = (options) =>
  useApiSend(deleteReviewRequest, [GET_REVIEWS_API_KEY], options);
