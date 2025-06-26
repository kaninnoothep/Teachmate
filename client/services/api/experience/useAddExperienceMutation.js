/**
 * Import Modules
 */
import { EXPERIENCE_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Add Experience Request
const addExperienceRequest = (payload) =>
  apiRequest(EXPERIENCE_API_KEY, "POST", payload);

/**
 * useAddExperienceMutation - Custom hook to handle Add Experience mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useAddExperienceMutation = (options) =>
  useApiSend(addExperienceRequest, [], options);
