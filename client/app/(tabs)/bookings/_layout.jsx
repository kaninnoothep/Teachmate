import { BackButton } from "@/components/BackButton/BackButton";
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

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
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Bookings",
          headerTitle: () => <LogoHeaderTitle />,
        }}
      />

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
