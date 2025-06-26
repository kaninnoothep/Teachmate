/**
 * Import Modules
 */
import {
  GET_AVAILABILITY_API_KEY,
  SET_AVAILABILITY_API_KEY,
} from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Set Availability Request
const setAvailabilityRequest = (payload) =>
  apiRequest(SET_AVAILABILITY_API_KEY, "POST", payload);

/**
 * useSetAvailabilityMutation - Custom hook to handle Set Availability mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useSetAvailabilityMutation = (options) =>
  useApiSend(setAvailabilityRequest, [GET_AVAILABILITY_API_KEY], options);
