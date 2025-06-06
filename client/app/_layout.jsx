import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { AppProvider } from "@/context/AppProvider/AppProvider";
import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

function MainLayout() {
  const theme = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
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
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
