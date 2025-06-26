/**
 * Import Modules
 */
import { BOOKING_API_KEY, GET_BOOKINGS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Create booking Request
const createBookingRequest = (payload) =>
  apiRequest(BOOKING_API_KEY, "POST", payload);

/**
 * useCreateBookingMutation - Custom hook to handle Create Booking mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useCreateBookingMutation = (options) =>
  useApiSend(createBookingRequest, [GET_BOOKINGS_API_KEY], options);
