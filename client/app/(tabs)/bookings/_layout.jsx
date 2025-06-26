/**
 * Import Modules
 */
import { BackButton } from "@/components/BackButton/BackButton";
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

/**
 * BookingsLayout - Stack layout for the Bookings section.
 *
 * @returns JSX Element defining the navigation stack for booking-related screens.
 */
export default function BookingsLayout() {
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
      {/* Main Bookings Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Bookings",
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
