/**
 * Import Modules
 */
import { EXPERIENCE_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Update Experience Request
const updateExperienceRequest = (payload) => {
  const { experienceId, ...data } = payload;
  return apiRequest(`${EXPERIENCE_API_KEY}/${experienceId}`, "PUT", data);
};

/**
 * useUpdateExperienceMutation - Custom hook to handle Update Experience mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useUpdateExperienceMutation = (options) =>
  useApiSend(updateExperienceRequest, [], options);
