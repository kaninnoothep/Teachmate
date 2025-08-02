import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { ReviewReplyItem } from "./components/ReviewReplyItem";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@/context/UserProvider/UserProvider";
import { useLocalSearchParams } from "expo-router";
import { useReviewsQuery } from "@/services/api/reviews/useReviewsQuery";
import { useMemo, useState } from "react";
import { useCanReviewQuery } from "@/services/api/reviews/useCanReviewQuery";

export const ReviewsPage = () => {
  const { user } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const { userId: reviewUserId } = useLocalSearchParams();
  const { reviews, totalReviews, averageRating, isFetching, refetch } =
    useReviewsQuery(reviewUserId);
  const { canReview } = useCanReviewQuery(reviewUserId);

  const hasReviews = useMemo(() => totalReviews !== 0, [totalReviews]);

  const getTotalReviewText = () => {
    let totalText = `${totalReviews} Review`;

    if (totalReviews > 1) totalText += "s";

    if (totalReviews === 0) totalText = "No Reviews";

    return totalText;
  };

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const renderHeaderComponent = () => (
    <>
      <View style={styles.ratingContainer}>
        {hasReviews && (
          <Text variant="displayLarge" style={{ fontWeight: 500 }}>
            {averageRating.toFixed(1)}
          </Text>
        )}

        <View
          style={[
            styles.ratingWrapper,
            !hasReviews && {
              alignItems: "center",
            },
          ]}
        >
          <StarRatingDisplay
            rating={hasReviews ? averageRating : 5}
            starSize={26}
            starStyle={styles.star}
            color={hasReviews ? theme.colors.star : theme.colors.grey}
          />
          <Text variant="bodyMedium" style={styles.ratingText}>
            {getTotalReviewText()}
          </Text>
        </View>
      </View>

      {user._id !== reviewUserId && canReview && (
        <TouchableOpacity TouchableOpacity style={styles.reviewButton}>
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={theme.colors.primary}
          />

          <Text variant="titleMedium" style={styles.reviewButtonText}>
            Write a review
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
  const renderFooterComponent = () => <Pressable style={{ height: 32 }} />;
  const renderSeparatorComponent = () => <Pressable style={{ height: 10 }} />;

  const renderListItem = ({ item }) => {
    const {
      _id,
      reviewer,
      reviewee,
      rating,
      title,
      reviewMessage,
      reply,
      createdAt: reviewCreatedAt,
    } = item;

    return (
      <Pressable style={{ gap: 10 }}>
        <ReviewReplyItem
          reviewId={_id}
          author={reviewer}
          reviewee={reviewee}
          rating={rating}
          title={title}
          message={reviewMessage}
          createdAt={reviewCreatedAt}
          reply={reply}
        />
        {reply && (
          <ReviewReplyItem
            reviewId={_id}
            author={reply.author}
            message={reply.replyMessage}
            createdAt={reply.createdAt}
            isReply
          />
        )}
      </Pressable>
    );
  };

  return (
    <Pressable style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeaderComponent}
        ListFooterComponent={renderFooterComponent}
        ItemSeparatorComponent={renderSeparatorComponent}
        data={reviews}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={handleRefresh}
          />
        }
        renderItem={renderListItem}
        keyExtractor={(item) => item._id}
        removeClippedSubviews
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <EmptyList
            iconName="star"
            message="No reviews"
            containerStyle={{ marginTop: 100 }}
            isLoading={isFetching}
          />
        }
      />
    </Pressable>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
    },
    listContentContainer: {
      paddingHorizontal: 16,
    },
    ratingContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.onSurfacePrimary,
      height: 120,
      gap: 10,
      marginHorizontal: -16,
      marginBottom: 20,
    },
    ratingWrapper: {
      gap: 2,
    },
    star: {
      marginHorizontal: 0,
    },
    ratingText: {
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    reviewButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-end",
      gap: 4,
      marginBottom: 20,
      paddingRight: 6,
    },
    reviewButtonText: {
      color: theme.colors.primary,
    },
  });
