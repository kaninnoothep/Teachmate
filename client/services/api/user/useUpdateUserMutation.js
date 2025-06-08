/**
 * Import Modules
 */

import { UPDATE_USER_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Update User Request
const updateUserRequest = (payload) =>
  apiRequest(UPDATE_USER_API_KEY, "POST", payload);

// Custom Hook to manage Update User request
export const useUpdateUserMutation = (options) =>
  useApiSend(updateUserRequest, [], options);
