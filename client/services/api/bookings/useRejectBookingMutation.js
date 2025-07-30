/**
 * Import Modules
 */
import { BOOKING_API_KEY, GET_BOOKINGS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Reject booking Request
const rejectBookingRequest = (payload) => {
  const { bookingId, ...data } = payload;
  return apiRequest(`${BOOKING_API_KEY}/${bookingId}/reject`, "POST", data);
};

/**
 * useRejectBookingMutation - Custom hook to handle Reject Booking mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useRejectBookingMutation = (options) =>
  useApiSend(rejectBookingRequest, [GET_BOOKINGS_API_KEY], options);
