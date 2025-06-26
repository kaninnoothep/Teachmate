/**
 * Import Modules
 */
import { SESSIONS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Update Session Request
const updateSessionRequest = (payload) => {
  const { sessionId, ...data } = payload;
  return apiRequest(`${SESSIONS_API_KEY}/${sessionId}`, "PUT", data);
};

/**
 * useUpdateSessionMutation - Custom hook to handle update session mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useUpdateSessionMutation = (options) =>
  useApiSend(updateSessionRequest, [SESSIONS_API_KEY], options);
