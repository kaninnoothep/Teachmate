/**
 * Import Modules
 */
import { BackButton } from "@/components/BackButton/BackButton";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

/**
 * ModalsLayout - Stack layout for modal-related screens.
 *
 * @returns JSX Element defining modal navigation screens.
 */
export default function ModalsLayout() {
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
        headerLeft: () => <BackButton />,
      }}
    >
      {/* User Details Screen */}
      <Stack.Screen
        name="userDetails/[userId]"
        options={({ route }) => ({
          title: route.params.itemName,
          headerTintColor: theme.colors.inverseText,
        })}
      />

      {/* Offered Sessions Screen */}
      <Stack.Screen
        name="userDetails/offeredSessions"
        options={{
          title: "Offered Sessions",
          headerTintColor: theme.colors.inverseText,
        }}
      />

      {/* Session Details Screen */}
      <Stack.Screen
        name="userDetails/sessionDetails"
        options={{
          title: "Session Details",
          headerTintColor: theme.colors.inverseText,
        }}
      />

      {/* Book Tutor Screen */}
      <Stack.Screen
        name="bookTutor/[tutorId]"
        options={{
          title: "Book Tutor",
          headerTintColor: theme.colors.inverseText,
        }}
      />

      {/* Reviews Screen */}
      <Stack.Screen
        name="reviews/[userId]"
        options={{
          title: "Reviews",
          headerTintColor: theme.colors.inverseText,
        }}
      />

      {/* Reply to Review Screen */}
      <Stack.Screen
        name="reviews/replyToReview"
        options={{
          title: "Reply Review",
          headerTintColor: theme.colors.inverseText,
          presentation: "fullScreenModal",
          headerLeft: () => <BackButton isCloseButton />,
        }}
      />
    </Stack>
  );
}
