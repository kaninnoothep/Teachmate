import {
  FlatList,
  Pressable,
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

const reviews = [
  {
    _id: "1",
    reviewer: { firstName: "Jessy", lastName: "Lee" },
    reply: { message: "test" },
  },
];

export const ReviewsPage = () => {
  const { user } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);

  const renderHeaderComponent = () => (
    <>
      <View style={styles.ratingContainer}>
        <Text variant="displayLarge" style={{ fontWeight: 500 }}>
          5.0
        </Text>

        <View style={styles.ratingWrapper}>
          <StarRatingDisplay
            rating={5.0}
            starSize={26}
            starStyle={styles.star}
          />
          <Text variant="bodyMedium" style={styles.ratingText}>
            2 Reviews
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.reviewButton}>
        <MaterialCommunityIcons
          name="pencil"
          size={20}
          color={theme.colors.primary}
        />
        <Text variant="titleMedium" style={styles.reviewButtonText}>
          Write a review
        </Text>
      </TouchableOpacity>
    </>
  );
  const renderFooterComponent = () => <Pressable style={{ height: 32 }} />;
  const renderSeparatorComponent = () => <Pressable style={{ height: 10 }} />;

  return (
    <Pressable style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeaderComponent}
        ListFooterComponent={renderFooterComponent}
        ItemSeparatorComponent={renderSeparatorComponent}
        data={reviews}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={{ gap: 10 }}>
            <ReviewReplyItem author={item.reviewer} />
            {item.reply && <ReviewReplyItem author={item.reviewer} isReply />}
          </Pressable>
        )}
        keyExtractor={(item) => item._id}
        removeClippedSubviews
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <EmptyList
            iconName="star"
            message="No reviews"
            containerStyle={{ marginTop: 100 }}
            isLoading={false}
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
