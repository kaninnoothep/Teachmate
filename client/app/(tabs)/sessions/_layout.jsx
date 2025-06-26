import { BackButton } from "@/components/BackButton/BackButton";
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

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
      <Stack.Screen
        name="index"
        options={{
          title: "Sessions",
          headerTitle: () => <LogoHeaderTitle />,
        }}
      />

      <Stack.Screen
        name="addSession"
        options={{
          title: "Session",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />

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
