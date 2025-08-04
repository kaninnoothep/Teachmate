/**
 * Import Modules
 */
import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

/**
 * DashboardLayout - Stack layout for the Dashboard section of the app.
 *
 * @returns JSX Element defining the navigation stack for the Dashboard screen.
 */
export default function DashboardLayout() {
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
      {/* Main Dashboard Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerTitle: () => <LogoHeaderTitle />,
        }}
      />
    </Stack>
  );
}
