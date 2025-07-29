/**
 * getBookingStatusColor - Returns theme color key based on booking status
 *
 * @param {*} theme
 * @param {string} status - Booking status (e.g., "pending", "confirmed", etc.)
 * @returns {string} - Color for status
 */
export function getBookingStatusColor(theme, status) {
  const colors = theme.colors;
  switch (status) {
    case "pending":
      return {
        backgroundColor: colors.onSurfacePrimary,
        borderColor: colors.primary,
        textColor: colors.primary,
      };
    case "confirmed":
      return {
        backgroundColor: colors.onSurfaceSuccess,
        borderColor: colors.success,
        textColor: colors.success,
      };
    case "cancelled":
    case "rejected":
      return {
        backgroundColor: colors.onSurfaceError,
        borderColor: colors.error,
        textColor: colors.error,
      };
    case "finished":
    case "expired":
      return {
        backgroundColor: colors.onSurfaceGrey,
        borderColor: colors.grey,
        textColor: colors.textSecondary,
      };
    default:
      return {
        backgroundColor: colors.onSurfacePrimary,
        borderColor: colors.primary,
        textColor: colors.primary,
      };
  }
}
