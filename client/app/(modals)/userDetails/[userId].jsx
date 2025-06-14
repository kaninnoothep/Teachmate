import { ProfilePage } from "@/pages/Profile/ProfilePage";
import { useUserQuery } from "@/services/api/user/useUserQuery";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

export default function UserDetailsScreen() {
  const theme = useTheme();
  const { userId } = useLocalSearchParams();
  const { user, isFetching } = useUserQuery(userId);

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <ProfilePage user={user} externalView />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
