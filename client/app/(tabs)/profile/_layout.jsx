import { BackButton } from "@/components/BackButton/BackButton";
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { LogoutButton } from "@/components/LogoutButton/LogoutButton";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function ProfileLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
      }}
    >
      {/* Main Profile Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerTitle: () => <LogoHeaderTitle />,
          headerRight: () => <LogoutButton />,
        }}
      />

      {/* Account Screen */}
      <Stack.Screen
        name="account"
        options={{
          title: "Account",
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}
