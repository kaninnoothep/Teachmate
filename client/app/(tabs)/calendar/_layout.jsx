/**
 * Import Modules
 */
import { BackButton } from "@/components/BackButton/BackButton";
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

/**
 * CalendarLayout - Stack layout for the Calendar section of the app.
 *
 * @returns JSX Element defining the navigation stack for the Calendar screen.
 */
export default function CalendarLayout() {
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
      {/* Main Calendar Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Calendar",
          headerTitle: () => <LogoHeaderTitle />,
        }}
      />

      {/* Booking Details Screen */}
      <Stack.Screen
        name="[bookingId]"
        options={{
          title: "Booking Details",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}
