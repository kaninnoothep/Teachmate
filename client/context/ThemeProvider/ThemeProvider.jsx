import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { PaperProvider, Text, adaptNavigationTheme } from "react-native-paper";
import {
  ThemeProvider as ReactNativeThemeProvider,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import { createCustomTheme } from "./theme";
import merge from "deepmerge";

export const ThemeProvider = ({ children }) => {
  const [fontsLoaded] = useFonts({
    Inter: require("../../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
  });
  const paperTheme = createCustomTheme("light");

  const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
  });
  const combinedTheme = merge(LightTheme, paperTheme);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <PaperProvider theme={combinedTheme}>
      <ReactNativeThemeProvider value={combinedTheme}>
        <StatusBar barStyle={"light-content"} />
        {children}
      </ReactNativeThemeProvider>
    </PaperProvider>
  );
};
