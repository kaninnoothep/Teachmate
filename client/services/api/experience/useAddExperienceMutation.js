/**
 * Import Modules
 */
import { EXPERIENCE_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Experience Request
const addExperienceRequest = (payload) =>
  apiRequest(EXPERIENCE_API_KEY, "POST", payload);

// Custom Hook to manage Experience request
export const useAddExperienceMutation = (options) =>
  useApiSend(addExperienceRequest, [], options);
