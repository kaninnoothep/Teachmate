import { LogoHeaderTitle } from "@/components/LogoHeaderTitle/LogoHeaderTitle";
import { AppProvider } from "@/context/AppProvider/AppProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

function MainLayout() {
  const theme = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          headerTitleAlign: "center",
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
      <Stack.Screen
        name="(modals)"
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
