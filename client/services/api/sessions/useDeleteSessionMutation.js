/**
 * Import Modules
 */
import { SESSIONS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

const deleteSessionRequest = (sessionId) =>
  apiRequest(`${SESSIONS_API_KEY}/${sessionId}`, "DELETE");

export const useDeleteSessionMutation = (options) =>
  useApiSend(deleteSessionRequest, [SESSIONS_API_KEY], options);
