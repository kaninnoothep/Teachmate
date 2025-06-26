/**
 * Import Modules
 */
import { SESSIONS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Add Session Request
const addSessionRequest = (payload) =>
  apiRequest(SESSIONS_API_KEY, "POST", payload);

/**
 * useAddSessionMutation - Custom hook to handle Add Session mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useAddSessionMutation = (options) =>
  useApiSend(addSessionRequest, [SESSIONS_API_KEY], options);
