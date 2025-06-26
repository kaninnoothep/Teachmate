/**
 * Import Modules
 */
import { EDUCATION_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Add Education Request
const addEducationRequest = (payload) =>
  apiRequest(EDUCATION_API_KEY, "POST", payload);

/**
 * useAddEducationMutation - Custom hook to handle Add Education mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useAddEducationMutation = (options) =>
  useApiSend(addEducationRequest, [], options);
