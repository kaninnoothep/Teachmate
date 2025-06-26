/**
 * Import Modules
 */
import { BackButton } from "@/components/BackButton/BackButton";
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

/**
 * SessionsLayout - Stack layout for managing session-related screens
 *
 * @returns JSX Element with session navigation configuration
 */
export default function SessionsLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontWeight: "500",
        },
        headerTitleAlign: "center",
      }}
    >
      {/* Sessions index screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Sessions",
          headerTitle: () => <LogoHeaderTitle />,
        }}
      />

      {/* Add new session screen */}
      <Stack.Screen
        name="addSession"
        options={{
          title: "Session",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />

      {/* Session detail screen (dynamic ID) */}
      <Stack.Screen
        name="[sessionId]"
        options={{
          title: "Session",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}
