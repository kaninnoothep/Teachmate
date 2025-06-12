/**
 * Import Modules
 */
import { SESSIONS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

const updateSessionRequest = (payload) => {
  const { sessionId, ...data } = payload;
  return apiRequest(`${SESSIONS_API_KEY}/${sessionId}`, "PUT", data);
};

export const useUpdateSessionMutation = (options) =>
  useApiSend(updateSessionRequest, [SESSIONS_API_KEY], options);
