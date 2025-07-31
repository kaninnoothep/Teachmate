/**
 * Import Modules
 */
import { ReviewsPage } from "@/pages/Reviews/ReviewsPage";
import { useLocalSearchParams } from "expo-router";

/**
 * ReviewsScreen - Displays a public profile view for a specific user.
 *
 * @returns JSX Element rendering the user details page
 */
export default function ReviewsScreen() {
  const { userId } = useLocalSearchParams();
  //   const { user, isFetching } = useUserQuery(userId);

  //   if (isFetching) {
  //     return (
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color={theme.colors.primary} />
  //       </View>
  //     );
  //   }

  return <ReviewsPage />;
}
