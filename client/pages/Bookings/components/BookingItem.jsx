/**
 * Import Modules
 */
import { Button } from "@/components/Button/Button";
import { Chip } from "@/components/Chip/Chip";
import { getBookingStatusColor } from "@/utils/getBookingStatusColor";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";

dayjs.extend(utc); // Enable UTC support in dayjs

/**
 * BookingItem - Displays booking card with brief information
 *
 * @param {object} props
 * @returns JSX Element
 */
export const BookingItem = ({
  status = "pending",
  subject,
  description,
  user,
  date,
  time,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [loadImageError, setLoadImageError] = useState(false);
  const { backgroundColor, borderColor, textColor } = getBookingStatusColor(
    theme,
    status
  );

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, styles.leftWrapper]}>
        <Chip
          textVariant="bodySmall"
          value={status}
          containerStyle={[styles.chip, { backgroundColor, borderColor }]}
          textStyle={[styles.chipText, { color: textColor }]}
        />

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

        <View style={styles.userContainer}>
          {user.image && !loadImageError ? (
            <Avatar.Image
              size={28}
              source={{ uri: user.image }}
              onError={() => setLoadImageError(true)}
            />
          ) : (
            <Avatar.Text
              size={28}
              label={`${user.firstName[0]}${user.lastName[0]}`}
              style={{ backgroundColor: theme.colors.primary }}
            />
          )}
          <Text variant="bodyLarge" numberOfLines={1}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        {status === "finished" && (
          <Button variant="secondary" onPress={() => {}}>
            Write a review
          </Button>
        )}
      </View>

      <View style={[styles.wrapper, styles.rightWrapper]}>
        <Text variant="bodyMedium" style={styles.rightText}>
          {dayjs.utc(date).format("MMM")}
        </Text>
        <Text variant="headlineMedium" style={styles.rightText}>
          {dayjs.utc(date).format("D")}
        </Text>
        <Text variant="bodyMedium" style={styles.rightText}>
          {dayjs(`2000-01-01T${time}`).format("h:mm A")}
        </Text>
      </View>
    </View>
  );
};

/**
 * useStyles - Specify styles to use for booking item
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      justifyContent: "space-between",
    },
    wrapper: {
      padding: 20,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    leftWrapper: {
      flex: 1,
      gap: 16,
      justifyContent: "space-between",
    },
    rightWrapper: {
      width: 106,
      gap: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
    },
    rightText: {
      color: theme.colors.white,
    },
    title: { fontSize: 20 },
    descriptionText: {
      color: theme.colors.textSecondary,
    },
    userContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    chip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    chipText: {
      textTransform: "capitalize",
    },
  });
