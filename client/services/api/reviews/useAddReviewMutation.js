/**
 * Import Modules
 */
import { REVIEW_API_KEY, GET_REVIEWS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Add Review Request
const addReviewRequest = (payload) =>
  apiRequest(REVIEW_API_KEY, "POST", payload);

/**
 * useAddReviewMutation - Custom hook to handle Add Review mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useAddReviewMutation = (options) =>
  useApiSend(addReviewRequest, [GET_REVIEWS_API_KEY], options);
