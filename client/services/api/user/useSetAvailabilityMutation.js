/**
 * Import Modules
 */
import { SET_AVAILABILITY_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Set Availability Request
const setAvailabilityRequest = (payload) =>
  apiRequest(SET_AVAILABILITY_API_KEY, "POST", payload);

// Custom Hook to manage Set Availability request
export const useSetAvailabilityMutation = (options) =>
  useApiSend(setAvailabilityRequest, [], options);
