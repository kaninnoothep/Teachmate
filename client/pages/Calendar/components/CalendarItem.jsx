/**
 * Import Modules
 */
import { Chip } from "@/components/Chip/Chip";
import { getBookingStatusColor } from "@/utils/getBookingStatusColor";
import dayjs from "dayjs";
import { useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";

/**
 * CalendarItem - Displays a single booking/event item in the calendar list
 *
 * @param {object} props
 * @returns JSX.Element rendering a styled booking card with timeline and user avatar
 */
export const CalendarItem = ({
  status,
  subject,
  description,
  user,
  startTime,
  endTime,
  onPress = () => {},
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [loadImageError, setLoadImageError] = useState(false);

  // Get colors for booking status badge
  const { backgroundColor, borderColor, textColor } = getBookingStatusColor(
    theme,
    status
  );

  return (
    <Pressable style={styles.container}>
      {/* Timeline Column */}
      <View style={styles.timelineColumn}>
        {/* Time Label */}
        <Text variant="bodySmall" style={styles.timeText}>
          {dayjs(`2000-01-01T${startTime}`).format("h:mm A")}
        </Text>

        {/* Timeline  */}
        <Text variant="bodySmall" style={styles.durationText}>
          {dayjs(`2000-01-01T${endTime}`).diff(
            dayjs(`2000-01-01T${startTime}`),
            "hour"
          )}
          h
        </Text>
      </View>

      {/* Content Column */}
      <TouchableOpacity onPress={onPress} style={styles.contentColumn}>
        <View style={styles.cardContent}>
          <View style={styles.leftWrapper}>
            <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
              {subject}
            </Text>

            <Text
              variant="bodyMedium"
              numberOfLines={2}
              style={styles.descriptionText}
            >
              {description}
            </Text>

            <Chip
              textVariant="bodySmall"
              value={status}
              containerStyle={[styles.chip, { backgroundColor, borderColor }]}
              textStyle={[styles.chipText, { color: textColor }]}
            />
          </View>

          {user.image && !loadImageError ? (
            <Avatar.Image
              size={40}
              source={{ uri: user.image }}
              onError={() => setLoadImageError(true)}
            />
          ) : (
            <Avatar.Text
              size={40}
              label={`${user.firstName[0]}${user.lastName[0]}`}
              style={{ backgroundColor: theme.colors.primary }}
            />
          )}
        </View>
      </TouchableOpacity>
    </Pressable>
  );
};

/**
 * useStyles - Specify styles for calendar item
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 8,
    },
    timelineColumn: {
      width: 66,
      alignItems: "flex-start",
      marginTop: 2,
    },
    timeText: {
      color: theme.colors.primary,
      fontWeight: "600",
      marginBottom: 4,
    },
    contentColumn: {
      flex: 1,
    },
    cardContent: {
      flex: 1,
      flexDirection: "row",
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      gap: 6,
    },
    leftWrapper: {
      flex: 1,
      gap: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      flex: 1,
    },
    durationText: {
      color: theme.colors.textSecondary,
      fontWeight: "500",
      fontSize: 11,
    },
    descriptionText: {
      color: theme.colors.textSecondary,
    },
    chip: {
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    chipText: {
      textTransform: "capitalize",
    },
  });
