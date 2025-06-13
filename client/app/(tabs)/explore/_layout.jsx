import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

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
      }}
    >
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
