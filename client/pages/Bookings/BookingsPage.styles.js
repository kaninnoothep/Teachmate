/**
 * Import Module
 */
import { StyleSheet } from "react-native";

/**
 * useStyles - Specify styles to use for bookings page
 *
 * @returns StyleSheet object
 */
export const useStyles = () =>
  StyleSheet.create({
    container: {
      height: "100%",
    },
    greetingText: { fontWeight: "700" },
    listHeaderContainer: {
      paddingTop: 26,
      paddingBottom: 20,
      gap: 18,
    },
    listContentContainer: {
      paddingHorizontal: 16,
    },
  });
