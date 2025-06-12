/**
 * Import Modules
 */
import { SESSIONS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Session Request
const addSessionRequest = (payload) =>
  apiRequest(SESSIONS_API_KEY, "POST", payload);

// Custom Hook to manage Session request
export const useAddSessionMutation = (options) =>
  useApiSend(addSessionRequest, [SESSIONS_API_KEY], options);
