/**
 * Import Modules
 */
import { SESSIONS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Delete Session Request
const deleteSessionRequest = (sessionId) =>
  apiRequest(`${SESSIONS_API_KEY}/${sessionId}`, "DELETE");

/**
 * useDeleteSessionMutation - Custom hook to handle Delete Session mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useDeleteSessionMutation = (options) =>
  useApiSend(deleteSessionRequest, [SESSIONS_API_KEY], options);
