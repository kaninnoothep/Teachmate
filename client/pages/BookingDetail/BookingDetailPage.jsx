/**
 * Import Modules
 */
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Chip } from "@/components/Chip/Chip";
import { InfoBox } from "@/components/InfoBox/InfoBox";
import { useUser } from "@/context/UserProvider/UserProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useCancelBookingMutation } from "@/services/api/bookings/useCancelBookingMutation";
import { Button } from "@/components/Button/Button";

dayjs.extend(utc); // Enable UTC support in dayjs

/**
 * BookingDetailPage - Displays details of a specific booking and allows students to cancel it.
 *
 * @returns JSX Element rendering the availability management interface
 */
export const BookingDetailPage = () => {
  const { user } = useUser();
  const theme = useTheme();
  const router = useRouter();
  const [loadImageError, setLoadImageError] = useState(false);
  const { bookingId, booking: bookingJSON } = useLocalSearchParams(); // Get booking data from route parameters

  // Hook to cancel booking
  const { mutateAsync: cancelBooking } = useCancelBookingMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Parse booking JSON string to object
  const booking = useMemo(() => {
    if (bookingJSON) {
      try {
        return JSON.parse(bookingJSON);
      } catch (error) {
        console.warn("Failed to parse booking:", error);
      }
    }
    return null;
  }, [bookingJSON]);

  // If no booking found, navigate back
  useEffect(() => {
    if (!booking) {
      router.back();
    }
  }, [booking]);

  if (!booking) return null;

  // Destructure fields from booking object
  const {
    session,
    preferredLocation,
    date,
    startTime,
    endTime,
    student,
    tutor,
    note,
  } = booking;

  // Format date and time display
  const formattedDate = dayjs.utc(date).format("MMMM D, YYYY");
  const formattedTime = `${dayjs(`2000-01-01T${startTime}`).format(
    "h:mm A"
  )} - ${dayjs(`2000-01-01T${endTime}`).format("h:mm A")}`;

  // Helper to show readable location info
  const getPreferredLocationDisplay = () => {
    if (preferredLocation === "publicPlace") {
      return { icon: "map", label: "In a Public Place" };
    } else if (preferredLocation === "tutorPlace") {
      return { icon: "home", label: "At Tutor's Place" };
    } else {
      return { icon: "video-outline", label: "Online" };
    }
  };

  // Determine label for user (depends on current user's role)
  const getAuthorLabel = () => {
    if (user.role === "tutor") {
      return "Booked by";
    } else {
      return "Teaches by";
    }
  };

  // Get the opposite party (either tutor or student)
  const author = useMemo(
    () => (user.role === "tutor" ? student : tutor),
    [user, booking]
  );

  // Confirm and cancel booking
  const handleDelete = () => {
    Alert.alert("Are you sure you want to cancel this booking?", "", [
      { text: "Later", style: "cancel" },
      {
        text: "Yes, cancel booking",
        onPress: () => cancelBooking(bookingId),
        style: "destructive",
      },
    ]);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <Pressable>
        <View style={styles.container}>
          {/* Subject Title */}
          <Text variant="headlineSmall" style={styles.title}>
            {session.subject}
          </Text>

          {/* Preferred Location Chip */}
          {preferredLocation && (
            <Chip
              icon={getPreferredLocationDisplay().icon}
              value={getPreferredLocationDisplay().label}
            />
          )}

          {/* Date & Time Info */}
          <View style={styles.infoRow}>
            <InfoBox label="Date">
              <Text variant="bodyLarge">{formattedDate}</Text>
            </InfoBox>
            <InfoBox label="Time">
              <Text variant="bodyLarge">{formattedTime}</Text>
            </InfoBox>
          </View>

          {/* Author Info (tutor or student) */}
          <InfoBox label={getAuthorLabel()} disabledContentPadding>
            <TouchableOpacity
              style={styles.userRow}
              onPress={() =>
                router.push({
                  pathname: `/(modals)/userDetails/${author._id}`,
                  params: {
                    itemName:
                      author.role === "tutor"
                        ? "Tutor Details"
                        : "Student Details",
                  },
                })
              }
            >
              {author?.image && !loadImageError ? (
                <Avatar.Image
                  size={40}
                  source={{ uri: author.image }}
                  onError={() => setLoadImageError(true)}
                />
              ) : (
                <Avatar.Text
                  size={40}
                  label={`${author.firstName[0]}${author.lastName[0]}`}
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              <Text variant="titleMedium" style={styles.userName}>
                {author.firstName} {author.lastName}
              </Text>

              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </InfoBox>

          {/* Note */}
          {note && (
            <InfoBox label="Note">
              <Text variant="bodyLarge">{note}</Text>
            </InfoBox>
          )}

          {/* Cancel Booking for students*/}
          {user.role === "student" && (
            <Button
              onPress={handleDelete}
              variant="red-outlined"
              icon={({ color }) => (
                <MaterialCommunityIcons
                  name="calendar-remove"
                  size={24}
                  color={color}
                />
              )}
              style={{ marginTop: 20 }}
            >
              Cancel Booking
            </Button>
          )}
        </View>
      </Pressable>
    </ScrollView>
  );
};

/**
 * Specify styles to use for booking detail page
 */
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 20,
  },
  title: {
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },

  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  userName: {
    fontSize: 18,
    flex: 1,
  },
  noteText: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
