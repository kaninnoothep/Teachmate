/**
 * Import Modules
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { StarRatingDisplay } from "react-native-star-rating-widget";

/**
 * ReviewItem - Displays review card
 *
 * @param {object} props
 * @returns JSX Element
 */
export const ReviewReplyItem = ({ author, isReply = false }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [loadImageError, setLoadImageError] = useState(false);

  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      <View style={styles.headingContainer}>
        <View style={styles.headingWrapper}>
          <View style={styles.userContainer}>
            {author.image && !loadImageError ? (
              <Avatar.Image
                size={28}
                source={{ uri: author.image }}
                onError={() => setLoadImageError(true)}
              />
            ) : (
              <Avatar.Text
                size={28}
                label={`${author.firstName[0]}${author.lastName[0]}`}
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
            <Text variant="bodyLarge" numberOfLines={1}>
              {author.firstName} {author.lastName}
            </Text>
          </View>

          <TouchableOpacity onPress={() => {}}>
            <MaterialCommunityIcons
              name="trash-can"
              size={24}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        </View>

        {!isReply && (
          <StarRatingDisplay
            rating={5.0}
            starSize={18}
            starStyle={styles.star}
          />
        )}

        <Text variant="bodySmall" style={styles.subtitle}>
          2 days ago
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text variant="titleSmall" style={styles.title}>
          Perfect Tutor!
        </Text>

        <Text variant="bodyMedium">
          Lorem ipsum dolor sit amet consectetur. Ultricies viverra sollicitudin
          in id nisl sed tortor. Auctor feugiat volutpat et ultricies mattis
          volutpat.
        </Text>
      </View>

      {!isReply && (
        <TouchableOpacity style={styles.replyButton}>
          <MaterialCommunityIcons
            name="reply"
            size={20}
            color={theme.colors.primary}
          />
          <Text variant="titleSmall" style={styles.replyButtonText}>
            Reply
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * useStyles - Specify styles to use for review item
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      gap: 20,
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
    },
    replyContainer: {
      marginLeft: 22,
    },
    headingContainer: {
      gap: 4,
    },
    headingWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    },
    userContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    star: {
      marginHorizontal: 0,
      marginLeft: -2,
    },
    contentContainer: {
      gap: 4,
    },
    title: {
      fontWeight: 600,
    },
    subtitle: {
      color: theme.colors.textSecondary,
    },
    descriptionText: {
      color: theme.colors.textSecondary,
    },
    replyButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-end",
      gap: 2,
    },
    replyButtonText: {
      color: theme.colors.primary,
    },
  });
