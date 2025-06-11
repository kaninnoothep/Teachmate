/**
 * Import Modules
 */
import { EDUCATION_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Education Request
const addEducationRequest = (payload) =>
  apiRequest(EDUCATION_API_KEY, "POST", payload);

// Custom Hook to manage education request
export const useAddEducationMutation = (options) =>
  useApiSend(addEducationRequest, [], options);
