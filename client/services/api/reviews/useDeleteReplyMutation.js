/**
 * Import Modules
 */
import { REVIEW_API_KEY, GET_REVIEWS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Delete Reply Request
const deleteReplyRequest = (reviewId) =>
  apiRequest(`${REVIEW_API_KEY}/${reviewId}/reply`, "DELETE");

/**
 * useDeleteReplyMutation - Custom hook to handle Delete Reply mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useDeleteReplyMutation = (options) =>
  useApiSend(deleteReplyRequest, [GET_REVIEWS_API_KEY], options);
