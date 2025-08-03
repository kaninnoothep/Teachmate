/**
 * Import Modules
 */
import { useUser } from "@/context/UserProvider/UserProvider";
import { ProfilePage } from "@/pages/Profile/ProfilePage";
import { useUserQuery } from "@/services/api/user/useUserQuery";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

/**
 * ProfileScreen - Displays the profile page with user data
 *
 * @returns JSX Element rendering the user's profile
 */
export default function ProfileScreen() {
  const theme = useTheme();
  const { user: userContext } = useUser();
  const { user, isFetching } = useUserQuery(userContext._id);

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <ProfilePage user={user} />;
}

/**
 * Specify Styles to use
 */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
