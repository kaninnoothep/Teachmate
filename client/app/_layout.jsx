/**
 * Import Modules
 */
import { BackButton } from "@/components/BackButton/BackButton";
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { AppProvider } from "@/context/AppProvider/AppProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

/**
 * MainLayout - Defines navigation stack and screen options
 *
 * @returns JSX Element with configured screens
 */
function MainLayout() {
  const theme = useTheme();
  return (
    <Stack>
      {/* Login screen */}
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          headerTitleAlign: "center",
        }}
      />

      {/* Signup screen */}
      <Stack.Screen
        name="signup"
        options={{
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTitle: () => <LogoHeaderTitle />,
        }}
      />

      {/* Tab navigator */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* Modal stack */}
      <Stack.Screen
        name="(modals)"
        options={{
          headerShown: false,
        }}
      />

      {/* Add Review Modal */}
      <Stack.Screen
        name="addReview"
        options={{
          title: "Write a Review",
          headerTintColor: theme.colors.inverseText,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTitleStyle: {
            fontWeight: "500",
          },
          headerTitleAlign: "center",
          presentation: "fullScreenModal",
          headerLeft: () => <BackButton isCloseButton />,
        }}
      />

      {/* Fallback screen */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

/**
 * RootLayout - App wrapper with providers and gesture support
 *
 * @returns JSX Element
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
