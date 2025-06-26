/**
 * Import Modules
 */
import { StyleSheet, Platform, StatusBar } from "react-native";

/**
 * Export Styles to use
 */
export const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
