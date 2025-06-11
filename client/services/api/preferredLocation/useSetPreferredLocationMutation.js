/**
 * Import Modules
 */
import {
  GET_PREFERRED_LOCATION_API_KEY,
  SET_PREFERRED_LOCATION_API_KEY,
} from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Set Preferred Location Request
const setPreferredLocationRequest = (payload) =>
  apiRequest(SET_PREFERRED_LOCATION_API_KEY, "POST", payload);

// Custom Hook to manage Set Preferred Location request
export const useSetPreferredLocationMutation = (options) =>
  useApiSend(
    setPreferredLocationRequest,
    [GET_PREFERRED_LOCATION_API_KEY],
    options
  );
