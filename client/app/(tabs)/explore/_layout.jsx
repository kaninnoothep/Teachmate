/**
 * Import Modules
 */
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

/**
 * ExploreLayout - Stack layout for the Explore section of the app.
 *
 * @returns JSX Element defining the navigation stack for the Explore screen.
 */
export default function ExploreLayout() {
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
      {/* Main Explore Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Explore",
          headerTitle: () => <LogoHeaderTitle />,
        }}
      />
    </Stack>
  );
}
