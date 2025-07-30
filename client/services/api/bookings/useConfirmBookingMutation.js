/**
 * Import Modules
 */
import { BOOKING_API_KEY, GET_BOOKINGS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Confirm booking Request
const confirmBookingRequest = (payload) => {
  const { bookingId, ...data } = payload;
  return apiRequest(`${BOOKING_API_KEY}/${bookingId}/confirm`, "POST", data);
};

/**
 * useConfirmBookingMutation - Custom hook to handle Confirm Booking mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useConfirmBookingMutation = (options) =>
  useApiSend(confirmBookingRequest, [GET_BOOKINGS_API_KEY], options);
