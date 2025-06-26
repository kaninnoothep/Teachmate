/**
 * Import Modules
 */
import { BackButton } from "@/components/BackButton/BackButton";
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { LogoutButton } from "@/components/LogoutButton/LogoutButton";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

/**
 * ProfileLayout - Stack layout for profile-related screens
 *
 * @returns JSX Element defining navigation stack for profile section
 */
export default function ProfileLayout() {
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
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />

      {/* Availability Screen */}
      <Stack.Screen
        name="availability"
        options={{
          title: "Availability",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />

      {/* Preferred Location Screen */}
      <Stack.Screen
        name="preferredLocation"
        options={{
          title: "Preferred Location",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />

      {/* Add Education Screen */}
      <Stack.Screen
        name="education/index"
        options={{
          title: "Education",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />

      {/* Update Education Screen */}
      <Stack.Screen
        name="education/[educationId]"
        options={{
          title: "Education",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />

      {/* Add Experience Screen */}
      <Stack.Screen
        name="experience/index"
        options={{
          title: "Experience",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />

      {/* Update Experience Screen */}
      <Stack.Screen
        name="experience/[experienceId]"
        options={{
          title: "Experience",
          headerTintColor: theme.colors.inverseText,
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}
