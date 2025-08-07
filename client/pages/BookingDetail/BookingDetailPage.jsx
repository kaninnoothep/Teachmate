/**
 * Import Modules
 */
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Toast from "react-native-toast-message";
import { Chip } from "@/components/Chip/Chip";
import { InfoBox } from "@/components/InfoBox/InfoBox";
import { useUser } from "@/context/UserProvider/UserProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "@/components/Button/Button";
import { getBookingStatusColor } from "@/utils/getBookingStatusColor";
import { CancellationDialog } from "./components/CancellationDialog";
import { useConfirmBookingMutation } from "@/services/api/bookings/useConfirmBookingMutation";
import { StarRatingDisplay } from "react-native-star-rating-widget";

dayjs.extend(utc); // Enable UTC support in dayjs

/**
 * BookingDetailPage - Displays details of a specific booking and allows students to cancel it.
 *
 * @returns JSX Element rendering the availability management interface
 */
export const BookingDetailPage = ({ booking }) => {
  const { user } = useUser();
  const theme = useTheme();
  const router = useRouter();
  const [loadImageError, setLoadImageError] = useState(false);
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const { bookingId } = useLocalSearchParams(); // Get booking ID from route parameters

  // Hook to confirm booking
  const { mutateAsync: confirmBooking } = useConfirmBookingMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Destructure fields from booking object
  const {
    status,
    session,
    preferredLocation,
    date,
    startTime,
    endTime,
    student,
    tutor,
    note,
    cancelNote,
    cancelledBy,
  } = booking;

  const { backgroundColor, borderColor, textColor } = getBookingStatusColor(
    theme,
    status
  );

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

  const getReasonLabel = () => {
    let label = "Reason for";

    if (status === "rejected") {
      label += " Rejection by";
    } else if (status === "cancelled") {
      label += " Cancellation by";
    }

    if (cancelledBy === "tutor") {
      label += " Tutor";
    } else if (cancelledBy === "student") {
      label += " Student";
    }

    return label;
  };

  // Get the opposite party (either tutor or student)
  const author = useMemo(
    () => (user.role === "tutor" ? student : tutor),
    [user.role, student, tutor]
  );

  const handleConfirm = async () => {
    await confirmBooking({ bookingId });
  };

  const renderActions = () => {
    const sessionDateTime = dayjs(`${date.split("T")[0]}T${startTime}`).utc();
    const canCancel = sessionDateTime.subtract(24, "hour").isAfter(dayjs.utc());

    if (
      (status === "pending" && user.role === "student") ||
      status === "confirmed"
    ) {
      return (
        <View style={{ marginTop: canCancel && 20, gap: 6 }}>
          {canCancel && (
            <Button
              onPress={() => setShowCancellationDialog(true)}
              variant="red-outlined"
              icon={({ color }) => (
                <MaterialCommunityIcons
                  name="calendar-remove"
                  size={24}
                  color={color}
                />
              )}
            >
              Cancel Booking
            </Button>
          )}
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.textSecondary }}
          >
            *Cancellations must be made at least 24 hours before the session.
          </Text>
        </View>
      );
    }

    if (status === "pending" && user.role === "tutor") {
      return (
        <View style={[styles.infoRow, { marginTop: 20 }]}>
          <Button
            onPress={handleConfirm}
            variant="green-outlined"
            icon={({ color }) => (
              <MaterialCommunityIcons name="check" size={24} color={color} />
            )}
            style={styles.actionButton}
          >
            Confirm
          </Button>
          <Button
            onPress={() => setShowCancellationDialog(true)}
            variant="red-outlined"
            icon={({ color }) => (
              <MaterialCommunityIcons name="close" size={24} color={color} />
            )}
            style={styles.actionButton}
          >
            Reject
          </Button>
        </View>
      );
    }
  };

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <Pressable>
          <View style={styles.container}>
            {/* Subject Title */}
            <Text variant="headlineSmall" style={styles.title}>
              {session.subject}
            </Text>

            {/* Status & Preferred Location Chip */}
            <View style={styles.infoRow}>
              <Chip
                value={status}
                containerStyle={[styles.chip, { backgroundColor, borderColor }]}
                textStyle={[styles.chipText, { color: textColor }]}
              />

              {preferredLocation && (
                <Chip
                  icon={getPreferredLocationDisplay().icon}
                  value={getPreferredLocationDisplay().label}
                  containerStyle={styles.chip}
                />
              )}
            </View>

            {cancelNote && (
              <InfoBox label={getReasonLabel()}>
                <Text variant="bodyLarge">{cancelNote}</Text>
              </InfoBox>
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
                    label={`${author?.firstName?.[0] || ""}${
                      author?.lastName?.[0] || ""
                    }`}
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
                <View style={styles.userNameWrapper}>
                  <Text variant="titleMedium" style={styles.userName}>
                    {author?.firstName} {author?.lastName}
                  </Text>

                  {author?.averageRating !== 0 && (
                    <View style={styles.starWrapper}>
                      <StarRatingDisplay
                        rating={author?.averageRating || 0}
                        starSize={18}
                        starStyle={styles.star}
                        style={styles.starContainer}
                        color={theme.colors.star}
                      />
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {author?.averageRating?.toFixed(1)}
                      </Text>
                    </View>
                  )}
                </View>

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

            {renderActions()}
          </View>
        </Pressable>
      </ScrollView>

      <CancellationDialog
        visible={showCancellationDialog}
        setVisible={setShowCancellationDialog}
        isCancelDialog={status !== "pending" || user.role !== "tutor"}
      />
    </>
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
    gap: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  userNameWrapper: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 18,
  },
  starWrapper: {
    flexDirection: "row",
    gap: 4,
  },
  starContainer: { marginRight: 2 },
  star: {
    marginHorizontal: 0,
  },
  chip: {
    height: 46,
    alignSelf: "center",
  },
  chipText: {
    textTransform: "capitalize",
  },
  actionButton: {
    flex: 1,
  },
});
