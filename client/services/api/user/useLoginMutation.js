/**
 * Import Modules
 */
import { LOGIN_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Login Request
const loginRequest = (payload) => apiRequest(LOGIN_API_KEY, "POST", payload);

// Custom Hook to manage login request
export const useLoginMutation = (options) =>
  useApiSend(loginRequest, null, options);
