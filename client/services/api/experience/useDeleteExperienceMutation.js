/**
 * Import Modules
 */
import { EXPERIENCE_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Delete Experience Request
const deleteExperienceRequest = (experienceId) =>
  apiRequest(`${EXPERIENCE_API_KEY}/${experienceId}`, "DELETE");

/**
 * useDeleteExperienceMutation - Custom hook to handle Delete Experience mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useDeleteExperienceMutation = (options) =>
  useApiSend(deleteExperienceRequest, [], options);
