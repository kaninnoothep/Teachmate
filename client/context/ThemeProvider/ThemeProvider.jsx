/**
 * Import Modules
 */
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { PaperProvider, Text, adaptNavigationTheme } from "react-native-paper";
import {
  ThemeProvider as ReactNativeThemeProvider,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createCustomTheme } from "./theme";
import merge from "deepmerge";

/**
 * ThemeProvider
 *
 * @param {*} props
 * @returns JSX Element
 */
export const ThemeProvider = ({ children }) => {
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Inter: require("../../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
  });

  // Create custom Paper theme
  const paperTheme = createCustomTheme("light");

  // Merge React Navigation theme with Paper theme
  const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
  });
  const combinedTheme = merge(LightTheme, paperTheme);

  // Show loading text while fonts are loading
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
