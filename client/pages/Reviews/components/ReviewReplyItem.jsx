/**
 * Import Modules
 */
import { useUser } from "@/context/UserProvider/UserProvider";
import { useDeleteReplyMutation } from "@/services/api/reviews/useDeleteReplyMutation";
import { useDeleteReviewMutation } from "@/services/api/reviews/useDeleteReviewMutation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import Toast from "react-native-toast-message";

// Enable relative time plugin for dayjs
dayjs.extend(relativeTime);

/**
 * ReviewItem - Displays review card
 *
 * @param {object} props
 * @returns JSX Element
 */
export const ReviewReplyItem = ({
  reviewId,
  author,
  reviewee,
  rating,
  title = "",
  message = "",
  createdAt,
  reply,
  isReply = false,
}) => {
  const { user } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);
  const [loadImageError, setLoadImageError] = useState(false);
  const canReply = useMemo(() => reviewee?._id === user._id, [reviewee, user]);
  const canDelete = useMemo(() => author._id === user._id, [author, user]);

  const { mutateAsync: deleteReview } = useDeleteReviewMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  const { mutateAsync: deleteReply } = useDeleteReplyMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete this ${!isReply ? "review" : "reply"}?`,
      "",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () =>
            !isReply ? deleteReview(reviewId) : deleteReply(reviewId),
          style: "destructive",
        },
      ]
    );
  };

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

          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <MaterialCommunityIcons
                name="trash-can"
                size={24}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          )}
        </View>

        {!isReply && (
          <StarRatingDisplay
            rating={rating}
            starSize={18}
            starStyle={styles.star}
            color={theme.colors.star}
          />
        )}

        <Text variant="bodySmall" style={styles.subtitle}>
          {dayjs(createdAt).fromNow()}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        {!isReply && (
          <Text variant="titleSmall" style={styles.title}>
            {title}
          </Text>
        )}

        <Text variant="bodyMedium">{message}</Text>
      </View>

      {!isReply && !reply && canReply && (
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
