/**
 * Import Modules
 */
import { Platform } from "react-native";

/**
 * Export Font configuration
 */
export const fontConfig = {
  fontFamily: "Inter",
  displayLarge: { fontWeight: "700" },
  displayMedium: { fontWeight: "700" },
  displaySmall: { fontWeight: "700" },
  headlineLarge: { fontWeight: "600" },
  headlineMedium: { fontWeight: "600" },
  headlineSmall: { fontWeight: "600" },
  titleLarge: { fontWeight: "600" },
  caption: {
    fontFamily: Platform.select({
      web: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: "Inter",
      default: "sans-serif",
    }),
    fontWeight: "400",
    letterSpacing: 0.5,
    fontSize: 10,
  },
};
