/**
 * Import Modules
 */
import { EDUCATION_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Delete Education Request
const deleteEducationRequest = (educationId) =>
  apiRequest(`${EDUCATION_API_KEY}/${educationId}`, "DELETE");

/**
 * useDeleteEducationMutation - Custom hook to handle Delete Education mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useDeleteEducationMutation = (options) =>
  useApiSend(deleteEducationRequest, [], options);
