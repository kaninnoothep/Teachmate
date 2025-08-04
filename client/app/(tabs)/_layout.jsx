/**
 * Import Modules
 */
import { Redirect, Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useUser } from "@/context/UserProvider/UserProvider";
import { useTheme } from "react-native-paper";

/**
 * TabLayout - Main tab navigation layout for authenticated users
 *
 * @returns JSX Element with role-based tab navigation
 */
export default function TabLayout() {
  const { user } = useUser();
  const theme = useTheme();

  // Redirect unauthenticated users to login
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBackground,
        },
      }}
    >
      {/* Bookings Tab */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="notebook" size={24} color={color} />
          ),
        }}
      />

      {/* Calendar Tab  */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar" size={24} color={color} />
          ),
        }}
      />

      {/* Sessions Tab (only for tutors) */}
      <Tabs.Screen
        name="sessions"
        options={{
          href: user.role === "student" && null,
          title: "Sessions",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Explore Tab (only for students) */}
      <Tabs.Screen
        name="explore"
        options={{
          href: user.role === "tutor" && null,
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" size={24} color={color} />
          ),
        }}
      />

      {/* Dashboard Tab  */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-box" size={24} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
