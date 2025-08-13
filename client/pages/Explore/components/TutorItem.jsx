/**
 * Import Modules
 */
import { Chip } from "@/components/Chip/Chip";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";

/**
 * TutorItem - Displays tutor card with brief information
 *
 * @param {object} props
 * @returns JSX Element
 */
export const TutorItem = ({ tutor }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [loadImageError, setLoadImageError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Avatar image */}
      {tutor.image && !loadImageError ? (
        <Image
          source={{ uri: tutor.image }}
          style={styles.avatar}
          onError={() => setLoadImageError(true)}
        />
      ) : (
        <Avatar.Text
          size={96}
          label={`${tutor.firstName[0]}${tutor.lastName[0]}`}
          style={styles.avatar}
        />
      )}

      {/* Tutor's Info */}
      <View style={styles.rightContainer}>
        <View style={styles.rightTopWrapper}>
          <Text variant="titleMedium" style={styles.title}>
            {tutor.firstName} {tutor.lastName}
          </Text>

          {tutor?.about && (
            <Text
              variant="bodyMedium"
              numberOfLines={2}
              style={styles.descriptionText}
            >
              {tutor?.about}
            </Text>
          )}
        </View>

        {/* Rating and Hourly Rate */}
        <View style={styles.chipContainer}>
          {tutor?.averageRating !== 0 && (
            <Chip
              textVariant="bodySmall"
              icon="star"
              iconSize={16}
              iconColor={theme.colors.star}
              value={tutor.averageRating.toFixed(1)}
              containerStyle={[styles.chip, styles.starChip]}
              textStyle={styles.starChipText}
            />
          )}

          {tutor?.hourlyRate && (
            <Chip
              textVariant="bodySmall"
              value={`$${tutor.hourlyRate}/\u200Bh`}
              containerStyle={styles.chip}
            />
          )}
        </View>
      </View>
    </View>
  );
};

/**
 * useStyles - Specify styles to use for tutor item
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      flexDirection: "row",
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      gap: 16,
    },
    avatar: {
      width: 106,
      height: 106,
      backgroundColor: theme.colors.primary,
      borderRadius: 14,
    },
    rightContainer: {
      flex: 1,
      gap: 6,
    },
    rightTopWrapper: {
      flex: 1,
      gap: 6,
    },
    title: {
      fontSize: 20,
    },
    descriptionText: {
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    chipContainer: {
      flexDirection: "row",
      gap: 6,
    },
    chip: {
      alignSelf: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      gap: 4,
    },
    starChip: {
      paddingLeft: 8,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.outline,
    },
    starChipText: {
      color: theme.colors.textPrimary,
    },
  });
