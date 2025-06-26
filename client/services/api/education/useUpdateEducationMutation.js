/**
 * Import Modules
 */
import { EDUCATION_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Update Education Request
const updateEducationRequest = (payload) => {
  const { educationId, ...data } = payload;
  return apiRequest(`${EDUCATION_API_KEY}/${educationId}`, "PUT", data);
};

/**
 * useUpdateEducationMutation - Custom hook to handle Update Education mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useUpdateEducationMutation = (options) =>
  useApiSend(updateEducationRequest, [], options);
