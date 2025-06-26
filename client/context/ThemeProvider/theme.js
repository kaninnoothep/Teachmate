/**
 * Import Modules
 */
import { Colors } from "@/constants/Colors";
import { fontConfig } from "@/constants/fontConfig";
import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";

/**
 * createCustomTheme
 *
 * @param {*} colorScheme
 * @returns createCustomTheme
 */
export const createCustomTheme = (colorScheme) => {
  const isDark = colorScheme === "dark";
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const colors = isDark ? Colors.dark : Colors.light;

  const customTheme = {
    ...baseTheme,
    colors,
    fonts: configureFonts({ config: fontConfig }),
  };

  return customTheme;
};
