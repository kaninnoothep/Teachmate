/**
 * Import Module
 */
import { StyleSheet } from "react-native";

/**
 * useStyles - Specify styles to use
 *
 * @returns StyleSheet object
 */
export const useStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 12,
    },
  });
