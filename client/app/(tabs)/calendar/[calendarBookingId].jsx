/**
 * Import Module
 */
import { BookingDetailPage } from "@/pages/BookingDetail/BookingDetailPage";
import { useBookingQuery } from "@/services/api/bookings/useBookingQuery";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

/**
 * BookingDetailScreen - Displays booking detail page
 *
 * @returns JSX Element rendering the booking detail page
 */
export default function CalendarBookingDetailScreen() {
  const theme = useTheme();
  const { calendarBookingId } = useLocalSearchParams();
  const { booking, isFetching } = useBookingQuery(calendarBookingId);

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <BookingDetailPage booking={booking} />;
}

/**
 * Specify Styles to use
 */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
