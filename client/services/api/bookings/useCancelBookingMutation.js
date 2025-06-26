/**
 * Import Modules
 */
import { BOOKING_API_KEY, GET_BOOKINGS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Cancel booking Request
const cancelBookingRequest = (bookingId) =>
  apiRequest(`${BOOKING_API_KEY}/${bookingId}`, "DELETE");

/**
 * useCancelBookingMutation - Custom hook to handle Cancel Booking mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useCancelBookingMutation = (options) =>
  useApiSend(cancelBookingRequest, [GET_BOOKINGS_API_KEY], options);
